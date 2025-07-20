/**
 * API 响应类型定义和工具函数
 * 提供统一的API响应格式和错误处理
 */

// 统一的API响应格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
  message?: string
}

// API错误代码枚举
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// 成功响应构造器
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

// 错误响应构造器
export function createErrorResponse(
  error: string,
  code?: ApiErrorCode,
  statusCode?: number
): ApiResponse {
  return {
    success: false,
    error,
    code,
  }
}

// API错误类
export class ApiError extends Error {
  public readonly code: ApiErrorCode
  public readonly statusCode: number

  constructor(message: string, code: ApiErrorCode = ApiErrorCode.INTERNAL_ERROR, statusCode: number = 500) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
  }
}

// 常用错误实例
export const ApiErrors = {
  ValidationError: (message: string) => 
    new ApiError(message, ApiErrorCode.VALIDATION_ERROR, 400),
  
  DatabaseError: (message: string = '数据库操作失败') => 
    new ApiError(message, ApiErrorCode.DATABASE_ERROR, 500),
  
  RateLimitExceeded: (message: string = '请求过于频繁，请稍后再试') => 
    new ApiError(message, ApiErrorCode.RATE_LIMIT_EXCEEDED, 429),
  
  NotFound: (message: string = '资源未找到') => 
    new ApiError(message, ApiErrorCode.NOT_FOUND, 404),
  
  Unauthorized: (message: string = '未授权访问') => 
    new ApiError(message, ApiErrorCode.UNAUTHORIZED, 401),
}

// Next.js API路由错误处理中间件
export function handleApiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(
      createErrorResponse(error.message, error.code),
      { status: error.statusCode }
    )
  }

  // 未知错误
  console.error('Unexpected API error:', error)
  return Response.json(
    createErrorResponse('服务器内部错误', ApiErrorCode.INTERNAL_ERROR),
    { status: 500 }
  )
}

// IP地址获取工具
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}