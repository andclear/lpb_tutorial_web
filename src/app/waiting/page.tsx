'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Heart, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import UrgeButton from '@/components/UrgeButton'

// 本地定义颜色配置
const cardColors = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10'
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    border: 'border-green-500/30',
    text: 'text-green-400',
    bg: 'bg-green-500/10'
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10'
  },
  pink: {
    gradient: 'from-pink-500 to-pink-600',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10'
  },
  indigo: {
    gradient: 'from-indigo-500 to-indigo-600',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/10'
  }
}

interface Tutorial {
  id: string
  title: string
  description: string
  remark?: string
  color: keyof typeof cardColors
}

export default function WaitingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tutorialId = searchParams.get('id')
    const title = searchParams.get('title')
    const description = searchParams.get('description')
    const remark = searchParams.get('remark')
    const color = searchParams.get('color') as keyof typeof cardColors

    if (tutorialId && title && description) {
      setTutorial({
        id: tutorialId,
        title,
        description,
        remark: remark || undefined,
        color: color || 'blue'
      })
    }
    setLoading(false)
  }, [searchParams])

  const colorConfig = tutorial ? cardColors[tutorial.color] : cardColors.blue

  const handleGoBack = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">页面参数错误</h1>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={handleGoBack}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回教程发布页</span>
        </button>

        {/* 主要内容 */}
        <div className="max-w-2xl mx-auto">
          {/* 教程卡片 */}
          <div className={`bg-slate-800/50 backdrop-blur-xl border ${colorConfig.border} rounded-2xl p-8 mb-8 shadow-2xl`}>
            {/* 教程标题 */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorConfig.gradient} flex items-center justify-center shadow-lg`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{tutorial.title}</h1>
                <p className={`text-sm ${colorConfig.text} mt-1`}>{tutorial.description}</p>
              </div>
            </div>

            {/* 等待消息 */}
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorConfig.gradient} flex items-center justify-center shadow-lg animate-pulse`}>
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">
                这个教程老婆宝已经正在写啦，请耐心等待教程发布哦
              </h2>
              <div className="flex items-center justify-center gap-2 text-pink-400">
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-sm">用心制作中...</span>
                <Heart className="w-4 h-4 fill-current" />
              </div>
            </div>

            {/* 教程详情 */}
            {tutorial.remark && (
              <div className={`${colorConfig.bg} border ${colorConfig.border} rounded-xl p-6 mt-6`}>
                <h3 className={`text-lg font-semibold ${colorConfig.text} mb-3 flex items-center gap-2`}>
                  <BookOpen className="w-5 h-5" />
                  教程简介
                </h3>
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {tutorial.remark}
                </div>
              </div>
            )}
          </div>

          {/* 返回按钮和催更按钮 */}
          <div className="text-center">
            {/* 按钮区域 */}
            <div className="flex gap-4 justify-center items-center">
              <button
                onClick={handleGoBack}
                className={`px-8 py-4 bg-gradient-to-r ${colorConfig.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
              >
                返回教程发布页
              </button>
              
              {/* 催更按钮 */}
              <UrgeButton tutorialId={tutorial.id} colorTheme={tutorial.color} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}