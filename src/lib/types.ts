/**
 * 数据库类型定义
 * 提供严格的类型安全和数据验证
 */

// 催更记录类型
export interface UrgeRecord {
  id: number
  tutorial_id: string
  urge_count: number
  created_at: Date
  updated_at: Date
}

// 催更历史记录类型
export interface UrgeHistory {
  id: number
  tutorial_id: string
  ip_address: string
  user_agent?: string
  created_at: Date
}

// 催更限制记录类型
export interface UrgeLimit {
  id: number
  tutorial_id: string
  ip_address: string
  urge_count: number
  last_urge_at: Date
  created_at: Date
  updated_at: Date
}

// 催更请求参数类型
export interface UrgeRequest {
  tutorialId: string
  ipAddress: string
  userAgent?: string
}

// 催更响应数据类型
export interface UrgeResponseData {
  urgeCount: number
  remainingUrges: number
  message: string
  nextUrgeTime?: Date
}

// 催更统计数据类型
export interface UrgeStats {
  tutorialId: string
  totalUrges: number
  todayUrges: number
  uniqueUsers: number
  lastUrgeTime?: Date
}

// 数据库操作结果类型
export interface DatabaseResult<T = any> {
  success: boolean
  data?: T
  error?: string
  affectedRows?: number
}

// 教程类型（扩展版本）
export interface Tutorial {
  id: string
  title: string
  description?: string
  remark?: string
  linkUrl?: string
  colorTheme: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo'
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// 催更配置类型
export interface UrgeConfig {
  maxUrgesPerDay: number
  cooldownMinutes: number
  enableRateLimit: boolean
  enableIPTracking: boolean
}

// 默认催更配置
export const DEFAULT_URGE_CONFIG: UrgeConfig = {
  maxUrgesPerDay: 2,
  cooldownMinutes: 5,
  enableRateLimit: true,
  enableIPTracking: true,
}

// 数据验证工具
export function validateTutorialId(tutorialId: string): boolean {
  return typeof tutorialId === 'string' && tutorialId.length > 0 && tutorialId.length <= 100
}

export function validateIPAddress(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip === 'unknown'
}

// 时间工具
export function isWithin24Hours(date: Date): boolean {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours < 24
}

export function getNextUrgeTime(lastUrgeTime: Date, cooldownMinutes: number): Date {
  return new Date(lastUrgeTime.getTime() + cooldownMinutes * 60 * 1000)
}