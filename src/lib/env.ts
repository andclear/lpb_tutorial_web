/**
 * 环境变量管理工具
 * 提供类型安全的环境变量访问和运行时验证
 */

interface EnvConfig {
  DATABASE_URL: string
  NEXT_PUBLIC_APP_URL: string
  NODE_ENV: string
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV || 'development',
  }

  // 验证必需的环境变量
  const missingVars: string[] = []
  
  if (!requiredEnvVars.DATABASE_URL) {
    missingVars.push('DATABASE_URL')
  }
  
  if (!requiredEnvVars.NEXT_PUBLIC_APP_URL) {
    missingVars.push('NEXT_PUBLIC_APP_URL')
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    )
  }

  return requiredEnvVars as EnvConfig
}

// 导出验证后的环境变量
export const env = validateEnv()

// 环境检查工具
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// 日志工具（仅在开发环境输出）
export const devLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log('[DEV]', ...args)
  }
}

export const devError = (...args: any[]) => {
  if (isDevelopment) {
    console.error('[DEV ERROR]', ...args)
  }
}