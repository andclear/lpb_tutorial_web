import { NextRequest } from 'next/server'

// 性能监控类型定义
export interface PerformanceMetrics {
  requestId: string
  method: string
  url: string
  userAgent?: string
  ip?: string
  startTime: number
  endTime?: number
  duration?: number
  statusCode?: number
  error?: string
  memoryUsage?: NodeJS.MemoryUsage
  dbQueryCount?: number
  dbQueryTime?: number
}

export interface ApiMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  slowestRequest: number
  fastestRequest: number
  errorRate: number
  requestsPerMinute: number
}

// 内存中的性能数据存储（生产环境建议使用 Redis）
class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map()
  private readonly maxMetrics = 1000 // 最多保存 1000 条记录
  private readonly cleanupInterval = 5 * 60 * 1000 // 5分钟清理一次

  constructor() {
    // 定期清理过期数据
    if (typeof window === 'undefined') { // 只在服务器端运行
      setInterval(() => {
        this.cleanup()
      }, this.cleanupInterval)
    }
  }

  // 开始监控请求
  startRequest(request: NextRequest): string {
    const requestId = this.generateRequestId()
    const startTime = Date.now()
    
    const metrics: PerformanceMetrics = {
      requestId,
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: this.getClientIP(request),
      startTime,
      memoryUsage: process.memoryUsage(),
      dbQueryCount: 0,
      dbQueryTime: 0
    }

    this.metrics.set(requestId, metrics)
    return requestId
  }

  // 结束监控请求
  endRequest(requestId: string, statusCode: number, error?: string): void {
    const metrics = this.metrics.get(requestId)
    if (!metrics) return

    const endTime = Date.now()
    metrics.endTime = endTime
    metrics.duration = endTime - metrics.startTime
    metrics.statusCode = statusCode
    metrics.error = error

    // 记录内存使用情况
    metrics.memoryUsage = process.memoryUsage()

    this.metrics.set(requestId, metrics)

    // 如果是慢请求或错误请求，记录日志
    if (metrics.duration > 1000 || error) {
      this.logSlowOrErrorRequest(metrics)
    }
  }

  // 记录数据库查询
  recordDbQuery(requestId: string, queryTime: number): void {
    const metrics = this.metrics.get(requestId)
    if (!metrics) return

    metrics.dbQueryCount = (metrics.dbQueryCount || 0) + 1
    metrics.dbQueryTime = (metrics.dbQueryTime || 0) + queryTime
  }

  // 获取 API 统计信息
  getApiMetrics(timeWindow: number = 60 * 60 * 1000): ApiMetrics {
    const now = Date.now()
    const windowStart = now - timeWindow
    
    const recentMetrics = Array.from(this.metrics.values())
      .filter(m => m.startTime >= windowStart && m.endTime)

    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        slowestRequest: 0,
        fastestRequest: 0,
        errorRate: 0,
        requestsPerMinute: 0
      }
    }

    const durations = recentMetrics.map(m => m.duration!).filter(d => d > 0)
    const successfulRequests = recentMetrics.filter(m => 
      m.statusCode && m.statusCode >= 200 && m.statusCode < 400
    ).length
    const failedRequests = recentMetrics.length - successfulRequests

    return {
      totalRequests: recentMetrics.length,
      successfulRequests,
      failedRequests,
      averageResponseTime: durations.length > 0 
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 0,
      slowestRequest: durations.length > 0 ? Math.max(...durations) : 0,
      fastestRequest: durations.length > 0 ? Math.min(...durations) : 0,
      errorRate: recentMetrics.length > 0 
        ? Math.round((failedRequests / recentMetrics.length) * 100)
        : 0,
      requestsPerMinute: Math.round((recentMetrics.length / timeWindow) * 60 * 1000)
    }
  }

  // 获取慢请求列表
  getSlowRequests(threshold: number = 1000, limit: number = 10): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
      .filter(m => m.duration && m.duration > threshold)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, limit)
  }

  // 获取错误请求列表
  getErrorRequests(limit: number = 10): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
      .filter(m => m.error || (m.statusCode && m.statusCode >= 400))
      .sort((a, b) => (b.startTime || 0) - (a.startTime || 0))
      .slice(0, limit)
  }

  // 获取内存使用统计
  getMemoryStats(): {
    current: NodeJS.MemoryUsage
    average: Partial<NodeJS.MemoryUsage>
    peak: Partial<NodeJS.MemoryUsage>
  } {
    const current = process.memoryUsage()
    const allMemoryUsage = Array.from(this.metrics.values())
      .map(m => m.memoryUsage)
      .filter(Boolean) as NodeJS.MemoryUsage[]

    if (allMemoryUsage.length === 0) {
      return { current, average: {}, peak: {} }
    }

    const average = {
      rss: Math.round(allMemoryUsage.reduce((sum, m) => sum + m.rss, 0) / allMemoryUsage.length),
      heapTotal: Math.round(allMemoryUsage.reduce((sum, m) => sum + m.heapTotal, 0) / allMemoryUsage.length),
      heapUsed: Math.round(allMemoryUsage.reduce((sum, m) => sum + m.heapUsed, 0) / allMemoryUsage.length),
      external: Math.round(allMemoryUsage.reduce((sum, m) => sum + m.external, 0) / allMemoryUsage.length)
    }

    const peak = {
      rss: Math.max(...allMemoryUsage.map(m => m.rss)),
      heapTotal: Math.max(...allMemoryUsage.map(m => m.heapTotal)),
      heapUsed: Math.max(...allMemoryUsage.map(m => m.heapUsed)),
      external: Math.max(...allMemoryUsage.map(m => m.external))
    }

    return { current, average, peak }
  }

  // 生成请求 ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 获取客户端 IP
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const remoteAddr = request.headers.get('remote-addr')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    return realIP || remoteAddr || 'unknown'
  }

  // 记录慢请求或错误请求
  private logSlowOrErrorRequest(metrics: PerformanceMetrics): void {
    const logData = {
      requestId: metrics.requestId,
      method: metrics.method,
      url: metrics.url,
      duration: metrics.duration,
      statusCode: metrics.statusCode,
      error: metrics.error,
      ip: metrics.ip,
      userAgent: metrics.userAgent,
      dbQueryCount: metrics.dbQueryCount,
      dbQueryTime: metrics.dbQueryTime,
      memoryUsage: metrics.memoryUsage
    }

    if (metrics.error || (metrics.statusCode && metrics.statusCode >= 400)) {
      console.error('API Error:', JSON.stringify(logData, null, 2))
    } else if (metrics.duration && metrics.duration > 1000) {
      console.warn('Slow API Request:', JSON.stringify(logData, null, 2))
    }
  }

  // 清理过期数据
  private cleanup(): void {
    const now = Date.now()
    const maxAge = 60 * 60 * 1000 // 1小时
    
    // 删除超过1小时的记录
    for (const [requestId, metrics] of Array.from(this.metrics.entries())) {
      if (now - metrics.startTime > maxAge) {
        this.metrics.delete(requestId)
      }
    }

    // 如果记录数量仍然超过限制，删除最旧的记录
    if (this.metrics.size > this.maxMetrics) {
      const sortedEntries = Array.from(this.metrics.entries())
        .sort(([, a], [, b]) => a.startTime - b.startTime)
      
      const toDelete = sortedEntries.slice(0, this.metrics.size - this.maxMetrics)
      toDelete.forEach(([requestId]) => {
        this.metrics.delete(requestId)
      })
    }
  }

  // 重置所有指标
  reset(): void {
    this.metrics.clear()
  }

  // 导出指标数据
  exportMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
  }
}

// 单例实例
export const performanceMonitor = new PerformanceMonitor()

// 中间件函数
export function withPerformanceMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string = 'unknown'
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now()
    const requestId = `${context}_${startTime}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      const result = await fn(...args)
      const duration = Date.now() - startTime
      
      if (duration > 500) {
        console.warn(`Slow operation in ${context}: ${duration}ms`)
      }
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`Error in ${context} after ${duration}ms:`, error)
      throw error
    }
  }
}

// 数据库查询监控装饰器
export function monitorDbQuery(requestId?: string) {
  return function <T extends any[], R>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: T) => Promise<R>>
  ) {
    const method = descriptor.value!
    
    descriptor.value = async function (...args: T): Promise<R> {
      const startTime = Date.now()
      
      try {
        const result = await method.apply(this, args)
        const queryTime = Date.now() - startTime
        
        if (requestId) {
          performanceMonitor.recordDbQuery(requestId, queryTime)
        }
        
        return result
      } catch (error) {
        const queryTime = Date.now() - startTime
        console.error(`Database query failed after ${queryTime}ms:`, error)
        throw error
      }
    }
  }
}

// 格式化内存大小
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 健康检查函数
export function getHealthStatus(): {
  status: 'healthy' | 'warning' | 'critical'
  metrics: ApiMetrics
  memory: ReturnType<typeof performanceMonitor.getMemoryStats>
  uptime: number
  timestamp: number
} {
  const metrics = performanceMonitor.getApiMetrics()
  const memory = performanceMonitor.getMemoryStats()
  const uptime = process.uptime()
  
  let status: 'healthy' | 'warning' | 'critical' = 'healthy'
  
  // 判断健康状态
  if (metrics.errorRate > 50 || metrics.averageResponseTime > 5000) {
    status = 'critical'
  } else if (metrics.errorRate > 20 || metrics.averageResponseTime > 2000) {
    status = 'warning'
  }
  
  // 检查内存使用
  const memoryUsagePercent = (memory.current.heapUsed / memory.current.heapTotal) * 100
  if (memoryUsagePercent > 90) {
    status = 'critical'
  } else if (memoryUsagePercent > 80) {
    status = status === 'healthy' ? 'warning' : status
  }
  
  return {
    status,
    metrics,
    memory,
    uptime,
    timestamp: Date.now()
  }
}