-- 生产环境数据库修复脚本
-- 解决 "Unknown column 'ip_address' in 'field list'" 错误

-- 检查并添加 urge_history 表的缺失字段
ALTER TABLE urge_history 
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) DEFAULT '0.0.0.0',
ADD COLUMN IF NOT EXISTS user_agent TEXT;

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
);

-- 添加索引以提升性能
ALTER TABLE urge_history 
ADD INDEX IF NOT EXISTS idx_ip_address (ip_address),
ADD INDEX IF NOT EXISTS idx_tutorial_ip (tutorial_id, ip_address);

-- 验证表结构
SHOW COLUMNS FROM urge_history;
SHOW COLUMNS FROM urge_limits;
SHOW COLUMNS FROM tutorial_urges;