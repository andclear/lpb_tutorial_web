/**
 * 催更功能 API 路由
 * 提供类型安全的催更操作和统计查询
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
  checkUrgeLimit, 
  performUrge, 
  getUrgeStats 
} from '@/lib/database'
import { 
  validateTutorialId, 
  validateIPAddress,
  DEFAULT_URGE_CONFIG 
} from '@/lib/types'
import { devLog, devError } from '@/lib/env'
import { performanceMonitor } from '@/lib/monitoring'
import { urgeCache, cacheUtils } from '@/lib/cache'

// POST - 执行催更操作
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
    
    // 验证IP地址
    if (!validateIPAddress(ipAddress)) {
      performanceMonitor.endRequest(requestId, 400, 'Invalid IP address')
      throw ApiErrors.ValidationError('无效的IP地址')
    }
    
    // 检查催更限制（先检查缓存）
    const limitCacheKey = cacheUtils.ipLimitKey(tutorialId, ipAddress)
    let limitCheck = urgeCache.get<{ canUrge: boolean; remainingUrges: number; nextUrgeTime?: Date }>(limitCacheKey)
    
    if (limitCheck === null) {
      // 缓存未命中，从数据库检查
      const dbStartTime = Date.now()
      limitCheck = await checkUrgeLimit(tutorialId, ipAddress)
      performanceMonitor.recordDbQuery(requestId, Date.now() - dbStartTime)
      
      // 存储到缓存（较短的TTL，因为限制状态变化较快）
      urgeCache.set(limitCacheKey, limitCheck, 30 * 1000) // 30秒缓存
    }
    
    if (!limitCheck.canUrge) {
      const nextUrgeTime = limitCheck.nextUrgeTime
      const message = nextUrgeTime 
        ? `您今天已经催更${DEFAULT_URGE_CONFIG.maxUrgesPerDay}次了，请明天再来！`
        : '催更过于频繁，请稍后再试'
      
      performanceMonitor.endRequest(requestId, 429, 'Rate limit exceeded')
      throw ApiErrors.RateLimitExceeded(message)
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
    
    // 清除相关缓存
    urgeCache.delete(cacheUtils.urgeKey(tutorialId, 'count'))
    urgeCache.delete(limitCacheKey)
    
    // 构造成功响应
    const successMessage = remainingUrges > 0 
      ? '催更成功！老婆宝会加快进度的~' 
      : '催更成功！您今天的催更次数已用完，明天再来吧~'
    
    performanceMonitor.endRequest(requestId, 200)
    return Response.json(
      createSuccessResponse({
        urgeCount,
        remainingUrges,
        message: successMessage,
        nextUrgeTime: remainingUrges === 0 ? limitCheck.nextUrgeTime : undefined
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}