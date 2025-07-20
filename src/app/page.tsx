'use client'

import { useState, useEffect, useMemo } from 'react'
import { Heart, Bookmark, ExternalLink, Users } from 'lucide-react'
import { siteInfo as defaultSiteInfo, donation as defaultDonation, tabs as defaultTabs, socialMedia as defaultSocialMedia } from '@/site.config'
import TutorialCard from '../components/TutorialCard'
import DonationModal from '../components/DonationModal'
import BookmarkModal from '../components/BookmarkModal'
import Image from 'next/image'

export default function Home() {
  // 状态管理 - 优化初始状态，确保立即渲染
  const [siteInfo, setSiteInfo] = useState(defaultSiteInfo)
  const [donation, setDonation] = useState(defaultDonation)
  const [tabs, setTabs] = useState(defaultTabs)
  const [socialMedia, setSocialMedia] = useState(defaultSocialMedia)
  const [activeTabId, setActiveTabId] = useState(defaultTabs[0]?.id || '') // 立即设置默认标签页
  const [activeGroupId, setActiveGroupId] = useState('all') // 默认显示所有分组
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [hearts, setHearts] = useState<Array<{id: number, x: number, y: number, delay: number, size: number, emoji: string}>>([])

  // 预计算所有需要的数据，确保立即可用
  const enabledSocialMedia = useMemo(() => 
    Object.entries(socialMedia)
      .filter(([_, config]) => config.enabled)
      .map(([key, config]) => ({
        key,
        ...config
      })), [socialMedia])

  const activeTab = useMemo(() => 
    tabs.find(tab => tab.id === activeTabId) || tabs[0], [tabs, activeTabId]) // 确保总是有活动标签页

  const availableGroups = useMemo(() => {
    if (!activeTab) return []
    return activeTab.groups
  }, [activeTab])

  const filteredGroups = useMemo(() => {
    if (!activeTab) return []
    if (activeGroupId === 'all') return activeTab.groups
    return activeTab.groups.filter(group => group.id === activeGroupId)
  }, [activeTab, activeGroupId])

  const totalTutorialsCount = useMemo(() => {
    if (!activeTab) return 0
    return activeTab.groups.reduce((total, group) => total + group.tutorials.length, 0)
  }, [activeTab])

  // 创建爱心飘出动画
  const createHeartAnimation = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const heartEmojis = ['❤️', '💖', '💕', '💗', '💝', '💘', '🧡', '💛', '💚', '💙', '💜']
    
    // 随机生成3-8个爱心，分批出现
    const heartCount = Math.floor(Math.random() * 6) + 3
    
    for (let i = 0; i < heartCount; i++) {
      setTimeout(() => {
        const newHeart = {
          id: Date.now() + Math.random(),
          x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 150, // 更大的随机范围
          y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 40, // 垂直位置也随机
          delay: Math.random() * 0.5, // 0-0.5秒的随机延迟
          size: 0.8 + Math.random() * 0.8, // 0.8-1.6倍大小变化
          emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
        }
        
        setHearts(prev => [...prev, newHeart])
        
        // 4秒后清除这个爱心
        setTimeout(() => {
          setHearts(prev => prev.filter(heart => heart.id !== newHeart.id))
        }, 4000)
      }, i * 150 + Math.random() * 200) // 每个爱心间隔150-350ms出现
    }
  }

  // 加载配置（优先使用临时配置）- 优化为同步加载
  useEffect(() => {
    const tempConfig = localStorage.getItem('tempSiteConfig')
    if (tempConfig) {
      try {
        const config = JSON.parse(tempConfig)
        setSiteInfo(config.siteInfo || defaultSiteInfo)
        setDonation(config.donation || defaultDonation)
        setTabs(config.tabs || defaultTabs)
        setSocialMedia(config.socialMedia || defaultSocialMedia)
        setIsPreviewMode(true)
        
        // 立即设置默认激活的标签页，确保内容立即渲染
        if (config.tabs && config.tabs.length > 0) {
          setActiveTabId(config.tabs[0].id)
          setActiveGroupId('all') // 确保显示所有分组
        }
      } catch (error) {
        console.error('解析临时配置失败:', error)
        // 使用默认配置并立即设置
        setActiveTabId(defaultTabs[0]?.id || '')
        setActiveGroupId('all')
      }
    } else {
      // 使用默认配置并立即设置
      setActiveTabId(defaultTabs[0]?.id || '')
      setActiveGroupId('all')
    }
  }, []) // 保持空依赖数组，确保只执行一次

  // 清除临时配置
  const clearTempConfig = () => {
    localStorage.removeItem('tempSiteConfig')
    setSiteInfo(defaultSiteInfo)
    setDonation(defaultDonation)
    setTabs(defaultTabs)
    setSocialMedia(defaultSocialMedia)
    setActiveTabId(defaultTabs[0]?.id || '')
    setActiveGroupId('all')
    setIsPreviewMode(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 预览模式提示条 */}
      {isPreviewMode && (
        <div className="bg-orange-600 text-white px-4 py-3 text-center relative z-50">
          <div className="flex items-center justify-center gap-4">
            <span className="font-medium">🔍 预览模式 - 当前显示的是临时配置效果</span>
            <button
              onClick={clearTempConfig}
              className="bg-orange-700 hover:bg-orange-800 px-3 py-1 rounded text-sm transition-colors"
            >
              退出预览
            </button>
          </div>
        </div>
      )}
      
      {/* 欢迎介绍部分 */}
        <section className="relative py-12 sm:py-16 md:py-20 bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 overflow-hidden">
              <Image
                src="/images/mylogo.png"
                alt="老婆宝的教程导航站 Logo"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <h2 className="gradient-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              老婆宝的酒馆教程发布站
            </h2>
            <p className="text-slate-300 max-w-4xl mx-auto leading-relaxed text-base sm:text-lg md:text-xl mb-8 sm:mb-10 px-4 font-light">
              完全开源、免费的SillyTavern教程发布站，由老婆宝撰写。
              <br className="hidden sm:block" />
              请不要以任何形式将本站内容用于商业用途，包括但不限于：推广、商业引流等。
              <br className="hidden sm:block" />
              感兴趣可加Q群交流，没有使用QQ习惯的不要加，不活跃会踢。
            </p>
            
            {/* 操作按钮 */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 px-4">
              <button
                onClick={() => setShowBookmarkModal(true)}
                className="spotlight-btn flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-white text-sm sm:text-base font-medium border border-slate-600 hover:border-slate-500 hover:bg-slate-800/30"
              >
                <Bookmark className="w-4 h-4" />
                <span>收藏本站</span>
              </button>
              
              <a
                href="https://qm.qq.com/cgi-bin/qm/qr?k=lGBeDF_PNpmPJppdSeBkpeBGYrYCs0PY&jump_from=webapi&authKey=XVglBDvfExX5vSWU1a/59R5nPbf3Z7GLPAmVPSpB6oAVO4vx9gEcsKf5+Hmj6wyT"
                target="_blank"
                rel="noopener noreferrer"
                className="spotlight-btn bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-white text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Users className="w-4 h-4" />
                <span>加入QQ群</span>
              </a>
              
              {donation.enabled && (
                <button
                  onClick={(e) => {
                    createHeartAnimation(e)
                    setShowDonationModal(true)
                  }}
                  className="spotlight-btn bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-white text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Heart className="w-4 h-4" />
                  <span>{donation.title}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 标签栏部分 */}
      <section className="py-6 sm:py-8 bg-slate-800/30 border-y border-slate-700/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {tabs.length > 0 && (
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`spotlight-btn px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border text-sm sm:text-base ${
                    activeTabId === tab.id
                      ? 'btn-gradient text-white border-blue-500'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 教程内容部分 */}
      <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {activeTab && (
            <div className="space-y-8 sm:space-y-12">
              {/* 分组筛选标签栏 */}
              {availableGroups.length > 1 && (
                <div className="flex justify-end mb-6">
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <span className="text-slate-600">筛选:</span>
                    <button
                      onClick={() => setActiveGroupId('all')}
                      className={`transition-colors duration-200 hover:text-slate-300 ${
                        activeGroupId === 'all'
                          ? 'text-slate-300 font-medium'
                          : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      全部({totalTutorialsCount})
                    </button>
                    {availableGroups.map((group, index) => (
                      <span key={group.id} className="flex items-center gap-1">
                        <span className="text-slate-600">·</span>
                        <button
                          onClick={() => setActiveGroupId(group.id)}
                          className={`transition-colors duration-200 hover:text-slate-300 ${
                            activeGroupId === group.id
                              ? 'text-slate-300 font-medium'
                              : 'text-slate-500 hover:text-slate-400'
                          }`}
                        >
                          {group.name}({group.tutorials.length})
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 分组内容 */}
              {filteredGroups.map((group, index) => (
                <div key={group.id} className="relative">
                  {/* 分组标题区域 */}
                  <div className="flex items-center mb-6 sm:mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
                      <h3 className="gradient-title text-xl sm:text-2xl md:text-3xl font-bold">
                        {group.name}
                      </h3>
                      <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent ml-6"></div>
                    </div>
                    <div className="hidden sm:flex items-center text-slate-400 text-sm">
                      <span>{group.tutorials.length} 个教程</span>
                    </div>
                  </div>

                  {/* 教程卡片网格 */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {group.tutorials.map((tutorial) => (
                      <TutorialCard key={tutorial.id} tutorial={tutorial} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 空状态 */}
          {!activeTab && (
            <div className="text-center py-16 sm:py-20 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl mx-3 sm:mx-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-slate-700/50 rounded-full flex items-center justify-center shadow-lg">
                <ExternalLink className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-300 mb-3">暂无内容</h3>
              <p className="text-base sm:text-lg text-slate-400 px-4">请在配置文件中添加教程内容</p>
            </div>
          )}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="relative bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-6 mb-6">
              {enabledSocialMedia.map((platform) => {
                // 根据平台类型返回对应的文字
                const getSocialText = (key: string) => {
                  switch (key) {
                    case 'xiaohongshu':
                      return '小红书';
                    case 'douyin':
                      return '抖音';
                    case 'bilibili':
                      return 'B站';
                    default:
                      return platform.title;
                  }
                };

                return (
                  <a
                    key={platform.key}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spotlight-btn w-12 h-12 bg-slate-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-slate-700/80 transition-all border border-slate-600 hover:border-slate-500 shadow-lg hover:shadow-xl group text-white text-xs font-medium"
                    title={platform.title}
                  >
                    <span className="group-hover:scale-110 transition-transform text-center leading-tight">
                      {getSocialText(platform.key)}
                    </span>
                  </a>
                );
              })}
            </div>
            <div className="text-slate-400 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light px-4">
              {siteInfo.footerText}
            </div>
            <div className="mt-6 text-xs sm:text-sm text-slate-500 font-light">
              © 2025 {siteInfo.title}. All Love For You.
            </div>
          </div>
        </div>
      </footer>

      {/* 模态框 */}
      {donation.enabled && (
        <DonationModal
          isOpen={showDonationModal}
          onClose={() => setShowDonationModal(false)}
          title={donation.title}
          text={donation.text}
          paymentOptions={donation.paymentOptions}
        />
      )}

      <BookmarkModal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
      />

      {/* 爱心飘出动画 */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: heart.x,
            top: heart.y,
            fontSize: `${heart.size * 1.5}rem`,
            animation: `heartFloat 4s ease-out ${heart.delay}s forwards`
          }}
        >
          {heart.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes heartFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
          25% {
            opacity: 0.9;
            transform: translateY(-50px) scale(1.1) rotate(5deg);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-120px) scale(1.2) rotate(-3deg);
          }
          75% {
            opacity: 0.4;
            transform: translateY(-180px) scale(0.9) rotate(2deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-250px) scale(0.3) rotate(0deg);
          }
        }
      `}</style>
    </div>
  )
}