-- 数据库迁移脚本：添加缺少的 ip_address 字段
-- 修复生产环境中缺少的字段问题

-- 检查并添加 urge_history 表的 ip_address 字段
ALTER TABLE urge_history 
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) NOT NULL DEFAULT '0.0.0.0' 
AFTER tutorial_id;

-- 检查并添加 urge_history 表的 user_agent 字段（如果也缺少）
ALTER TABLE urge_history 
ADD COLUMN IF NOT EXISTS user_agent TEXT 
AFTER ip_address;

-- 添加索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_urge_history_ip_address ON urge_history (ip_address);
CREATE INDEX IF NOT EXISTS idx_urge_history_tutorial_ip ON urge_history (tutorial_id, ip_address);

-- 检查并创建 urge_limits 表（如果不存在）
CREATE TABLE IF NOT EXISTS urge_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutorial_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    urge_count INT DEFAULT 1,
    last_urge_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tutorial_ip (tutorial_id, ip_address),
    INDEX idx_tutorial_id (tutorial_id),
    INDEX idx_ip_address (ip_address),
    INDEX idx_last_urge_at (last_urge_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 检查并创建 tutorial_urges 表（如果不存在）
CREATE TABLE IF NOT EXISTS tutorial_urges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutorial_id VARCHAR(255) NOT NULL,
    urge_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tutorial (tutorial_id),
    INDEX idx_tutorial_id (tutorial_id),
    INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 显示迁移完成信息
SELECT 'Database migration completed successfully!' as status;

-- 显示表结构以确认修改
DESCRIBE urge_history;
DESCRIBE urge_limits;
DESCRIBE tutorial_urges;