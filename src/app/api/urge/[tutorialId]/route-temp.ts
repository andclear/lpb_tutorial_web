/**
 * 催更功能 API 路由 - 临时简化版本
 * 解决生产环境 ip_address 字段缺失问题
 */

import { NextRequest } from 'next/server'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError, 
  getClientIP,
  ApiErrors 
} from '@/lib/api'
import { 
  getUrgeCount, 
  performUrge, 
  getUrgeStats 
} from '@/lib/database'
import { 
  validateTutorialId, 
  DEFAULT_URGE_CONFIG 
} from '@/lib/types'
import { devLog, devError } from '@/lib/env'
import { performanceMonitor } from '@/lib/monitoring'
import { urgeCache, cacheUtils } from '@/lib/cache'

// POST - 执行催更操作（简化版本）
export async function POST(
  request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  const requestId = performanceMonitor.startRequest(request)
  
  try {
    const { tutorialId } = params
    
    // 验证教程ID
    if (!validateTutorialId(tutorialId)) {
      performanceMonitor.endRequest(requestId, 400, 'Invalid tutorial ID')
      throw ApiErrors.ValidationError('无效的教程ID')
    }
    
    // 获取客户端IP和User-Agent
    const ipAddress = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || undefined
    
    devLog(`Urge request for tutorial ${tutorialId} from IP ${ipAddress}`)
    
    // 简单的频率限制（基于内存缓存）
    const rateLimitKey = `rate_limit_${tutorialId}_${ipAddress}`
    const lastUrgeTime = urgeCache.get<number>(rateLimitKey)
    const now = Date.now()
    
    // 限制同一IP每分钟最多催更一次
    if (lastUrgeTime && (now - lastUrgeTime) < 60 * 1000) {
      performanceMonitor.endRequest(requestId, 429, 'Rate limit exceeded')
      throw ApiErrors.RateLimitExceeded('催更过于频繁，请稍后再试')
    }
    
    // 执行催更操作
    const dbStartTime = Date.now()
    const result = await performUrge(tutorialId, ipAddress, userAgent)
    performanceMonitor.recordDbQuery(requestId, Date.now() - dbStartTime)
    
    if (!result.success) {
      performanceMonitor.endRequest(requestId, 500, result.error || '催更操作失败')
      throw ApiErrors.DatabaseError(result.error || '催更操作失败')
    }
    
    const { urgeCount, remainingUrges } = result.data!
    
    // 设置频率限制
    urgeCache.set(rateLimitKey, now, 60 * 1000) // 1分钟
    
    // 清除相关缓存
    urgeCache.delete(cacheUtils.urgeKey(tutorialId, 'count'))
    
    // 构造成功响应
    const successMessage = '催更成功！老婆宝会加快进度的~'
    
    performanceMonitor.endRequest(requestId, 200)
    return Response.json(
      createSuccessResponse({
        urgeCount,
        remainingUrges: Math.max(0, DEFAULT_URGE_CONFIG.maxUrgesPerDay - 1), // 简化的剩余次数
        message: successMessage
      }),
      { status: 200 }
    )
    
  } catch (error) {
    devError('POST /api/urge/[tutorialId] error:', error)
    const errorMessage = error instanceof Error ? error.message : '催更操作失败'
    performanceMonitor.endRequest(requestId, 500, errorMessage)
    return handleApiError(error)
  }
}

// GET - 获取催更统计
export async function GET(
  request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  const requestId = performanceMonitor.startRequest(request)
  
  try {
    const { tutorialId } = params
    
    // 验证教程ID
    if (!validateTutorialId(tutorialId)) {
      performanceMonitor.endRequest(requestId, 400, 'Invalid tutorial ID')
      throw ApiErrors.ValidationError('无效的教程ID')
    }
    
    devLog(`Get urge stats for tutorial ${tutorialId}`)
    
    // 尝试从缓存获取基础催更数量
    const cacheKey = cacheUtils.urgeKey(tutorialId, 'count')
    let urgeCount = urgeCache.get<number>(cacheKey)
    
    if (urgeCount === null) {
      // 缓存未命中，从数据库获取
      const dbStartTime = Date.now()
      urgeCount = await getUrgeCount(tutorialId)
      performanceMonitor.recordDbQuery(requestId, Date.now() - dbStartTime)
      
      // 存储到缓存
      urgeCache.set(cacheKey, urgeCount, 2 * 60 * 1000) // 2分钟缓存
    }
    
    // 获取详细统计（可选）
    const includeStats = request.nextUrl.searchParams.get('includeStats') === 'true'
    
    if (includeStats) {
      const statsCacheKey = cacheUtils.urgeKey(tutorialId, 'stats')
      let statsData = urgeCache.get<any>(statsCacheKey)
      
      if (statsData === null) {
        const dbStartTime = Date.now()
        const statsResult = await getUrgeStats(tutorialId)
        performanceMonitor.recordDbQuery(requestId, Date.now() - dbStartTime)
        
        if (!statsResult.success) {
          performanceMonitor.endRequest(requestId, 500, statsResult.error || '获取统计数据失败')
          throw ApiErrors.DatabaseError(statsResult.error || '获取统计数据失败')
        }
        
        statsData = statsResult.data
        urgeCache.set(statsCacheKey, statsData, 5 * 60 * 1000) // 5分钟缓存
      }
      
      performanceMonitor.endRequest(requestId, 200)
      return Response.json(
        createSuccessResponse({
          urgeCount,
          ...statsData
        }),
        { status: 200 }
      )
    }
    
    // 返回基础数据
    performanceMonitor.endRequest(requestId, 200)
    return Response.json(
      createSuccessResponse({ urgeCount }),
      { status: 200 }
    )
    
  } catch (error) {
    devError('GET /api/urge/[tutorialId] error:', error)
    const errorMessage = error instanceof Error ? error.message : '获取统计数据失败'
    performanceMonitor.endRequest(requestId, 500, errorMessage)
    return handleApiError(error)
  }
}

// OPTIONS - CORS 预检请求
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}