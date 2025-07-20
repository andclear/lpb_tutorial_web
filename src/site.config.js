// /src/site.config.js

// 1. 全局站点信息
export const siteInfo = {
  "title": "老婆宝的教程发布站",
  "footerText": "本站点由老婆宝搭建\n小红书账号：老婆宝  |  小红书号：laopobao"
};

// 2. 全局赞赏配置
export const donation = {
  "enabled": true,
  "title": "支持一下",
  "text": "如果您觉得我的教程对您有帮助\n可以请我吃一个珍珠奶茶里的珍珠~ \n手头不宽裕不许请，未成年人不许请",
  "paymentOptions": [
    {
      "id": "wechat",
      "name": "微信   1 元",
      "qrCodeUrl": "/images/wechat.png",
      "color": "#07C160"
    },
    {
      "id": "alipay",
      "name": "支付宝   1 元",
      "qrCodeUrl": "/images/alipay.png",
      "color": "#1677FF"
    }
  ]
};

// 3. 社交媒体配置
export const socialMedia = {
  "xiaohongshu": {
    "enabled": true,
    "url": "https://www.xiaohongshu.com",
    "title": "小红书"
  },
  "douyin": {
    "enabled": true,
    "url": "https://www.douyin.com",
    "title": "抖音"
  },
  "bilibili": {
    "enabled": true,
    "url": "https://www.bilibili.com",
    "title": "Bilibili"
  }
};

// 4. 卡片颜色主题配置
export const cardColors = {
  "purple": {
    "name": "紫粉渐变",
    "gradient": "from-purple-500/20 to-pink-500/20",
    "border": "border-purple-400/30",
    "hover": "hover:border-purple-400/60",
    "text": "from-purple-400 to-pink-400"
  },
  "blue": {
    "name": "蓝青渐变",
    "gradient": "from-blue-500/20 to-cyan-500/20",
    "border": "border-blue-400/30",
    "hover": "hover:border-blue-400/60",
    "text": "from-blue-400 to-cyan-400"
  },
  "green": {
    "name": "绿翠渐变",
    "gradient": "from-green-500/20 to-emerald-500/20",
    "border": "border-green-400/30",
    "hover": "hover:border-green-400/60",
    "text": "from-green-400 to-emerald-400"
  },
  "orange": {
    "name": "橙红渐变",
    "gradient": "from-orange-500/20 to-red-500/20",
    "border": "border-orange-400/30",
    "hover": "hover:border-orange-400/60",
    "text": "from-orange-400 to-red-400"
  },
  "indigo": {
    "name": "靛紫渐变",
    "gradient": "from-indigo-500/20 to-purple-500/20",
    "border": "border-indigo-400/30",
    "hover": "hover:border-indigo-400/60",
    "text": "from-indigo-400 to-purple-400"
  },
  "teal": {
    "name": "青绿渐变",
    "gradient": "from-teal-500/20 to-green-500/20",
    "border": "border-teal-400/30",
    "hover": "hover:border-teal-400/60",
    "text": "from-teal-400 to-green-400"
  },
  "rose": {
    "name": "玫粉渐变",
    "gradient": "from-rose-500/20 to-pink-500/20",
    "border": "border-rose-400/30",
    "hover": "hover:border-rose-400/60",
    "text": "from-rose-400 to-pink-400"
  },
  "amber": {
    "name": "琥珀渐变",
    "gradient": "from-amber-500/20 to-orange-500/20",
    "border": "border-amber-400/30",
    "hover": "hover:border-amber-400/60",
    "text": "from-amber-400 to-orange-400"
  }
};

// 5. 卡片图标配置
export const cardIcons = {
  "学习教育": {
    "name": "学习教育",
    "icons": [
      "BookOpen",
      "GraduationCap",
      "Brain",
      "Lightbulb",
      "Target",
      "Award",
      "BookMarked",
      "Library",
      "Pencil",
      "Users",
      "Clock",
      "Calendar",
      "Bookmark"
    ]
  },
  "技术开发": {
    "name": "技术开发",
    "icons": [
      "Code",
      "Terminal",
      "Cpu",
      "Database",
      "Globe",
      "Smartphone",
      "Monitor",
      "Server",
      "GitBranch",
      "Github",
      "Cloud",
      "Laptop",
      "HardDrive",
      "Wifi",
      "Zap",
      "Bug"
    ]
  },
  "工具实用": {
    "name": "工具实用",
    "icons": [
      "Settings",
      "Wrench",
      "Hammer",
      "Scissors",
      "Paintbrush",
      "Palette",
      "Compass",
      "Calculator",
      "Search",
      "Filter",
      "Download",
      "Upload",
      "Copy",
      "Share",
      "LinkIcon",
      "Lock"
    ]
  },
  "媒体内容": {
    "name": "媒体内容",
    "icons": [
      "Video",
      "Image",
      "Music",
      "Camera",
      "Film",
      "Mic",
      "Headphones",
      "Radio",
      "Play",
      "Pause",
      "Volume2",
      "MessageCircle"
    ]
  },
  "游戏娱乐": {
    "name": "游戏娱乐",
    "icons": [
      "Gamepad2",
      "Joystick",
      "Dice1",
      "Puzzle",
      "Trophy",
      "Star",
      "Heart",
      "Sparkles",
      "Gift",
      "Coffee"
    ]
  },
  "商业办公": {
    "name": "商业办公",
    "icons": [
      "Briefcase",
      "FileText",
      "PieChart",
      "BarChart",
      "TrendingUp",
      "DollarSign",
      "CreditCard",
      "Building",
      "Mail",
      "Phone",
      "User",
      "MapPin",
      "ShoppingCart"
    ]
  },
  "生活其他": {
    "name": "生活其他",
    "icons": [
      "Bot",
      "Rocket",
      "Activity",
      "Home",
      "Car",
      "Plane",
      "Train",
      "Bike",
      "Apple",
      "Utensils",
      "ShoppingBag",
      "Shirt",
      "Sun",
      "Moon",
      "Tablet"
    ]
  }
};

// 6. 教程内容：标签页 -> 分组 -> 教程
export const tabs = [
  {
    "id": "tab1",
    "name": "SillyTavern酒馆教程",
    "groups": [
      {
        "id": "g1-1",
        "name": "部署与搭建",
        "tutorials": [
          {
            "id": "t101",
            "title": "安卓手机搭建酒馆教程",
            "linkUrl": "https://rrpkxlo5h4.feishu.cn/wiki/Gb7GwSd8AiAW8dkITLRcw8Q5nzh?from=from_copylink",
            "remark": "超级详细的安卓手机搭建酒馆教程，教程中包含所需的Termux和MT管理器安装包，可以直接下载使用。所有代码都有解释，知其然，知其所以然。",
            "category": "图文教程",
            "colorTheme": "green",
            "icon": "Smartphone"
          },
          {
            "id": "t102",
            "title": "Windows电脑搭建酒馆教程",
            "linkUrl": "https://rrpkxlo5h4.feishu.cn/wiki/C9xpwKAkDiEEq9kwfvPcRaPJnZb?from=from_copylink",
            "remark": "超级详细的Windows酒馆搭建教程，包含搭建时所需的安装文件下载，更有进阶教程，可以让你在局域网、外网环境下通过其他设备访问电脑上的酒馆。（电脑不能关机、断网）",
            "category": "图文教程",
            "colorTheme": "blue",
            "icon": "Monitor"
          },
          {
            "id": "t103",
            "title": "Mac电脑搭建酒馆教程",
            "linkUrl": "https://rrpkxlo5h4.feishu.cn/wiki/ClTGwTtpWiqOzKkfidCc6CnvnHh?from=from_copylink",
            "remark": "超级详细的Mac酒馆搭建教程，包含搭建时所需的安装文件下载，更有进阶教程，可以让你在局域网、外网环境下通过其他设备访问电脑上的酒馆。（电脑不能关机、断网）",
            "category": "图文教程",
            "colorTheme": "indigo",
            "icon": "Laptop"
          },
          {
            "id": "t1752955473149",
            "title": "VPS云酒馆搭建教程",
            "linkUrl": "https://rrpkxlo5h4.feishu.cn/wiki/UVKxw8VuziKBMXkYOapcSwznnIb?from=from_copylink",
            "remark": "全网最强VPS搭建教程，基于Linux搭建，通过1Panel面板管理，包含部分数据迁移教程、数据备份教程（超好用，全网唯一）。支持在所有平台使用，包括iOS。",
            "category": "图文教程",
            "colorTheme": "amber",
            "icon": "Server"
          },
          {
            "id": "t1752955474516",
            "title": "Claw云酒馆搭建",
            "linkUrl": "https://rrpkxlo5h4.feishu.cn/wiki/TohMwEPcpiIGPKkQHPYcAKhjnLf?from=from_copylink",
            "remark": "请注意：Claw平台云酒馆是免费的，但是必须要有一个注册时间大于180天的Github账号。\n全网最强Claw酒馆搭建教程，包含数据迁移教程、自定义域名教程（超好用，全网唯一）。\n支持在所有平台使用，包括iOS。",
            "category": "图文教程",
            "colorTheme": "teal",
            "icon": "Globe"
          }
        ]
      },
      {
        "id": "g1-2",
        "name": "API相关教程",
        "tutorials": [
          {
            "id": "t106",
            "title": "Gemini 和 Deepseek API获取教程",
            "linkUrl": "https://rrpkxlo5h4.feishu.cn/wiki/EbgawbWtwiJE9CkEEGDc4WFqn8b?from=from_copylink",
            "remark": "本教程包含如何获取Gemini官方API、如何创建多个项目、轮询搭建链接。请注意，gemini api 无法直接连接，必须开梯子，新加坡、美国、日本节点，香港不行。或者可以通过搭建轮询解决。",
            "category": "图文教程",
            "colorTheme": "blue",
            "icon": "Cpu"
          },
          {
            "id": "t104",
            "title": "Hajimi轮询部署教程-Claw版",
            "linkUrl": "https://rrpkxlo5h4.feishu.cn/wiki/F8cBw50u2iatr1kENEoci6P3nHs?from=from_copylink",
            "remark": "Hajimi轮询的部署教程，部署完后可以多key轮询、免梯直连gemini key。和Gemini Balance功能差不多，二者部署其一即可。个人推荐Hajimi轮询。",
            "category": "图文教程",
            "colorTheme": "green",
            "icon": "Rocket"
          },
          {
            "id": "t105",
            "title": "Gemini-Balance 轮询搭建教程",
            "linkUrl": "",
            "remark": "Gemini Balance轮询的部署教程，部署完后可以多key轮询、免梯直连gemini key。和Gemini Balance功能差不多，二者部署其一即可。个人推荐Hajimi轮询。",
            "category": "图文教程",
            "colorTheme": "indigo",
            "icon": "Rocket"
          },
          {
            "id": "t1753000684708",
            "title": "Aistudio反代教程",
            "linkUrl": "https://rrpkxlo5h4.feishu.cn/wiki/N8y6wn4iIiocmukzN6CckPFUnz3?from=from_copylink",
            "remark": "必须使用电脑，目前教程基于Windows，没有提供Mac的教程。电脑必须常开，必须内网穿透后才能用于云酒馆。",
            "category": "图文教程",
            "colorTheme": "blue",
            "icon": "Rocket"
          }
        ]
      },
      {
        "id": "g1753003463051",
        "name": "其他教程",
        "tutorials": [
          {
            "id": "t1753003470163",
            "title": "Astrbot小机器人教程-Claw版本",
            "linkUrl": "https://rrpkxlo5h4.feishu.cn/wiki/Cn2YwXnl7iki7qkamJJcDwU5nZg?from=from_copylink",
            "remark": "AstrBot机器人，好玩好聊的机器人，可以配置人格（写人设）。由于在Claw中不能安装很多插件，所以推荐接入Telegram（尽管也可以接入Discord，但是使用体验不是很好）。",
            "category": "图文教程",
            "colorTheme": "orange",
            "icon": "Bot"
          },
          {
            "id": "t1753003587288",
            "title": "Astrbot小机器人教程-HuggingFace版本",
            "linkUrl": "",
            "remark": "超好玩的Astrbot机器人，回复速度太快咯，可以写人设，可以装插件，原生支持接入QQ（用小号接入，需实名认证），唯一缺点是：指不定哪天就被HuggingFace给封咯。。。",
            "category": "还没写完",
            "colorTheme": "orange",
            "icon": "Bot"
          },
          {
            "id": "t1753034370097",
            "title": "测试版",
            "linkUrl": "",
            "remark": "这是一个测试文件",
            "category": "测试内容",
            "colorTheme": "blue",
            "icon": "Paintbrush"
          }
        ]
      }
    ]
  },
  {
    "id": "tab2",
    "name": "酒馆实用工具",
    "groups": [
      {
        "id": "g2-1",
        "name": "老婆宝的实用工具",
        "tutorials": [
          {
            "id": "t202",
            "title": "API Key在线测试工具",
            "linkUrl": "https://ceshi.laopobao.online/",
            "remark": "可以非常方便的在网页中测试你的Gemini Key有效性，提供了双端测试，可以测试是否是因为你的网络问题导致Gemini Key无法连接。自定义API测试中，虽然写了轮询测试，但是实际上支持所有Openai接口的调用和测试。",
            "category": "在线工具",
            "colorTheme": "indigo",
            "icon": "Zap"
          },
          {
            "id": "t201",
            "title": "Github注册时长查询",
            "linkUrl": "https://time.laopobao.online/",
            "remark": "你可以非常方便的在这里查询你的Github账号注册时长，通过用户名进行查询，详细展示了你还有多久才能白嫖Claw",
            "category": "在线工具",
            "colorTheme": "indigo",
            "icon": "Github"
          }
        ]
      },
      {
        "id": "g1753001707186",
        "name": "其他实用工具",
        "tutorials": [
          {
            "id": "t1753010236290",
            "title": "欢迎推荐你的酒馆宝藏工具",
            "linkUrl": "欢迎推荐",
            "remark": "如果你有酒馆好用的工具、插件、软件、免费API等，可以与我联系，我会在测试后酌情添加。\n\n不接受任何付费软件、工具的推荐，请您理解。\n不接受任何API站点的合作。",
            "category": "欢迎推荐",
            "colorTheme": "indigo",
            "icon": "Heart"
          }
        ]
      }
    ]
  }
];
