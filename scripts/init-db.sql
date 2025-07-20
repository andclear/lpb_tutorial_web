-- 数据库初始化脚本
-- 创建催更相关的数据表

-- 1. 教程催更记录表
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

-- 2. 催更历史记录表
CREATE TABLE IF NOT EXISTS urge_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutorial_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tutorial_id (tutorial_id),
    INDEX idx_ip_address (ip_address),
    INDEX idx_created_at (created_at),
    INDEX idx_tutorial_ip (tutorial_id, ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. IP 催更限制表
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
    INDEX idx_last_urge_at (last_urge_at),
    INDEX idx_tutorial_ip (tutorial_id, ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 创建清理过期数据的存储过程
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS CleanupExpiredUrgeData()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    -- 清理 7 天前的催更历史记录
    DELETE FROM urge_history 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
    
    -- 清理 24 小时前的 IP 限制记录
    DELETE FROM urge_limits 
    WHERE last_urge_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
    
    COMMIT;
    
    -- 记录清理结果
    SELECT 
        ROW_COUNT() as cleaned_records,
        NOW() as cleanup_time;
END //

DELIMITER ;

-- 5. 创建获取催更统计的存储过程
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS GetUrgeStats(IN p_tutorial_id VARCHAR(255))
BEGIN
    SELECT 
        tu.tutorial_id,
        tu.urge_count,
        tu.updated_at as last_updated,
        COUNT(uh.id) as total_urge_attempts,
        COUNT(DISTINCT uh.ip_address) as unique_urgers,
        MAX(uh.created_at) as last_urge_time
    FROM tutorial_urges tu
    LEFT JOIN urge_history uh ON tu.tutorial_id = uh.tutorial_id
    WHERE tu.tutorial_id = p_tutorial_id
    GROUP BY tu.tutorial_id, tu.urge_count, tu.updated_at;
END //

DELIMITER ;

-- 6. 创建事件调度器来自动清理过期数据（如果支持）
-- 注意：需要确保 event_scheduler 已启用
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS cleanup_urge_data
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
  CALL CleanupExpiredUrgeData();

-- 7. 插入一些示例数据（可选，用于测试）
-- INSERT INTO tutorial_urges (tutorial_id, urge_count) VALUES 
-- ('test-tutorial-1', 5),
-- ('test-tutorial-2', 12),
-- ('test-tutorial-3', 3);

-- 8. 创建视图来简化查询
CREATE VIEW IF NOT EXISTS urge_summary AS
SELECT 
    tu.tutorial_id,
    tu.urge_count,
    tu.updated_at as last_updated,
    COUNT(DISTINCT uh.ip_address) as unique_urgers,
    COUNT(uh.id) as total_attempts,
    MAX(uh.created_at) as last_urge_time
FROM tutorial_urges tu
LEFT JOIN urge_history uh ON tu.tutorial_id = uh.tutorial_id
GROUP BY tu.tutorial_id, tu.urge_count, tu.updated_at;

-- 9. 创建索引优化查询性能
-- 复合索引用于常见查询模式
CREATE INDEX IF NOT EXISTS idx_urge_history_tutorial_time 
ON urge_history (tutorial_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_urge_limits_tutorial_time 
ON urge_limits (tutorial_id, last_urge_at DESC);

-- 10. 显示表结构信息
SELECT 'Database initialization completed!' as status;
SHOW TABLES LIKE '%urge%';