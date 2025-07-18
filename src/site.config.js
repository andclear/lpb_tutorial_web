// /src/site.config.js

// 1. 全局站点信息
export const siteInfo = {
  title: "老婆宝的教程导航站",
  footerText: "本站点由老婆宝搭建\n小红书账号：老婆宝  |  小红书号：老婆宝",
};

// 2. 全局赞赏功能配置
export const donation = {
  enabled: true,
  title: "支持一下",
  text: "如果您觉得我的教程对您有帮助\n可以请我吃一个珍珠奶茶里的珍珠~ \n 手头不宽裕不许请，未成年人不许请",
  qrCodeUrl: "/images/donation-qrcode.svg",
};

// 3. 社交媒体配置
export const socialMedia = {
  xiaohongshu: {
    enabled: true,
    url: "https://www.xiaohongshu.com",
    title: "小红书"
  },
  douyin: {
    enabled: false,
    url: "https://www.douyin.com",
    title: "抖音"
  },
  bilibili: {
    enabled: true,
    url: "https://www.bilibili.com",
    title: "Bilibili"
  }
};

// 4. 教程内容：标签页 -> 分组 -> 教程
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
            remark: "本教程将带你使用 Next.js, Tailwind CSS 和 Vercel 从零开始搭建一个现代化的博客网站，包含文章管理、评论系统等功能。",
            category: "文字教程", 
          },
          {
            id: 't102',
            title: "Next.js 进阶：服务端组件探秘",
            coverUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
            linkUrl: "https://sspai.com/post/xxxxxxxxxxxx",
            remark: "深入理解 React Server Components 的工作原理，学习如何在 Next.js 13+ 中有效使用服务端组件提升应用性能。",
            category: "", 
          },
          {
            id: 't103',
            title: "TiDB Cloud 免费套餐申请和使用指南",
            coverUrl: "/images/covers/tidb-guide.svg",
            linkUrl: "https://www.bilibili.com/video/BVxxxxxxxxxx",
            remark: "视频教程，手把手教你如何白嫖一个强大的分布式数据库，包含申请流程、基础配置和实际使用案例。",
            category: "视频教程", 
          }
        ],
      },
      {
        id: 'g1-2',
        name: "API相关教程",
        tutorials: [
          {
            id: 't104',
            title: "React Hooks 完全指南",
            coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
            linkUrl: "https://react.dev/reference/react",
            remark: "从 useState 到自定义 Hooks，全面掌握 React Hooks 的使用方法和最佳实践。",
            category: "文字教程",
          },
          {
            id: 't105',
            title: "状态管理最佳实践",
            coverUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
            linkUrl: "https://redux-toolkit.js.org/",
            remark: "学习如何在 React 应用中选择和使用合适的状态管理方案。",
            category: "实战项目",
          },
          {
            id: 't106',
            title: "测试",
            coverUrl: "https://images.unsplash.com/photo-1f71?w=400&h=300&fit=crop",
            linkUrl: "https://redux-toolkit.js.org/",
            remark: "学习如何在 React 应用中选择和使用合适的状态管理方案。",
            category: "测试一下",
          }
        ],
      },
    ],
  },
  {
    id: 'tab2',
    name: "酒馆实用工具",
    groups: [
      {
        id: 'g2-1',
        name: "React Native",
        tutorials: [
          {
            id: 't201',
            title: "React Native 入门到实战",
            coverUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
            linkUrl: "https://reactnative.dev/",
            remark: "从环境搭建到发布应用，完整的 React Native 开发流程教学。",
            category: "视频教程",
          },
          {
            id: 't202',
            title: "原生模块开发指南",
            coverUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
            linkUrl: "https://reactnative.dev/docs/native-modules-intro",
            remark: "学习如何为 React Native 应用开发自定义的原生模块。",
            category: "进阶教程",
          }
        ],
      },
    ],
  },
  /*
  {
    id: 'tab3',
    name: "后端开发",
    groups: [
      {
        id: 'g3-1',
        name: "Node.js",
        tutorials: [
          {
            id: 't301',
            title: "Express.js API 开发实战",
            coverUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
            linkUrl: "https://expressjs.com/",
            remark: "使用 Express.js 构建 RESTful API，包含身份验证、数据库集成等核心功能。",
            category: "实战项目",
          }
        ],
      },
    ],
  },
  */
];