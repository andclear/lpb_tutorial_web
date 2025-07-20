/**
 * 基础类型定义
 * 提供严格的类型安全和数据验证
 */

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

// 数据验证工具
export function validateTutorialId(tutorialId: string): boolean {
  return typeof tutorialId === 'string' && tutorialId.length > 0 && tutorialId.length <= 100
}

// 时间工具
export function isWithin24Hours(date: Date): boolean {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours < 24
}