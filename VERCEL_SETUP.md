# Vercel 环境变量配置说明

## 部署到 Vercel 时需要配置的环境变量

在 Vercel 项目设置中添加以下环境变量：

### 必需的环境变量

1. **DATABASE_URL**
   - 值: `mysql://username:password@host:port/database`
   - 描述: MySQL 数据库连接字符串

2. **NEXT_PUBLIC_APP_URL**
   - 值: `https://your-app-name.vercel.app` (替换为你的实际域名)
   - 描述: 应用的公开访问地址

## 配置步骤

1. 登录 Vercel Dashboard
2. 选择你的项目
3. 进入 Settings > Environment Variables
4. 添加上述环境变量
5. 重新部署项目

## 数据库表说明

应用会自动创建以下表：
- `tutorial_urges`: 存储每个教程的催更总数
- `urge_history`: 存储催更历史记录
- `urge_limits`: 存储IP限制信息（每IP每24小时最多2次）

## 功能特性

- ✅ 每个IP每24小时可催更2次
- ✅ 催更数据持久化存储
- ✅ 支持多次部署数据不丢失
- ✅ 实时显示催更统计
- ✅ 优雅的错误处理和用户提示