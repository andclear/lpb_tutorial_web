/**
 * 数据库连接和操作工具
 * 提供连接池、错误处理和类型安全的数据库操作
 */

import mysql from 'mysql2/promise'
import { env, devLog, devError } from './env'
import { DatabaseResult, UrgeRecord, UrgeHistory, UrgeLimit, DEFAULT_URGE_CONFIG } from './types'

// 数据库连接池
let pool: mysql.Pool | null = null

// 获取数据库连接池
function getPool(): mysql.Pool {
  if (!pool) {
    // 解析数据库 URL 并添加 SSL 配置
    const dbUrl = new URL(env.DATABASE_URL)
    
    pool = mysql.createPool({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 4000,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1), // 移除开头的 '/'
      connectionLimit: 10,
      acquireTimeout: 60000,
      reconnect: true,
      idleTimeout: 300000,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false // TiDB Cloud 需要 SSL 但可能使用自签名证书
      }
    })
    
    devLog('Database connection pool created')
  }
  return pool
}

// 执行SQL查询的通用方法
async function executeQuery<T = any>(
  query: string, 
  params: any[] = []
): Promise<DatabaseResult<T>> {
  const connection = getPool()
  
  try {
    devLog('Executing query:', query, 'with params:', params)
    const [results] = await connection.execute(query, params)
    
    return {
      success: true,
      data: results as T,
      affectedRows: Array.isArray(results) ? results.length : (results as any).affectedRows
    }
  } catch (error) {
    devError('Database query failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error'
    }
  }
}

// 初始化数据库表
export async function initializeTables(): Promise<boolean> {
  try {
    devLog('Initializing database tables...')
    
    // 创建催更统计表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS tutorial_urges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tutorial_id VARCHAR(100) NOT NULL UNIQUE,
        urge_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tutorial_id (tutorial_id),
        INDEX idx_updated_at (updated_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // 创建催更历史表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS urge_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tutorial_id VARCHAR(100) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_tutorial_id (tutorial_id),
        INDEX idx_ip_address (ip_address),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // 创建催更限制表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS urge_limits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tutorial_id VARCHAR(100) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        urge_count INT DEFAULT 0,
        last_urge_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_tutorial_ip (tutorial_id, ip_address),
        INDEX idx_tutorial_id (tutorial_id),
        INDEX idx_ip_address (ip_address),
        INDEX idx_last_urge_at (last_urge_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    devLog('Database tables initialized successfully')
    return true
  } catch (error) {
    devError('Failed to initialize database tables:', error)
    return false
  }
}

// 获取教程催更统计
export async function getUrgeCount(tutorialId: string): Promise<number> {
  const result = await executeQuery<UrgeRecord[]>(
    'SELECT urge_count FROM tutorial_urges WHERE tutorial_id = ?',
    [tutorialId]
  )
  
  if (result.success && result.data && result.data.length > 0) {
    return result.data[0].urge_count
  }
  
  return 0
}

// 检查IP催更限制
export async function checkUrgeLimit(tutorialId: string, ipAddress: string): Promise<{
  canUrge: boolean
  remainingUrges: number
  nextUrgeTime?: Date
}> {
  const result = await executeQuery<UrgeLimit[]>(
    'SELECT * FROM urge_limits WHERE tutorial_id = ? AND ip_address = ?',
    [tutorialId, ipAddress]
  )
  
  if (!result.success || !result.data || result.data.length === 0) {
    return {
      canUrge: true,
      remainingUrges: DEFAULT_URGE_CONFIG.maxUrgesPerDay
    }
  }
  
  const limit = result.data[0]
  const now = new Date()
  const lastUrge = new Date(limit.last_urge_at)
  
  // 检查是否在24小时内
  const hoursSinceLastUrge = (now.getTime() - lastUrge.getTime()) / (1000 * 60 * 60)
  
  if (hoursSinceLastUrge >= 24) {
    // 超过24小时，重置计数
    return {
      canUrge: true,
      remainingUrges: DEFAULT_URGE_CONFIG.maxUrgesPerDay
    }
  }
  
  const remainingUrges = Math.max(0, DEFAULT_URGE_CONFIG.maxUrgesPerDay - limit.urge_count)
  
  return {
    canUrge: remainingUrges > 0,
    remainingUrges,
    nextUrgeTime: remainingUrges === 0 ? new Date(lastUrge.getTime() + 24 * 60 * 60 * 1000) : undefined
  }
}

// 执行催更操作（事务）
export async function performUrge(
  tutorialId: string, 
  ipAddress: string, 
  userAgent?: string
): Promise<DatabaseResult<{ urgeCount: number; remainingUrges: number }>> {
  const connection = await getPool().getConnection()
  
  try {
    await connection.beginTransaction()
    
    // 1. 更新或插入催更统计
    await connection.execute(`
      INSERT INTO tutorial_urges (tutorial_id, urge_count) 
      VALUES (?, 1) 
      ON DUPLICATE KEY UPDATE 
        urge_count = urge_count + 1,
        updated_at = CURRENT_TIMESTAMP
    `, [tutorialId])
    
    // 2. 记录催更历史
    await connection.execute(`
      INSERT INTO urge_history (tutorial_id, ip_address, user_agent) 
      VALUES (?, ?, ?)
    `, [tutorialId, ipAddress, userAgent])
    
    // 3. 更新或插入IP限制记录
    await connection.execute(`
      INSERT INTO urge_limits (tutorial_id, ip_address, urge_count, last_urge_at) 
      VALUES (?, ?, 1, CURRENT_TIMESTAMP) 
      ON DUPLICATE KEY UPDATE 
        urge_count = CASE 
          WHEN TIMESTAMPDIFF(HOUR, last_urge_at, CURRENT_TIMESTAMP) >= 24 THEN 1
          ELSE urge_count + 1
        END,
        last_urge_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    `, [tutorialId, ipAddress])
    
    // 4. 获取更新后的统计数据
    const [urgeResult] = await connection.execute(
      'SELECT urge_count FROM tutorial_urges WHERE tutorial_id = ?',
      [tutorialId]
    ) as [UrgeRecord[], any]
    
    const [limitResult] = await connection.execute(
      'SELECT urge_count FROM urge_limits WHERE tutorial_id = ? AND ip_address = ?',
      [tutorialId, ipAddress]
    ) as [UrgeLimit[], any]
    
    await connection.commit()
    
    const urgeCount = urgeResult[0]?.urge_count || 0
    const userUrgeCount = limitResult[0]?.urge_count || 0
    const remainingUrges = Math.max(0, DEFAULT_URGE_CONFIG.maxUrgesPerDay - userUrgeCount)
    
    devLog(`Urge successful for tutorial ${tutorialId}, total: ${urgeCount}, user remaining: ${remainingUrges}`)
    
    return {
      success: true,
      data: { urgeCount, remainingUrges }
    }
    
  } catch (error) {
    await connection.rollback()
    devError('Urge transaction failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed'
    }
  } finally {
    connection.release()
  }
}

// 获取催更统计信息
export async function getUrgeStats(tutorialId: string): Promise<DatabaseResult<{
  totalUrges: number
  todayUrges: number
  uniqueUsers: number
}>> {
  try {
    // 获取总催更数
    const totalResult = await executeQuery<UrgeRecord[]>(
      'SELECT urge_count FROM tutorial_urges WHERE tutorial_id = ?',
      [tutorialId]
    )
    
    // 获取今日催更数
    const todayResult = await executeQuery<any[]>(
      'SELECT COUNT(*) as count FROM urge_history WHERE tutorial_id = ? AND DATE(created_at) = CURDATE()',
      [tutorialId]
    )
    
    // 获取独立用户数
    const uniqueResult = await executeQuery<any[]>(
      'SELECT COUNT(DISTINCT ip_address) as count FROM urge_history WHERE tutorial_id = ?',
      [tutorialId]
    )
    
    return {
      success: true,
      data: {
        totalUrges: totalResult.data?.[0]?.urge_count || 0,
        todayUrges: todayResult.data?.[0]?.count || 0,
        uniqueUsers: uniqueResult.data?.[0]?.count || 0
      }
    }
  } catch (error) {
    devError('Failed to get urge stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get stats'
    }
  }
}

// 清理过期数据（可选的维护功能）
export async function cleanupOldData(daysToKeep: number = 30): Promise<boolean> {
  try {
    devLog(`Cleaning up data older than ${daysToKeep} days...`)
    
    await executeQuery(
      'DELETE FROM urge_history WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [daysToKeep]
    )
    
    await executeQuery(
      'DELETE FROM urge_limits WHERE updated_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [daysToKeep]
    )
    
    devLog('Data cleanup completed')
    return true
  } catch (error) {
    devError('Data cleanup failed:', error)
    return false
  }
}

// 测试数据库连接
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const connection = await getPool().getConnection()
    await connection.ping()
    connection.release()
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    throw error
  }
}

// 获取数据库连接池状态
export function getPoolStatus() {
  if (!pool) {
    return {
      connected: false,
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0
    }
  }

  return {
    connected: true,
    totalConnections: (pool as any)._allConnections?.length || 0,
    activeConnections: (pool as any)._acquiringConnections?.length || 0,
    idleConnections: (pool as any)._freeConnections?.length || 0
  }
}

// 关闭连接池
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    console.log('Database connection pool closed')
  }
}

// 初始化数据库
initializeTables().catch(error => {
  devError('Failed to initialize database:', error)
})