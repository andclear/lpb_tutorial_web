'use client'

import { useState, memo, useMemo, useCallback } from 'react'
import { Info, ExternalLink, BookOpen, Sparkles, GraduationCap, Brain, Lightbulb, Target, Award, BookMarked, Library, Code, Terminal, Cpu, Database, Globe, Smartphone, Monitor, Server, Settings, Wrench, Hammer, Scissors, Paintbrush, Palette, Compass, Calculator, Video, Image, Music, Camera, Film, Mic, Headphones, Radio, Gamepad2, Joystick, Dice1, Puzzle, Trophy, Star, Heart, Briefcase, FileText, PieChart, BarChart, TrendingUp, DollarSign, CreditCard, Building, Pencil, Users, Clock, Calendar, Bookmark, GitBranch, Github, Cloud, Laptop, HardDrive, Wifi, Zap, Bug, Search, Filter, Download, Upload, Copy, Share, Link as LinkIcon, Lock, Play, Pause, Volume2, MessageCircle, Gift, Coffee, Mail, Phone, User, MapPin, ShoppingCart, Bot, Rocket, Activity, Home, Car, Plane, Train, Bike, Apple, Utensils, ShoppingBag, Shirt, Sun, Moon, Tablet } from 'lucide-react'

// 本地卡片颜色配置
const cardColors = {
  purple: {
    name: '紫粉渐变',
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-400/30',
    hover: 'hover:border-purple-400/60',
    text: 'from-purple-400 to-pink-400'
  },
  blue: {
    name: '蓝青渐变',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-400/30',
    hover: 'hover:border-blue-400/60',
    text: 'from-blue-400 to-cyan-400'
  },
  green: {
    name: '绿翠渐变',
    gradient: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-400/30',
    hover: 'hover:border-green-400/60',
    text: 'from-green-400 to-emerald-400'
  },
  orange: {
    name: '橙红渐变',
    gradient: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-400/30',
    hover: 'hover:border-orange-400/60',
    text: 'from-orange-400 to-red-400'
  },
  indigo: {
    name: '靛紫渐变',
    gradient: 'from-indigo-500/20 to-purple-500/20',
    border: 'border-indigo-400/30',
    hover: 'hover:border-indigo-400/60',
    text: 'from-indigo-400 to-purple-400'
  },
  teal: {
    name: '青绿渐变',
    gradient: 'from-teal-500/20 to-green-500/20',
    border: 'border-teal-400/30',
    hover: 'hover:border-teal-400/60',
    text: 'from-teal-400 to-green-400'
  },
  rose: {
    name: '玫粉渐变',
    gradient: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-400/30',
    hover: 'hover:border-rose-400/60',
    text: 'from-rose-400 to-pink-400'
  },
  amber: {
    name: '琥珀渐变',
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-400/30',
    hover: 'hover:border-amber-400/60',
    text: 'from-amber-400 to-orange-400'
  }
};

interface Tutorial {
  id: string
  title: string
  linkUrl: string
  remark: string
  category?: string
  colorTheme?: string
  icon?: string
}

interface TutorialCardProps {
  tutorial: Tutorial
}

// 图标映射
const iconMap = {
  BookOpen, Sparkles, GraduationCap, Brain, Lightbulb, Target, Award, BookMarked, Library,
  Code, Terminal, Cpu, Database, Globe, Smartphone, Monitor, Server,
  Settings, Wrench, Hammer, Scissors, Paintbrush, Palette, Compass, Calculator,
  Video, Image, Music, Camera, Film, Mic, Headphones, Radio,
  Gamepad2, Joystick, Dice1, Puzzle, Trophy, Star, Heart,
  Briefcase, FileText, PieChart, BarChart, TrendingUp, DollarSign, CreditCard, Building,
  // 新增图标
  Pencil, Users, Clock, Calendar, Bookmark,
  GitBranch, Github, Cloud, Laptop, HardDrive, Wifi, Zap, Bug,
  Search, Filter, Download, Upload, Copy, Share, LinkIcon, Lock,
  Play, Pause, Volume2, MessageCircle,
  Gift, Coffee,
  Mail, Phone, User, MapPin, ShoppingCart,
  Bot, Rocket, Activity,
  Home, Car, Plane, Train, Bike, Apple, Utensils, ShoppingBag, Shirt, Sun, Moon, Tablet
}

const TutorialCard = memo(function TutorialCard({ tutorial }: TutorialCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // 使用 useMemo 缓存颜色配置计算
  const colorConfig = useMemo(() => {
    const theme = tutorial.colorTheme && tutorial.colorTheme.trim() ? tutorial.colorTheme : 'blue'
    return cardColors[theme as keyof typeof cardColors] || cardColors.blue
  }, [tutorial.colorTheme])

  // 使用 useMemo 缓存图标组件
  const IconComponent = useMemo(() => {
    const icon = tutorial.icon && tutorial.icon.trim() ? tutorial.icon : 'BookOpen'
    return iconMap[icon as keyof typeof iconMap] || BookOpen
  }, [tutorial.icon])

  // 使用 useMemo 缓存样式对象，避免每次渲染重新创建
  const gradientStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${getGradientColors(colorConfig.gradient)})`
  }), [colorConfig.gradient])

  const textGradientStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${getTextGradientColors(colorConfig.text)})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }), [colorConfig.text])

  const borderColor = useMemo(() => getBorderColor(colorConfig.border), [colorConfig.border])

  // 使用 useCallback 优化事件处理函数
  const handleTooltipToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setShowTooltip(!showTooltip)
  }, [showTooltip])

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false)
  }, [])

  return (
    <div className="relative group">
      <div className={`tutorial-card bg-slate-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-200 hover:transform hover:scale-[1.01] hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/30`} 
           style={{ borderColor }}>
        
        {/* 可点击的主要内容区域 */}
        <a
          href={tutorial.linkUrl || `/waiting?id=${tutorial.id}&title=${encodeURIComponent(tutorial.title)}&description=${encodeURIComponent(tutorial.title)}&remark=${encodeURIComponent(tutorial.remark || '')}&color=${tutorial.colorTheme || 'blue'}`}
          target={tutorial.linkUrl ? "_blank" : "_self"}
          rel={tutorial.linkUrl ? "noopener noreferrer" : undefined}
          className="block cursor-pointer"
        >
          {/* 装饰性头部区域 */}
          <div className="h-20 sm:h-24 lg:h-28 relative overflow-hidden"
               style={gradientStyle}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/5"></div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-white/5"></div>
          </div>

          {/* 主要图标 */}
          <div className="px-4 sm:px-5 lg:px-6 -mt-8 sm:-mt-10 lg:-mt-12 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm border border-white/20"
                 style={gradientStyle}>
              {IconComponent && <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />}
            </div>
            
            {/* 外部链接图标 */}
            {tutorial.linkUrl && (
              <div className="absolute top-2 right-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-700/80 backdrop-blur-sm flex items-center justify-center border border-slate-600/50">
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" />
                </div>
              </div>
            )}
          </div>

          {/* 标题区域 - 固定高度解决不一致问题 */}
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="h-14 sm:h-16 lg:h-18 flex items-center">
              <h3 className="tutorial-title font-semibold text-white line-clamp-2 leading-relaxed text-base sm:text-lg transition-all duration-200 group-hover:text-transparent"
                  style={textGradientStyle}>
                {tutorial.title}
              </h3>
            </div>
          </div>
        </a>

        {/* 底部操作区 */}
        <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6">
          <div className="flex items-center justify-between">
            {/* 角标显示 */}
            <div className="flex items-center">
              {tutorial.category && tutorial.category.trim() && (
                <span className="backdrop-blur-sm text-white text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium shadow-lg"
                      style={gradientStyle}>
                  {tutorial.category}
                </span>
              )}
            </div>

            {/* 详情按钮 */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="px-3 py-1.5 text-xs font-medium bg-slate-700/50 backdrop-blur-sm rounded-lg flex items-center gap-1.5 transition-all duration-200 hover:scale-105 hover:shadow-lg text-slate-300 hover:text-white"
                style={{ borderColor }}
                onClick={handleTooltipToggle}
              >
                <Info className="w-3 h-3" />
                <span>详情&gt;&gt;</span>
              </button>

              {/* 优化的详情提示框 */}
              {showTooltip && (
                <div className="absolute bottom-full mb-2 right-0 w-56 max-w-[calc(100vw-2rem)] bg-slate-800/95 backdrop-blur-xl border border-slate-600/80 rounded-lg p-3 shadow-2xl z-50 transform transition-all duration-200">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-amber-400 mb-2">教程详情</h4>
                    <div className="text-xs leading-relaxed text-slate-200">
                      {tutorial.remark && tutorial.remark.trim() ? (
                        <div className="space-y-1">
                          {/* 如果备注较短，直接显示 */}
                          {tutorial.remark.length <= 100 ? (
                            <p>{tutorial.remark}</p>
                          ) : (
                            /* 如果备注较长，显示前100字符 */
                            <div className="max-h-24 overflow-hidden">
                              <p>{tutorial.remark.substring(0, 100)}...</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">暂无详细描述</p>
                      )}
                    </div>
                  </div>
                  {/* 箭头指示器 */}
                  <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-800/95"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// 辅助函数：解析渐变颜色
function getGradientColors(gradientClass: string): string {
  const colorMap: { [key: string]: string } = {
    'from-purple-500/20 to-pink-500/20': 'rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2)',
    'from-blue-500/20 to-cyan-500/20': 'rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)',
    'from-green-500/20 to-emerald-500/20': 'rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2)',
    'from-orange-500/20 to-red-500/20': 'rgba(249, 115, 22, 0.2), rgba(239, 68, 68, 0.2)',
    'from-indigo-500/20 to-purple-500/20': 'rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2)',
    'from-teal-500/20 to-green-500/20': 'rgba(20, 184, 166, 0.2), rgba(34, 197, 94, 0.2)',
    'from-rose-500/20 to-pink-500/20': 'rgba(244, 63, 94, 0.2), rgba(236, 72, 153, 0.2)',
    'from-amber-500/20 to-orange-500/20': 'rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.2)'
  }
  return colorMap[gradientClass] || 'rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)'
}

// 辅助函数：解析文本渐变颜色
function getTextGradientColors(textGradientClass: string): string {
  const colorMap: { [key: string]: string } = {
    'from-purple-400 to-pink-400': '#c084fc, #f472b6',
    'from-blue-400 to-cyan-400': '#60a5fa, #22d3ee',
    'from-green-400 to-emerald-400': '#4ade80, #34d399',
    'from-orange-400 to-red-400': '#fb923c, #f87171',
    'from-indigo-400 to-purple-400': '#818cf8, #c084fc',
    'from-teal-400 to-green-400': '#2dd4bf, #4ade80',
    'from-rose-400 to-pink-400': '#fb7185, #f472b6',
    'from-amber-400 to-orange-400': '#fbbf24, #fb923c'
  }
  return colorMap[textGradientClass] || '#60a5fa, #22d3ee'
}

// 辅助函数：解析边框颜色
function getBorderColor(borderClass: string): string {
  const colorMap: { [key: string]: string } = {
    'border-purple-500/30': 'rgba(168, 85, 247, 0.3)',
    'border-blue-500/30': 'rgba(59, 130, 246, 0.3)',
    'border-green-500/30': 'rgba(34, 197, 94, 0.3)',
    'border-orange-500/30': 'rgba(249, 115, 22, 0.3)',
    'border-indigo-500/30': 'rgba(99, 102, 241, 0.3)',
    'border-teal-500/30': 'rgba(20, 184, 166, 0.3)',
    'border-rose-500/30': 'rgba(244, 63, 94, 0.3)',
    'border-amber-500/30': 'rgba(245, 158, 11, 0.3)'
  }
  return colorMap[borderClass] || 'rgba(59, 130, 246, 0.3)'
}

// 使用memo包装组件以避免不必要的重新渲染
export default TutorialCard