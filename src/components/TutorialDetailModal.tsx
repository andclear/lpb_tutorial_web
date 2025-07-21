'use client'

import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ExternalLink, BookOpen, Sparkles, GraduationCap, Brain, Lightbulb, Target, Award, BookMarked, Library, Code, Terminal, Cpu, Database, Globe, Smartphone, Monitor, Server, Settings, Wrench, Hammer, Scissors, Paintbrush, Palette, Compass, Calculator, Video, Image, Music, Camera, Film, Mic, Headphones, Radio, Gamepad2, Joystick, Dice1, Puzzle, Trophy, Star, Heart, Briefcase, FileText, PieChart, BarChart, TrendingUp, DollarSign, CreditCard, Building, Pencil, Users, Clock, Calendar, Bookmark, GitBranch, Github, Cloud, Laptop, HardDrive, Wifi, Zap, Bug, Search, Filter, Download, Upload, Copy, Share, Link as LinkIcon, Lock, Play, Pause, Volume2, MessageCircle, Gift, Coffee, Mail, Phone, User, MapPin, ShoppingCart, Bot, Rocket, Activity, Home, Car, Plane, Train, Bike, Apple, Utensils, ShoppingBag, Shirt, Sun, Moon, Tablet } from 'lucide-react'

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

interface TutorialDetailModalProps {
  tutorial: Tutorial
  isOpen: boolean
  onClose: () => void
}

// 图标映射
const iconMap = {
  BookOpen, Sparkles, GraduationCap, Brain, Lightbulb, Target, Award, BookMarked, Library,
  Code, Terminal, Cpu, Database, Globe, Smartphone, Monitor, Server,
  Settings, Wrench, Hammer, Scissors, Paintbrush, Palette, Compass, Calculator,
  Video, Image, Music, Camera, Film, Mic, Headphones, Radio,
  Gamepad2, Joystick, Dice1, Puzzle, Trophy, Star, Heart,
  Briefcase, FileText, PieChart, BarChart, TrendingUp, DollarSign, CreditCard, Building,
  Pencil, Users, Clock, Calendar, Bookmark,
  GitBranch, Github, Cloud, Laptop, HardDrive, Wifi, Zap, Bug,
  Search, Filter, Download, Upload, Copy, Share, LinkIcon, Lock,
  Play, Pause, Volume2, MessageCircle,
  Gift, Coffee,
  Mail, Phone, User, MapPin, ShoppingCart,
  Bot, Rocket, Activity,
  Home, Car, Plane, Train, Bike, Apple, Utensils, ShoppingBag, Shirt, Sun, Moon, Tablet
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

export default function TutorialDetailModal({ tutorial, isOpen, onClose }: TutorialDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // 获取颜色配置
  const colorConfig = cardColors[tutorial.colorTheme as keyof typeof cardColors] || cardColors.blue
  
  // 获取图标组件
  const IconComponent = iconMap[tutorial.icon as keyof typeof iconMap] || BookOpen

  // 样式对象
  const gradientStyle = {
    background: `linear-gradient(135deg, ${getGradientColors(colorConfig.gradient)})`
  }

  const textGradientStyle = {
    background: `linear-gradient(135deg, ${getTextGradientColors(colorConfig.text)})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // 防止背景滚动
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // 处理ESC键关闭
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOpenTutorial = () => {
    const url = tutorial.linkUrl || `/waiting?id=${tutorial.id}&title=${encodeURIComponent(tutorial.title)}&description=${encodeURIComponent(tutorial.title)}&remark=${encodeURIComponent(tutorial.remark || '')}&color=${tutorial.colorTheme || 'blue'}`
    
    if (tutorial.linkUrl) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = url
    }
    onClose()
  }

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      {/* 增强的模糊背景 - 覆盖整个视口 */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      />
      
      {/* 弹窗内容 */}
      <div 
        ref={modalRef}
        className="relative bg-slate-800/95 backdrop-blur-xl border border-slate-600/80 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
        style={{ zIndex: 10000 }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-700/80 backdrop-blur-sm flex items-center justify-center hover:bg-slate-600/80 transition-colors"
        >
          <X className="w-4 h-4 text-slate-300" />
        </button>

        {/* 装饰性头部区域 */}
        <div className="h-24 relative overflow-hidden" style={gradientStyle}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/5"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-white/5"></div>
        </div>

        {/* 主要图标 */}
        <div className="px-6 -mt-12 relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm border border-white/20" style={gradientStyle}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 pt-4">
          {/* 标题 */}
          <h3 className="text-xl font-bold text-white mb-3 leading-relaxed" style={textGradientStyle}>
            {tutorial.title}
          </h3>

          {/* 分类标签 */}
          {tutorial.category && tutorial.category.trim() && (
            <div className="mb-4">
              <span className="inline-block backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg" style={gradientStyle}>
                {tutorial.category}
              </span>
            </div>
          )}

          {/* 详细描述 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-amber-400 mb-3">教程详情</h4>
            <div className="text-sm leading-relaxed text-slate-200 max-h-40 overflow-y-auto">
              {tutorial.remark && tutorial.remark.trim() ? (
                <p className="whitespace-pre-wrap">{tutorial.remark}</p>
              ) : (
                <p className="text-slate-400 italic">暂无详细描述</p>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleOpenTutorial}
              className="flex-[2] bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {tutorial.linkUrl ? (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>打开教程</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>查看教程</span>
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="flex-[1] py-3 px-4 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium rounded-xl transition-all duration-200"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // 使用 Portal 将弹窗渲染到 body
  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null
}