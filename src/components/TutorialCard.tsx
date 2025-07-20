'use client'

import { useState } from 'react'
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

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // 获取颜色配置
  const getColorConfig = (colorTheme?: string) => {
    const theme = colorTheme && colorTheme.trim() ? colorTheme : 'blue'
    return cardColors[theme as keyof typeof cardColors] || cardColors.blue
  }

  // 获取图标组件
  const getIconComponent = (iconName?: string) => {
    const icon = iconName && iconName.trim() ? iconName : 'BookOpen'
    return iconMap[icon as keyof typeof iconMap] || BookOpen
  }

  const colorConfig = getColorConfig(tutorial.colorTheme)
  const IconComponent = getIconComponent(tutorial.icon)

  // 生成内联样式以确保颜色正确显示
  const gradientStyle = {
    background: `linear-gradient(135deg, ${getGradientColors(colorConfig.gradient)})`
  }

  const textGradientStyle = {
    background: `linear-gradient(135deg, ${getTextGradientColors(colorConfig.text)})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }

  return (
    <div className="relative group">
      <div className={`tutorial-card bg-slate-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-500 hover:transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/50`} 
           style={{ borderColor: getBorderColor(colorConfig.border) }}>
        
        {/* 可点击的主要内容区域 */}
        <a
          href={tutorial.linkUrl || `/waiting?id=${tutorial.id}&title=${encodeURIComponent(tutorial.title)}&description=${encodeURIComponent(tutorial.title)}&remark=${encodeURIComponent(tutorial.remark || '')}&color=${tutorial.colorTheme || 'blue'}`}
          target={tutorial.linkUrl ? "_blank" : "_self"}
          rel={tutorial.linkUrl ? "noopener noreferrer" : undefined}
          className="block cursor-pointer"
        >
          {/* 装饰性头部区域 */}
          <div className="relative h-20 sm:h-24 overflow-hidden" style={gradientStyle}>
            {/* 装饰性图案 */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/5"></div>
              <div className="absolute bottom-2 left-6 w-4 h-4 rounded-full bg-white/10"></div>
              <div className="absolute bottom-4 right-2 w-10 h-10 rounded-full bg-white/5 animate-pulse delay-1000"></div>
            </div>
            
            {/* 主要图标 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white/80" />
                </div>
                {/* 闪烁装饰 */}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* 外部链接图标 */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </div>

          {/* 标题区域 - 固定高度解决不一致问题 */}
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="h-14 sm:h-16 lg:h-18 flex items-center">
              <h3 className="tutorial-title font-semibold text-white line-clamp-2 leading-relaxed text-base sm:text-lg transition-all duration-300 group-hover:text-transparent"
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
                      style={{ 
                        background: `linear-gradient(135deg, ${getGradientColors(colorConfig.gradient)})`,
                        borderColor: getBorderColor(colorConfig.border)
                      }}>
                  {tutorial.category}
                </span>
              )}
            </div>

            {/* 详情按钮 */}
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                className="px-3 py-1.5 text-xs font-medium bg-slate-700/50 backdrop-blur-sm rounded-lg flex items-center gap-1.5 transition-all duration-300 hover:scale-105 hover:shadow-lg text-slate-300 hover:text-white"
                style={{ borderColor: getBorderColor(colorConfig.border) }}
                onClick={(e) => {
                  e.preventDefault()
                  setShowTooltip(!showTooltip)
                }}
              >
                <Info className="w-3 h-3" />
                <span>详情&gt;&gt;</span>
              </button>

              {/* 优化的详情提示框 */}
              {showTooltip && (
                <div className="absolute bottom-full mb-2 right-0 w-64 max-w-[calc(100vw-3rem)] bg-slate-800/95 backdrop-blur-xl border border-slate-600/80 rounded-lg p-3 shadow-2xl z-50 transform transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                         style={gradientStyle}>
                      <Info className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white mb-1">教程详情</h4>
                      <div className="text-xs leading-relaxed text-slate-200 max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                        {tutorial.remark && tutorial.remark.length > 80 
                          ? tutorial.remark
                          : tutorial.remark || '暂无详细描述'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-600/60">
                    <span className="text-xs text-slate-400">点击访问</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                  {/* 箭头指示器 */}
                  <div className="absolute top-full right-3 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-800/95"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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