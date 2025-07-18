'use client'

import { useState, useEffect } from 'react'
import { Heart, Bookmark, ExternalLink } from 'lucide-react'
import { siteInfo as defaultSiteInfo, donation as defaultDonation, tabs as defaultTabs, socialMedia as defaultSocialMedia } from '../site.config'
import TutorialCard from '../components/TutorialCard'
import DonationModal from '../components/DonationModal'
import BookmarkModal from '../components/BookmarkModal'
import Image from 'next/image'

export default function Home() {
  // 状态管理
  const [siteInfo, setSiteInfo] = useState(defaultSiteInfo)
  const [donation, setDonation] = useState(defaultDonation)
  const [tabs, setTabs] = useState(defaultTabs)
  const [socialMedia, setSocialMedia] = useState(defaultSocialMedia)
  const [activeTabId, setActiveTabId] = useState('')
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // 加载配置（优先使用临时配置）
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
        
        // 设置默认激活的标签页
        if (config.tabs && config.tabs.length > 0) {
          setActiveTabId(config.tabs[0].id)
        }
      } catch (error) {
        console.error('解析临时配置失败:', error)
        // 使用默认配置
        setActiveTabId(defaultTabs[0]?.id || '')
      }
    } else {
      // 使用默认配置
      setActiveTabId(defaultTabs[0]?.id || '')
    }
  }, [])

  // 清除临时配置
  const clearTempConfig = () => {
    localStorage.removeItem('tempSiteConfig')
    setSiteInfo(defaultSiteInfo)
    setDonation(defaultDonation)
    setTabs(defaultTabs)
    setSocialMedia(defaultSocialMedia)
    setActiveTabId(defaultTabs[0]?.id || '')
    setIsPreviewMode(false)
  }

  // 从配置文件中获取启用的社交媒体平台
  const enabledSocialMedia = Object.entries(socialMedia)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => ({
      key,
      ...config
    }))



  const activeTab = tabs.find(tab => tab.id === activeTabId)

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
        <section className="relative py-20 sm:py-24 md:py-28 bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 overflow-hidden">
              <Image
                src="/images/logo.svg"
                alt="老婆宝的教程导航站 Logo"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <h2 className="gradient-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
              老婆宝的酒馆教程发布站
            </h2>
            <p className="text-slate-300 max-w-4xl mx-auto leading-relaxed text-lg sm:text-xl md:text-2xl mb-12 sm:mb-16 px-4 font-light">
              完全开源、免费的SillyTavern教程发布站，由老婆宝撰写。
              <br className="hidden sm:block" />
              请不要以任何形式将本站内容用于商业用途，包括但不限于：推广、商业引流等。
            </p>
            
            {/* 操作按钮 */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 px-4">
              <button
                onClick={() => setShowBookmarkModal(true)}
                className="spotlight-btn flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-white text-sm sm:text-base font-medium border border-slate-600 hover:border-slate-500 hover:bg-slate-800/30"
              >
                <Bookmark className="w-4 h-4" />
                <span>收藏本站</span>
              </button>
              
              {donation.enabled && (
                <button
                  onClick={() => setShowDonationModal(true)}
                  className="spotlight-btn btn-gradient flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-white text-sm sm:text-base font-medium"
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
      <section className="py-8 sm:py-12 bg-slate-800/30 border-y border-slate-700/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {tabs.length > 0 && (
            <div className="text-center">
              <h3 className="gradient-title text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">
                选择分类
              </h3>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`spotlight-btn px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border text-sm sm:text-base ${
                    activeTabId === tab.id
                      ? 'btn-gradient text-white shadow-lg shadow-blue-500/25 border-blue-500'
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
            <div className="space-y-12 sm:space-y-16">
              {activeTab.groups.map((group) => (
                <div key={group.id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl">
                  {/* 分组标题 */}
                  <h3 className="gradient-title text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
                    {group.name}
                  </h3>

                  {/* 教程卡片网格 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
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
          qrCodeUrl={donation.qrCodeUrl}
        />
      )}

      <BookmarkModal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
      />
    </div>
  )
}