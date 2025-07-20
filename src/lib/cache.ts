// 简单的内存缓存实现（生产环境建议使用 Redis）
export interface CacheItem<T> {
  value: T
  expiry: number
  createdAt: number
  accessCount: number
  lastAccessed: number
}

export interface CacheStats {
  totalItems: number
  hitRate: number
  missRate: number
  totalHits: number
  totalMisses: number
  memoryUsage: number
  oldestItem?: number
  newestItem?: number
}

export class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private stats = {
    hits: 0,
    misses: 0
  }
  private readonly maxSize: number
  private readonly defaultTTL: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(maxSize: number = 1000, defaultTTL: number = 5 * 60 * 1000) {
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
    
    // 每分钟清理一次过期项
    if (typeof window === 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.cleanup()
      }, 60 * 1000)
    }
  }

  // 设置缓存项
  set<T>(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL)
    const now = Date.now()
    
    this.cache.set(key, {
      value,
      expiry,
      createdAt: now,
      accessCount: 0,
      lastAccessed: now
    })

    // 如果超过最大大小，删除最旧的项
    if (this.cache.size > this.maxSize) {
      this.evictOldest()
    }
  }

  // 获取缓存项
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      this.stats.misses++
      return null
    }

    // 检查是否过期
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      this.stats.misses++
      return null
    }

    // 更新访问统计
    item.accessCount++
    item.lastAccessed = Date.now()
    this.stats.hits++
    
    return item.value
  }

  // 检查键是否存在且未过期
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  // 删除缓存项
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // 清空所有缓存
  clear(): void {
    this.cache.clear()
    this.stats.hits = 0
    this.stats.misses = 0
  }

  // 获取缓存统计
  getStats(): CacheStats {
    const items = Array.from(this.cache.values())
    const totalRequests = this.stats.hits + this.stats.misses
    
    return {
      totalItems: this.cache.size,
      hitRate: totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0,
      missRate: totalRequests > 0 ? (this.stats.misses / totalRequests) * 100 : 0,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      memoryUsage: this.estimateMemoryUsage(),
      oldestItem: items.length > 0 ? Math.min(...items.map(i => i.createdAt)) : undefined,
      newestItem: items.length > 0 ? Math.max(...items.map(i => i.createdAt)) : undefined
    }
  }

  // 获取所有键
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  // 获取缓存大小
  size(): number {
    return this.cache.size
  }

  // 清理过期项
  private cleanup(): void {
    const now = Date.now()
    let cleanedCount = 0
    
    for (const [key, item] of Array.from(this.cache.entries())) {
      if (now > item.expiry) {
        this.cache.delete(key)
        cleanedCount++
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`Cache cleanup: removed ${cleanedCount} expired items`)
    }
  }

  // 驱逐最旧的项
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Date.now()
    
    for (const [key, item] of Array.from(this.cache.entries())) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed
        oldestKey = key
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  // 估算内存使用量（粗略估算）
  private estimateMemoryUsage(): number {
    let size = 0
    
    for (const [key, item] of Array.from(this.cache.entries())) {
      // 估算键的大小
      size += key.length * 2 // 假设每个字符 2 字节
      
      // 估算值的大小
      try {
        size += JSON.stringify(item.value).length * 2
      } catch {
        size += 100 // 如果无法序列化，使用默认值
      }
      
      // 元数据大小
      size += 64 // 估算 CacheItem 元数据大小
    }
    
    return size
  }

  // 销毁缓存
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.clear()
  }
}

// 创建全局缓存实例
export const globalCache = new MemoryCache(1000, 5 * 60 * 1000) // 1000项，5分钟TTL

// 催更数据专用缓存
export const urgeCache = new MemoryCache(500, 2 * 60 * 1000) // 500项，2分钟TTL

// 缓存装饰器
export function cached(
  cache: MemoryCache = globalCache,
  ttl?: number,
  keyGenerator?: (...args: any[]) => string
) {
  return function <T extends any[], R>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: T) => Promise<R>>
  ) {
    const originalMethod = descriptor.value!
    
    descriptor.value = async function (...args: T): Promise<R> {
      // 生成缓存键
      const cacheKey = keyGenerator 
        ? keyGenerator(...args)
        : `${propertyName}_${JSON.stringify(args)}`
      
      // 尝试从缓存获取
      const cachedResult = cache.get<R>(cacheKey)
      if (cachedResult !== null) {
        return cachedResult
      }
      
      // 执行原方法
      const result = await originalMethod.apply(this, args)
      
      // 存储到缓存
      cache.set(cacheKey, result, ttl)
      
      return result
    }
  }
}

// 缓存工具函数
export const cacheUtils = {
  // 生成催更缓存键
  urgeKey: (tutorialId: string, type: 'count' | 'limit' | 'stats') => 
    `urge_${type}_${tutorialId}`,
  
  // 生成 IP 限制缓存键
  ipLimitKey: (tutorialId: string, ip: string) => 
    `ip_limit_${tutorialId}_${ip}`,
  
  // 批量删除匹配模式的缓存
  deletePattern: (cache: MemoryCache, pattern: string) => {
    const keys = cache.keys().filter(key => key.includes(pattern))
    keys.forEach(key => cache.delete(key))
    return keys.length
  },
  
  // 预热缓存
  warmup: async (cache: MemoryCache, data: Array<{ key: string, value: any, ttl?: number }>) => {
    for (const item of data) {
      cache.set(item.key, item.value, item.ttl)
    }
  },
  
  // 格式化缓存大小
  formatCacheSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// 缓存中间件
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: {
    cache?: MemoryCache
    ttl?: number
    keyGenerator?: (...args: T) => string
    skipCache?: (...args: T) => boolean
  } = {}
): (...args: T) => Promise<R> {
  const {
    cache = globalCache,
    ttl,
    keyGenerator,
    skipCache
  } = options

  return async (...args: T): Promise<R> => {
    // 检查是否跳过缓存
    if (skipCache && skipCache(...args)) {
      return await fn(...args)
    }

    // 生成缓存键
    const cacheKey = keyGenerator 
      ? keyGenerator(...args)
      : `fn_${fn.name}_${JSON.stringify(args)}`
    
    // 尝试从缓存获取
    const cachedResult = cache.get<R>(cacheKey)
    if (cachedResult !== null) {
      return cachedResult
    }
    
    // 执行函数
    const result = await fn(...args)
    
    // 存储到缓存
    cache.set(cacheKey, result, ttl)
    
    return result
  }
}