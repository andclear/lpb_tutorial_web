'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Download, Eye, Save, ArrowLeft, ExternalLink, Monitor, X, Heart, Share2, BookOpen, ChevronDown, ChevronRight, Tag, Globe } from 'lucide-react'
import Link from 'next/link'

// 类型定义
interface Tutorial {
  id: string
  title: string
  coverUrl: string
  linkUrl: string
  remark: string
  category?: string
}

interface Group {
  id: string
  name: string
  tutorials: Tutorial[]
}

interface Tab {
  id: string
  name: string
  groups: Group[]
}

interface SiteInfo {
  title: string
  footerText: string
}

interface Donation {
  enabled: boolean
  title: string
  text: string
  qrCodeUrl: string
}

interface SocialMedia {
  [key: string]: {
    enabled: boolean
    url: string
    title: string
  }
}

interface ConfigData {
  siteInfo: SiteInfo
  donation: Donation
  socialMedia: SocialMedia
  tabs: Tab[]
}

export default function AdminPage() {
  const [config, setConfig] = useState<ConfigData | null>(null)
  const [activeTab, setActiveTab] = useState<string>('siteInfo')
  const [showPreview, setShowPreview] = useState(false)
  const [showSitePreview, setShowSitePreview] = useState(false)
  
  // 教程内容折叠和过滤状态
  const [selectedTabFilter, setSelectedTabFilter] = useState<string>('all')
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all')
  const [collapsedTutorials, setCollapsedTutorials] = useState<Set<string>>(new Set()) // 折叠状态

  // 加载配置文件
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      // 动态导入配置文件
      const configModule = await import('../../site.config.js')
      const loadedConfig: ConfigData = {
        siteInfo: configModule.siteInfo,
        donation: configModule.donation,
        socialMedia: configModule.socialMedia,
        tabs: configModule.tabs
      }
      setConfig(loadedConfig)
      
      // 初始化所有教程为折叠状态
      const allTutorialIds = new Set<string>()
      loadedConfig.tabs.forEach(tab => {
        tab.groups.forEach(group => {
          group.tutorials.forEach(tutorial => {
            allTutorialIds.add(tutorial.id)
          })
        })
      })
      setCollapsedTutorials(allTutorialIds)
    } catch (error) {
      console.error('加载配置文件失败:', error)
    }
  }

  // 生成新的ID
  const generateId = (prefix: string) => {
    return `${prefix}${Date.now()}`
  }

  // 折叠功能辅助函数
  const toggleTutorialCollapse = (tutorialId: string) => {
    const newCollapsed = new Set(collapsedTutorials)
    if (newCollapsed.has(tutorialId)) {
      newCollapsed.delete(tutorialId)
    } else {
      newCollapsed.add(tutorialId)
    }
    setCollapsedTutorials(newCollapsed)
  }

  const collapseAllTutorials = () => {
    if (!config) return
    const allTutorialIds = new Set<string>()
    config.tabs.forEach(tab => {
      tab.groups.forEach(group => {
        group.tutorials.forEach(tutorial => {
          allTutorialIds.add(tutorial.id)
        })
      })
    })
    setCollapsedTutorials(allTutorialIds)
  }

  const expandAllTutorials = () => {
    setCollapsedTutorials(new Set())
  }

  // 获取过滤后的教程数据
  const getFilteredTutorials = () => {
    if (!config) return []
    
    let filteredTabs = config.tabs
    
    // 按标签页过滤
    if (selectedTabFilter !== 'all') {
      filteredTabs = filteredTabs.filter(tab => tab.id === selectedTabFilter)
    }
    
    // 按分组过滤
    if (selectedGroupFilter !== 'all') {
      filteredTabs = filteredTabs.map(tab => ({
        ...tab,
        groups: tab.groups.filter(group => group.id === selectedGroupFilter)
      })).filter(tab => tab.groups.length > 0)
    }
    
    return filteredTabs
  }

  // 获取所有可用的分组（用于分组过滤器选项）
  const getAllGroups = () => {
    if (!config) return []
    const allGroups: Array<{id: string, name: string, tabName: string}> = []
    config.tabs.forEach(tab => {
      tab.groups.forEach(group => {
        allGroups.push({
          id: group.id,
          name: group.name,
          tabName: tab.name
        })
      })
    })
    return allGroups
  }

  // 更新站点信息
  const updateSiteInfo = (field: keyof SiteInfo, value: string) => {
    if (!config) return
    setConfig({
      ...config,
      siteInfo: {
        ...config.siteInfo,
        [field]: value
      }
    })
  }

  // 更新赞赏配置
  const updateDonation = (field: keyof Donation, value: string | boolean) => {
    if (!config) return
    setConfig({
      ...config,
      donation: {
        ...config.donation,
        [field]: value
      }
    })
  }

  // 更新社交媒体配置
  const updateSocialMedia = (platform: string, field: string, value: string | boolean) => {
    if (!config) return
    setConfig({
      ...config,
      socialMedia: {
        ...config.socialMedia,
        [platform]: {
          ...config.socialMedia[platform],
          [field]: value
        }
      }
    })
  }

  // 添加社交媒体平台
  const addSocialMedia = () => {
    if (!config) return
    const platformName = prompt('请输入社交媒体平台名称（如：weibo, wechat 等）:')
    if (!platformName || config.socialMedia[platformName]) return
    
    setConfig({
      ...config,
      socialMedia: {
        ...config.socialMedia,
        [platformName]: {
          enabled: true,
          url: '',
          title: platformName
        }
      }
    })
  }

  // 删除社交媒体平台
  const removeSocialMedia = (platform: string) => {
    if (!config) return
    const { [platform]: removed, ...rest } = config.socialMedia
    setConfig({
      ...config,
      socialMedia: rest
    })
  }

  // 更新社交媒体平台名称
  const updateSocialMediaPlatform = (oldPlatform: string, newPlatform: string) => {
    if (!config || oldPlatform === newPlatform) return
    const platformData = config.socialMedia[oldPlatform]
    const newSocialMedia = { ...config.socialMedia }
    delete newSocialMedia[oldPlatform]
    newSocialMedia[newPlatform] = platformData
    setConfig({
      ...config,
      socialMedia: newSocialMedia
    })
  }

  // 添加新标签页
  const addTab = () => {
    if (!config) return
    const newTab: Tab = {
      id: generateId('tab'),
      name: '新标签页',
      groups: []
    }
    setConfig({
      ...config,
      tabs: [...config.tabs, newTab]
    })
  }

  // 删除标签页
  const deleteTab = (tabId: string) => {
    if (!config) return
    setConfig({
      ...config,
      tabs: config.tabs.filter(tab => tab.id !== tabId)
    })
  }

  // 更新标签页
  const updateTab = (tabId: string, name: string) => {
    if (!config) return
    setConfig({
      ...config,
      tabs: config.tabs.map(tab => 
        tab.id === tabId ? { ...tab, name } : tab
      )
    })
  }

  // 添加新分组
  const addGroup = (tabId: string) => {
    if (!config) return
    const newGroup: Group = {
      id: generateId('g'),
      name: '新分组',
      tutorials: []
    }
    setConfig({
      ...config,
      tabs: config.tabs.map(tab => 
        tab.id === tabId 
          ? { ...tab, groups: [...tab.groups, newGroup] }
          : tab
      )
    })
  }

  // 删除分组
  const deleteGroup = (tabId: string, groupId: string) => {
    if (!config) return
    setConfig({
      ...config,
      tabs: config.tabs.map(tab => 
        tab.id === tabId 
          ? { ...tab, groups: tab.groups.filter(group => group.id !== groupId) }
          : tab
      )
    })
  }

  // 更新分组
  const updateGroup = (tabId: string, groupId: string, name: string) => {
    if (!config) return
    setConfig({
      ...config,
      tabs: config.tabs.map(tab => 
        tab.id === tabId 
          ? { 
              ...tab, 
              groups: tab.groups.map(group => 
                group.id === groupId ? { ...group, name } : group
              )
            }
          : tab
      )
    })
  }

  // 添加新教程
  const addTutorial = (tabId: string, groupId: string) => {
    if (!config) return
    const newTutorial: Tutorial = {
      id: generateId('t'),
      title: '新教程',
      coverUrl: '',
      linkUrl: '',
      remark: '',
      category: ''
    }
    setConfig({
      ...config,
      tabs: config.tabs.map(tab => 
        tab.id === tabId 
          ? { 
              ...tab, 
              groups: tab.groups.map(group => 
                group.id === groupId 
                  ? { ...group, tutorials: [...group.tutorials, newTutorial] }
                  : group
              )
            }
          : tab
      )
    })
    
    // 新添加的教程默认折叠
    setCollapsedTutorials(prev => {
      const newSet = new Set(prev)
      newSet.add(newTutorial.id)
      return newSet
    })
  }

  // 删除教程
  const deleteTutorial = (tabId: string, groupId: string, tutorialId: string) => {
    if (!config) return
    setConfig({
      ...config,
      tabs: config.tabs.map(tab => 
        tab.id === tabId 
          ? { 
              ...tab, 
              groups: tab.groups.map(group => 
                group.id === groupId 
                  ? { ...group, tutorials: group.tutorials.filter(tutorial => tutorial.id !== tutorialId) }
                  : group
              )
            }
          : tab
      )
    })
  }

  // 更新教程
  const updateTutorial = (tabId: string, groupId: string, tutorialId: string, field: keyof Tutorial, value: string) => {
    if (!config) return
    setConfig({
      ...config,
      tabs: config.tabs.map(tab => 
        tab.id === tabId 
          ? { 
              ...tab, 
              groups: tab.groups.map(group => 
                group.id === groupId 
                  ? { 
                      ...group, 
                      tutorials: group.tutorials.map(tutorial => 
                        tutorial.id === tutorialId 
                          ? { ...tutorial, [field]: value }
                          : tutorial
                      )
                    }
                  : group
              )
            }
          : tab
      )
    })
  }

  // 生成配置文件内容
  const generateConfigFile = () => {
    if (!config) return ''
    
    return `// /src/site.config.js

// 1. 全局站点信息
export const siteInfo = ${JSON.stringify(config.siteInfo, null, 2)};

// 2. 全局赞赏功能配置
export const donation = ${JSON.stringify(config.donation, null, 2)};

// 3. 社交媒体配置
export const socialMedia = ${JSON.stringify(config.socialMedia, null, 2)};

// 4. 教程内容：标签页 -> 分组 -> 教程
export const tabs = ${JSON.stringify(config.tabs, null, 2)};
`
  }

  // 下载配置文件
  const downloadConfig = () => {
    const content = generateConfigFile()
    const blob = new Blob([content], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site.config.js'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 保存临时配置到 localStorage
  const saveTempConfig = () => {
    if (!config) return
    localStorage.setItem('tempSiteConfig', JSON.stringify(config))
    alert('配置已保存到临时存储，现在可以预览网站效果了！')
  }

  // 打开网站预览
  const openSitePreview = () => {
    if (!config) return
    localStorage.setItem('tempSiteConfig', JSON.stringify(config))
    window.open('/', '_blank')
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">加载配置文件中...</div>
      </div>
    )
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              配置文件预览
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowPreview(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700/80 hover:bg-slate-600/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">返回编辑</span>
              </button>
              <button
                onClick={downloadConfig}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">下载配置文件</span>
              </button>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 shadow-2xl">
            <pre className="text-xs sm:text-sm overflow-auto max-h-96 text-slate-300 leading-relaxed">
              <code>{generateConfigFile()}</code>
            </pre>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 头部 */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 sm:mb-10 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              配置管理后台
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              可视化编辑网站配置，实时预览效果
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700/80 hover:bg-slate-600/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl flex-1 sm:flex-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">返回首页</span>
            </Link>
            <button
              onClick={saveTempConfig}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">保存临时配置</span>
            </button>
            <button
              onClick={openSitePreview}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex-1 sm:flex-none"
            >
              <Monitor className="w-4 h-4" />
              <span className="text-sm font-medium">预览网站效果</span>
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex-1 sm:flex-none"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">预览配置文件</span>
            </button>
            <button
              onClick={downloadConfig}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">下载配置文件</span>
            </button>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 sm:mb-10 p-1 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
          {['siteInfo', 'donation', 'socialMedia', 'tabs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-200 flex-1 sm:flex-none text-sm sm:text-base ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab === 'siteInfo' && '站点信息'}
              {tab === 'donation' && '赞赏配置'}
              {tab === 'socialMedia' && '社交媒体'}
              {tab === 'tabs' && '教程内容'}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="space-y-6 sm:space-y-8">
          {/* 站点信息 */}
          {activeTab === 'siteInfo' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">站点信息</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">站点标题</label>
                  <input
                    type="text"
                    value={config.siteInfo.title}
                    onChange={(e) => updateSiteInfo('title', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400"
                    placeholder="输入站点标题..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">页脚文本</label>
                  <textarea
                    value={config.siteInfo.footerText}
                    onChange={(e) => updateSiteInfo('footerText', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400 resize-none"
                    placeholder="输入页脚文本..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* 赞赏配置 */}
          {activeTab === 'donation' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">赞赏配置</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <input
                    type="checkbox"
                    checked={config.donation.enabled}
                    onChange={(e) => updateDonation('enabled', e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label className="text-sm font-medium text-slate-300">启用赞赏功能</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">按钮标题</label>
                  <input
                    type="text"
                    value={config.donation.title}
                    onChange={(e) => updateDonation('title', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400"
                    placeholder="输入按钮标题..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">赞赏文案</label>
                  <textarea
                    value={config.donation.text}
                    onChange={(e) => updateDonation('text', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400 resize-none"
                    placeholder="输入赞赏文案..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">二维码图片路径</label>
                  <input
                    type="text"
                    value={config.donation.qrCodeUrl}
                    onChange={(e) => updateDonation('qrCodeUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400"
                    placeholder="输入二维码图片路径..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* 社交媒体 */}
          {activeTab === 'socialMedia' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">社交媒体</h2>
              </div>
              <div className="space-y-6">
                {Object.entries(config.socialMedia).map(([platform, settings]) => (
                  <div key={platform} className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-white capitalize">{platform}</h3>
                      <button
                        onClick={() => removeSocialMedia(platform)}
                        className="self-start sm:self-auto px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                        <input
                          type="checkbox"
                          checked={settings.enabled}
                          onChange={(e) => updateSocialMedia(platform, 'enabled', e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label className="text-sm font-medium text-slate-300">启用</label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">标题</label>
                          <input
                            type="text"
                            value={settings.title}
                            onChange={(e) => updateSocialMedia(platform, 'title', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400"
                            placeholder="输入标题..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">链接</label>
                          <input
                            type="url"
                            value={settings.url}
                            onChange={(e) => updateSocialMedia(platform, 'url', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400"
                            placeholder="输入链接..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addSocialMedia}
                  className="w-full py-4 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-blue-500 transition-all duration-200 flex items-center justify-center gap-2 hover:bg-slate-700/20"
                >
                  <Plus className="w-5 h-5" />
                  添加社交媒体平台
                </button>
              </div>
            </div>
          )}

          {/* 教程内容 */}
          {activeTab === 'tabs' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">教程内容</h2>
              </div>

              {/* 操作工具栏 */}
              <div className="flex flex-col gap-4 mb-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                {/* 按钮组 */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={addTab}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">添加标签页</span>
                  </button>
                  <button
                    onClick={collapseAllTutorials}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-600/80 hover:bg-slate-600 rounded-xl transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-sm font-medium">全部折叠</span>
                  </button>
                  <button
                    onClick={expandAllTutorials}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-600/80 hover:bg-slate-600 rounded-xl transition-all duration-200"
                  >
                    <ChevronDown className="w-4 h-4" />
                    <span className="text-sm font-medium">全部展开</span>
                  </button>
                </div>

                {/* 过滤器组 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* 标签页过滤器 */}
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400 whitespace-nowrap">标签页:</span>
                    <select
                      value={selectedTabFilter}
                      onChange={(e) => {
                        setSelectedTabFilter(e.target.value)
                        // 当切换标签页时，重置分组过滤器
                        if (e.target.value !== 'all') {
                          setSelectedGroupFilter('all')
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-white text-sm"
                    >
                      <option value="all">显示所有标签页</option>
                      {config?.tabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                          {tab.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 分组过滤器 */}
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400 whitespace-nowrap">分组:</span>
                    <select
                      value={selectedGroupFilter}
                      onChange={(e) => {
                        setSelectedGroupFilter(e.target.value)
                        // 当选择特定分组时，重置标签页过滤器
                        if (e.target.value !== 'all') {
                          setSelectedTabFilter('all')
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-white text-sm"
                    >
                      <option value="all">显示所有分组</option>
                      {getAllGroups().map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.tabName} - {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {getFilteredTutorials().map((tab) => (
                  <div key={tab.id} className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                      <input
                        type="text"
                        value={tab.name}
                        onChange={(e) => updateTab(tab.id, e.target.value)}
                        className="text-lg font-semibold bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400 flex-1"
                        placeholder="输入标签页名称..."
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => addGroup(tab.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm font-medium">添加分组</span>
                        </button>
                        <button
                          onClick={() => deleteTab(tab.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-medium">删除标签页</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {tab.groups.map((group) => (
                        <div key={group.id} className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/30">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                            <input
                              type="text"
                              value={group.name}
                              onChange={(e) => updateGroup(tab.id, group.id, e.target.value)}
                              className="font-medium bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400 flex-1"
                              placeholder="输入分组名称..."
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => addTutorial(tab.id, group.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded text-sm transition-all duration-200 hover:scale-105"
                              >
                                <Plus className="w-3 h-3" />
                                添加教程
                              </button>
                              <button
                                onClick={() => deleteGroup(tab.id, group.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-sm transition-all duration-200 hover:scale-105"
                              >
                                <Trash2 className="w-3 h-3" />
                                删除分组
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {group.tutorials.map((tutorial) => {
                              const isCollapsed = collapsedTutorials.has(tutorial.id)
                              return (
                                <div key={tutorial.id} className="bg-slate-500/20 rounded-lg border border-slate-400/20 overflow-hidden">
                                  {/* 教程头部 - 始终显示 */}
                                  <div className="flex items-center justify-between p-4 bg-slate-500/10">
                                    <div className="flex items-center gap-3 flex-1">
                                      <button
                                        onClick={() => toggleTutorialCollapse(tutorial.id)}
                                        className="flex items-center justify-center w-6 h-6 rounded hover:bg-slate-600/50 transition-colors"
                                      >
                                        {isCollapsed ? (
                                          <ChevronRight className="w-4 h-4 text-slate-400" />
                                        ) : (
                                          <ChevronDown className="w-4 h-4 text-slate-400" />
                                        )}
                                      </button>
                                      <input
                                        type="text"
                                        value={tutorial.title}
                                        onChange={(e) => updateTutorial(tab.id, group.id, tutorial.id, 'title', e.target.value)}
                                        placeholder="教程标题"
                                        className="font-medium bg-transparent border-none focus:outline-none text-white placeholder-slate-400 flex-1"
                                      />
                                      {tutorial.category && (
                                        <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                                          {tutorial.category}
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => deleteTutorial(tab.id, group.id, tutorial.id)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-sm transition-all duration-200 hover:scale-105"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      删除
                                    </button>
                                  </div>

                                  {/* 教程详细配置 - 可折叠 */}
                                  {!isCollapsed && (
                                    <div className="p-4 border-t border-slate-400/20">
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-xs font-medium mb-2 text-slate-300">封面图片URL</label>
                                          <input
                                            type="text"
                                            value={tutorial.coverUrl}
                                            onChange={(e) => updateTutorial(tab.id, group.id, tutorial.id, 'coverUrl', e.target.value)}
                                            placeholder="图片链接"
                                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-white text-sm placeholder-slate-400"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium mb-2 text-slate-300">教程链接</label>
                                          <input
                                            type="text"
                                            value={tutorial.linkUrl}
                                            onChange={(e) => updateTutorial(tab.id, group.id, tutorial.id, 'linkUrl', e.target.value)}
                                            placeholder="教程链接"
                                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-white text-sm placeholder-slate-400"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium mb-2 text-slate-300">分类标签</label>
                                          <input
                                            type="text"
                                            value={tutorial.category || ''}
                                            onChange={(e) => updateTutorial(tab.id, group.id, tutorial.id, 'category', e.target.value)}
                                            placeholder="如：文字教程、视频教程"
                                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-white text-sm placeholder-slate-400"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium mb-2 text-slate-300">教程描述</label>
                                          <textarea
                                            value={tutorial.remark}
                                            onChange={(e) => updateTutorial(tab.id, group.id, tutorial.id, 'remark', e.target.value)}
                                            placeholder="教程详细描述"
                                            rows={2}
                                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-white text-sm placeholder-slate-400 resize-none"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}