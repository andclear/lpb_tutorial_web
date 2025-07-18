# 老婆宝的教程导航站

一个现代化、响应式的教程聚合与导航网站，专为SillyTavern相关教程设计。采用纯静态架构，配置文件驱动，支持可视化管理后台。

## ✨ 特性

- 🚀 **零后端**: 纯静态网站，无需服务器，部署简单
- ⚡ **极致性能**: 基于 Next.js 14 SSG，加载速度极快
- 🎨 **现代设计**: 使用 Tailwind CSS 和渐变配色，界面美观
- 📱 **响应式**: 完美适配桌面端和移动端设备
- 🔧 **配置驱动**: 通过配置文件管理所有内容，无需修改代码
- 🎛️ **可视化管理**: 内置管理后台，支持在线编辑和预览
- 💝 **赞赏功能**: 可选的赞赏功能，支持二维码展示
- 🔖 **收藏引导**: 一键引导用户收藏网站
- 🏷️ **智能分类**: 支持标签页和分组的双重分类系统
- 📊 **过滤功能**: 支持按标签页和分组进行内容过滤

## 🛠️ 技术栈

- **框架**: Next.js 14 (SSG)
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **语言**: TypeScript
- **部署**: Vercel / 任何静态托管平台

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。
访问 [http://localhost:3000/admin](http://localhost:3000/admin) 进入管理后台。

### 构建生产版本

```bash
npm run build
```

构建完成后，`out` 目录包含所有静态文件。

## 📝 配置说明

### 方式一：使用管理后台（推荐）

1. 启动开发服务器：`npm run dev`
2. 访问 [http://localhost:3000/admin](http://localhost:3000/admin)
3. 在管理后台中编辑配置
4. 点击"下载配置文件"保存配置
5. 将下载的配置文件替换 `src/site.config.js`

### 方式二：直接编辑配置文件

所有网站内容都通过 `src/site.config.js` 文件进行配置：

#### 1. 站点信息

```javascript
export const siteInfo = {
  title: "老婆宝的教程导航站",
  footerText: "本站点由老婆宝搭建\n小红书账号：老婆宝  |  小红书号：老婆宝",
};
```

#### 2. 赞赏功能

```javascript
export const donation = {
  enabled: true, // 是否启用赞赏功能
  title: "支持一下",
  text: "如果您觉得我的教程对您有帮助\n可以请我吃一个珍珠奶茶里的珍珠~",
  qrCodeUrl: "/images/donation-qrcode.svg", // 二维码图片路径
};
```

#### 3. 社交媒体

```javascript
export const socialMedia = {
  xiaohongshu: {
    enabled: true,
    url: "https://www.xiaohongshu.com",
    title: "小红书"
  },
  bilibili: {
    enabled: true,
    url: "https://www.bilibili.com",
    title: "Bilibili"
  }
};
```

#### 4. 教程内容

```javascript
export const tabs = [
  {
    id: 'tab1',
    name: "SillyTavern酒馆教程",
    groups: [
      {
        id: 'g1-1',
        name: "部署与搭建",
        tutorials: [
          {
            id: 't101',
            title: "从零搭建一个博客网站",
            coverUrl: "/images/covers/nextjs-blog.svg",
            linkUrl: "https://juejin.cn/post/xxxxxxxxxxxx",
            remark: "本教程将带你使用 Next.js 从零开始搭建现代化博客网站",
            category: "文字教程", 
          }
        ],
      },
    ],
  },
];
```

## 🎯 功能说明

### 教程卡片
- 点击卡片跳转到教程链接
- 悬停右上角信息图标查看详细说明
- 左下角显示教程分类（如果配置了 category 字段）

### 管理后台
- **站点信息**: 编辑网站标题和页脚文本
- **赞赏配置**: 管理赞赏功能的开关和内容
- **社交媒体**: 添加、编辑、删除社交媒体链接
- **教程内容**: 管理标签页、分组和教程，支持折叠和过滤

### 过滤功能
- 按标签页过滤：显示特定标签页下的所有内容
- 按分组过滤：显示特定分组下的教程
- 智能联动：切换过滤器时自动重置另一个过滤器

## 🚀 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. Vercel 会自动检测 Next.js 项目并进行部署

### 其他静态托管平台

支持部署到任何静态托管平台：

```bash
npm run build
```

将 `out` 目录的内容上传到托管平台即可。

## 🎨 自定义

### 修改样式
- 全局样式：编辑 `src/app/globals.css`
- 组件样式：使用 Tailwind CSS 类名
- 主题色彩：在 `tailwind.config.js` 中自定义颜色

### 添加新功能
- 组件文件：`src/components/`
- 页面文件：`src/app/`
- 配置文件：`src/site.config.js`

### 自定义Logo
- 替换 `public/images/logo.svg` 文件
- 或在管理后台中修改logo路径

## 📁 项目结构

```
lpb_tutorial_web/
├── public/                 # 静态资源
│   └── images/            # 图片资源
│       ├── covers/        # 教程封面图
│       ├── logo.svg       # 网站Logo
│       └── donation-qrcode.svg # 赞赏二维码
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── admin/         # 管理后台页面
│   │   ├── globals.css    # 全局样式
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx       # 首页
│   ├── components/        # React 组件
│   │   ├── BookmarkModal.tsx
│   │   ├── DonationModal.tsx
│   │   └── TutorialCard.tsx
│   └── site.config.js     # 网站配置文件
├── package.json
├── tailwind.config.js     # Tailwind CSS 配置
├── tsconfig.json          # TypeScript 配置
└── README.md
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户。

---

**注意**: 请不要将本站内容用于任何商业用途，包括但不限于推广、商业引流等。