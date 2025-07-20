# 生产环境数据库错误修复指南

## 问题描述
在 Vercel 部署后，点击"催更"按钮出现错误：
```
Unknown column 'ip_address' in 'field list'
```

## 问题原因
生产环境的数据库表结构与代码期望的结构不匹配，缺少 `ip_address` 和 `user_agent` 字段。

## 解决方案

### 方案一：修复数据库结构（推荐）

1. **连接到生产数据库**，执行以下SQL脚本：

```sql
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
```

2. **验证修复**：
```sql
SHOW COLUMNS FROM urge_history;
SHOW COLUMNS FROM urge_limits;
```

### 方案二：使用临时简化版本（快速修复）

如果无法立即修改数据库，可以临时使用简化版本：

1. 将 `src/app/api/urge/[tutorialId]/route-temp.ts` 重命名为 `route.ts`
2. 重新部署应用

这个版本会：
- 跳过 IP 地址相关的字段操作
- 使用内存缓存进行简单的频率限制
- 保持基本的催更功能

## 代码改进

已经对代码进行了以下改进：

1. **错误处理增强**：
   - `performUrge` 函数现在包含完整的错误处理
   - 如果主要操作失败，会自动回退到简化版本

2. **向后兼容性**：
   - 添加了 `performUrgeSimple` 函数作为备用方案
   - 数据库操作失败时不会完全阻止功能

3. **数据库初始化改进**：
   - `initializeTables` 函数现在会检查并添加缺失的字段
   - 包含 `ALTER TABLE` 语句确保现有表结构正确

## 文件说明

- `scripts/fix-production-db.sql` - 生产环境数据库修复脚本
- `scripts/migrate-add-ip-address.sql` - 完整的数据库迁移脚本
- `src/app/api/urge/[tutorialId]/route-temp.ts` - 临时简化版本API
- `src/lib/database.ts` - 已优化的数据库操作函数

## 建议

1. **优先使用方案一**：修复数据库结构是最佳解决方案
2. **监控日志**：部署后检查应用日志确保功能正常
3. **测试功能**：修复后测试催更功能是否正常工作
4. **性能监控**：关注数据库查询性能和错误率

## 预防措施

为避免类似问题：

1. **数据库版本控制**：使用迁移脚本管理数据库结构变更
2. **环境一致性**：确保开发、测试、生产环境数据库结构一致
3. **部署检查**：部署前验证数据库结构
4. **错误监控**：设置生产环境错误监控和告警