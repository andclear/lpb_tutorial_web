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
- 🎨 **多彩主题**: 8种渐变色彩主题，支持透明度效果
- 🎯 **丰富图标**: 100+精选图标，涵盖6大分类

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
  qrCodeUrl: "/images/wechat.png", // 二维码图片路径
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
            linkUrl: "https://juejin.cn/post/xxxxxxxxxxxx",
            remark: "本教程将带你使用 Next.js 从零开始搭建现代化博客网站",
            category: "文字教程",
            colorTheme: "blue",
            icon: "Code"
          }
        ],
      },
    ],
  },
];
```

教程对象支持的字段：
- **id**: 教程唯一标识符
- **title**: 教程标题
- **linkUrl**: 教程链接地址
- **remark**: 教程详细描述
- **category**: 分类标签（可选）
- **colorTheme**: 颜色主题（可选，默认blue）
- **icon**: 图标名称（可选，默认BookOpen）

## 🎯 功能说明

### 教程卡片
- **渐变背景**: 8种精美渐变色彩主题，支持透明度效果
- **丰富图标**: 100+精选图标，涵盖学习教育、技术开发、工具实用、媒体内容、游戏娱乐、商业办公6大分类
- **交互体验**: 点击卡片跳转到教程链接，悬停右上角信息图标查看详细说明
- **分类标签**: 左下角显示教程分类（如果配置了 category 字段）

### 管理后台
- **站点信息**: 编辑网站标题和页脚文本
- **赞赏配置**: 管理赞赏功能的开关和内容
- **社交媒体**: 添加、编辑、删除社交媒体链接
- **教程内容**: 管理标签页、分组和教程，支持折叠和过滤
- **颜色选择器**: 长方形样式，支持透明度预览
- **图标选择器**: 分类展示，快速选择合适图标

### 过滤功能
- **标签页过滤**: 显示特定标签页下的所有内容
- **分组过滤**: 显示特定分组下的教程（右侧文字链接形式）
- **智能联动**: 切换过滤器时自动重置另一个过滤器

### 特色功能
- **收藏引导**: 爱心动画提示用户收藏网站
- **预览模式**: 管理后台实时预览功能
- **响应式设计**: 完美适配各种设备尺寸

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
- **全局样式**: 编辑 `src/app/globals.css`
- **组件样式**: 使用 Tailwind CSS 类名
- **主题色彩**: 在 `src/site.config.js` 中的 `cardColors` 配置

### 添加新功能
- **组件文件**: `src/components/`
- **页面文件**: `src/app/`
- **配置文件**: `src/site.config.js`

### 自定义图标
- **添加新图标**: 在 `src/site.config.js` 的 `cardIcons` 中添加
- **图标分类**: 支持学习教育、技术开发、工具实用、媒体内容、游戏娱乐、商业办公6大分类

### 自定义颜色主题
- **添加新主题**: 在 `src/site.config.js` 的 `cardColors` 中添加
- **透明度配置**: 支持自定义透明度效果

## 📁 项目结构

```
lpb_tutorial_web/
├── public/                 # 静态资源
│   └── images/         # 静态图片资源
    │       ├── mylogo.png     # 网站Logo
    │       ├── wechat.png     # 微信赞赏码
    │       └── alipay.png     # 支付宝赞赏码
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── admin/         # 管理后台页面
│   │   │   └── page.tsx   # 管理后台主页
│   │   ├── globals.css    # 全局样式
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx       # 首页
│   ├── components/        # React 组件
│   │   ├── BookmarkModal.tsx    # 收藏引导弹窗
│   │   ├── DonationModal.tsx    # 赞赏弹窗
│   │   └── TutorialCard.tsx     # 教程卡片组件
│   └── site.config.js     # 网站配置文件
├── package.json           # 项目依赖和脚本
├── tailwind.config.js     # Tailwind CSS 配置
├── tsconfig.json          # TypeScript 配置
├── next.config.js         # Next.js 配置
├── postcss.config.js      # PostCSS 配置
└── README.md              # 项目文档
```

## 🎨 设计特色

### 颜色主题
- **紫粉渐变**: 优雅的紫色到粉色渐变
- **蓝青渐变**: 清新的蓝色到青色渐变
- **绿翠渐变**: 自然的绿色到翠绿渐变
- **橙红渐变**: 活力的橙色到红色渐变
- **靛紫渐变**: 深邃的靛蓝到紫色渐变
- **青绿渐变**: 宁静的青色到绿色渐变
- **玫粉渐变**: 浪漫的玫瑰到粉色渐变
- **琥珀渐变**: 温暖的琥珀到橙色渐变

### 图标分类
- **学习教育**: 书本、学士帽、大脑、灯泡等14个图标
- **技术开发**: 代码、终端、数据库、服务器等19个图标
- **工具实用**: 设置、扳手、画笔、搜索等16个图标
- **媒体内容**: 视频、图片、音乐、相机等12个图标
- **游戏娱乐**: 游戏手柄、奖杯、星星、爱心等10个图标
- **商业办公**: 公文包、文档、图表、邮件等16个图标

## 🔧 开发指南

### 添加新教程
1. 在管理后台中点击"添加教程"
2. 填写教程信息（标题、链接、描述等）
3. 选择合适的颜色主题和图标
4. 下载配置文件并替换 `src/site.config.js`

### 自定义样式
1. 修改 `src/app/globals.css` 调整全局样式
2. 在组件中使用 Tailwind CSS 类名
3. 在 `tailwind.config.js` 中扩展主题配置

### 添加新页面
1. 在 `src/app/` 目录下创建新的页面文件
2. 使用 Next.js App Router 约定
3. 支持嵌套路由和布局

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

### 贡献指南
1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户。

特别感谢：
- [Next.js](https://nextjs.org/) - 强大的React框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用的CSS框架
- [Lucide React](https://lucide.dev/) - 精美的图标库

---

**注意**: 请不要将本站内容用于任何商业用途，包括但不限于推广、商业引流等。