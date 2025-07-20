# 老婆宝的酒馆教程发布站

一个完全开源、免费的 SillyTavern 教程发布站，基于 Next.js 构建，支持静态部署。

## ✨ 特性

- 🎨 **现代化设计** - 响应式布局，支持多种设备
- 🚀 **高性能** - 基于 Next.js 14，支持静态导出
- 📱 **移动友好** - 完美适配手机和平板设备
- 🎯 **易于配置** - 通过配置文件轻松管理内容
- 🌈 **多主题支持** - 支持多种颜色主题的教程卡片
- 💫 **动画效果** - 流畅的交互动画和视觉效果
- 📦 **零依赖部署** - 纯静态文件，可部署到任何静态托管服务

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **部署**: 静态导出，支持 Vercel、Netlify、GitHub Pages 等

## 🚀 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm、yarn 或 pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建和部署

```bash
# 构建静态文件
npm run build

# 导出静态文件
npm run export

# 预览构建结果
npm run start
```

构建完成后，`out` 目录包含所有静态文件，可直接部署到任何静态托管服务。

## 📝 配置说明

### 站点配置

编辑 `src/site.config.ts` 文件来配置站点信息：

```typescript
export const siteInfo = {
  title: "老婆宝的酒馆教程发布站",
  description: "完全开源、免费的SillyTavern教程发布站",
  footerText: "感谢您的访问！如有问题请联系老婆宝。"
}
```

### 教程内容

在 `src/site.config.ts` 中的 `tabs` 数组添加教程：

```typescript
export const tabs = [
  {
    id: "sillytavern",
    name: "SillyTavern教程",
    groups: [
      {
        id: "basic",
        name: "基础教程",
        tutorials: [
          {
            id: "install",
            title: "安装教程",
            description: "如何安装 SillyTavern",
            remark: "详细的安装步骤说明",
            linkUrl: "https://example.com/tutorial",
            color: "blue"
          }
        ]
      }
    ]
  }
]
```

### 社交媒体

配置社交媒体链接：

```typescript
export const socialMedia = {
  xiaohongshu: {
    enabled: true,
    title: "小红书",
    url: "https://xiaohongshu.com/user/profile/xxx"
  },
  bilibili: {
    enabled: true,
    title: "哔哩哔哩",
    url: "https://space.bilibili.com/xxx"
  }
}
```

## 🎨 自定义主题

教程卡片支持多种颜色主题：

- `blue` - 蓝色主题
- `purple` - 紫色主题
- `green` - 绿色主题
- `orange` - 橙色主题
- `pink` - 粉色主题
- `indigo` - 靛蓝主题

## 📦 部署指南

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. Vercel 会自动检测 Next.js 项目并进行部署

### Netlify 部署

1. 构建静态文件：`npm run build && npm run export`
2. 将 `out` 目录上传到 Netlify

### GitHub Pages 部署

1. 在 `.github/workflows` 创建部署工作流
2. 配置自动构建和部署到 `gh-pages` 分支

### 其他静态托管

将 `out` 目录的内容上传到任何支持静态文件的托管服务。

## 🔧 开发说明

### 项目结构

```
src/
├── app/                 # Next.js App Router 页面
├── components/          # React 组件
├── lib/                 # 工具函数和类型定义
├── site.config.ts       # 站点配置文件
└── styles/              # 全局样式
```

### 性能优化

项目已进行以下性能优化：

- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 优化事件处理函数
- 消除不必要的重新渲染
- 优化图片加载和显示

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- QQ群：[点击加入](https://qm.qq.com/cgi-bin/qm/qr?k=lGBeDF_PNpmPJppdSeBkpeBGYrYCs0PY&jump_from=webapi&authKey=XVglBDvfExX5vSWU1a/59R5nPbf3Z7GLPAmVPSpB6oAVO4vx9gEcsKf5+Hmj6wyT)

## ⚠️ 免责声明

请不要以任何形式将本站内容用于商业用途，包括但不限于：推广、商业引流等。

---

© 2025 老婆宝的酒馆教程发布站. All Love For You.