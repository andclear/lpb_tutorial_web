import { NextRequest } from 'next/server'
import { createSuccessResponse, createErrorResponse, handleApiError } from '@/lib/api'
import { performanceMonitor, getHealthStatus, formatBytes } from '@/lib/monitoring'
import { testDatabaseConnection } from '@/lib/database'

// GET /api/health - 健康检查
export async function GET(request: NextRequest) {
  try {
    const healthStatus = getHealthStatus()
    const slowRequests = performanceMonitor.getSlowRequests(1000, 5)
    const errorRequests = performanceMonitor.getErrorRequests(5)
    
    // 测试数据库连接
    let dbStatus = 'unknown'
    let dbError = null
    
    try {
      await testDatabaseConnection()
      dbStatus = 'connected'
    } catch (error) {
      dbStatus = 'disconnected'
      dbError = error instanceof Error ? error.message : 'Database connection failed'
    }
    
    const response = {
      status: healthStatus.status,
      timestamp: new Date().toISOString(),
      uptime: Math.round(healthStatus.uptime),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      
      // API 性能指标
      api: {
        ...healthStatus.metrics,
        slowRequests: slowRequests.map(req => ({
          url: req.url,
          method: req.method,
          duration: req.duration,
          timestamp: new Date(req.startTime).toISOString()
        })),
        errorRequests: errorRequests.map(req => ({
          url: req.url,
          method: req.method,
          statusCode: req.statusCode,
          error: req.error,
          timestamp: new Date(req.startTime).toISOString()
        }))
      },
      
      // 内存使用情况
      memory: {
        current: {
          rss: formatBytes(healthStatus.memory.current.rss),
          heapTotal: formatBytes(healthStatus.memory.current.heapTotal),
          heapUsed: formatBytes(healthStatus.memory.current.heapUsed),
          external: formatBytes(healthStatus.memory.current.external),
          heapUsagePercent: Math.round(
            (healthStatus.memory.current.heapUsed / healthStatus.memory.current.heapTotal) * 100
          )
        },
        average: healthStatus.memory.average.rss ? {
          rss: formatBytes(healthStatus.memory.average.rss),
          heapTotal: formatBytes(healthStatus.memory.average.heapTotal!),
          heapUsed: formatBytes(healthStatus.memory.average.heapUsed!),
          external: formatBytes(healthStatus.memory.average.external!)
        } : null,
        peak: healthStatus.memory.peak.rss ? {
          rss: formatBytes(healthStatus.memory.peak.rss),
          heapTotal: formatBytes(healthStatus.memory.peak.heapTotal!),
          heapUsed: formatBytes(healthStatus.memory.peak.heapUsed!),
          external: formatBytes(healthStatus.memory.peak.external!)
        } : null
      },
      
      // 数据库状态
      database: {
        status: dbStatus,
        error: dbError
      },
      
      // 系统信息
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cpuUsage: process.cpuUsage(),
        pid: process.pid
      }
    }
    
    // 根据健康状态设置 HTTP 状态码
    const statusCode = healthStatus.status === 'critical' ? 503 : 200
    
    return new Response(JSON.stringify(createSuccessResponse(response)), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Health check failed:', error)
    return handleApiError(error)
  }
}

// POST /api/health/reset - 重置监控数据（仅开发环境）
export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return new Response(JSON.stringify(createErrorResponse('Not allowed in production')), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    performanceMonitor.reset()
    
    return new Response(JSON.stringify(createSuccessResponse({
      message: 'Performance monitoring data has been reset',
      timestamp: new Date().toISOString()
    })), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Failed to reset monitoring data:', error)
    return handleApiError(error)
  }
}