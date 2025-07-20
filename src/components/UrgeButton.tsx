'use client'

import { useState, useEffect } from 'react'
import { Heart, Loader2, AlertCircle } from 'lucide-react'
import { ApiResponse } from '@/lib/api'
import { UrgeResponseData } from '@/lib/types'

interface UrgeButtonProps {
  tutorialId: string
  colorTheme?: string
}

// 本地颜色配置
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

export default function UrgeButton({ tutorialId, colorTheme = 'pink' }: UrgeButtonProps) {
  const [urgeCount, setUrgeCount] = useState(0)
  const [isUrging, setIsUrging] = useState(false)
  const [hasUrged, setHasUrged] = useState(false)
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [remainingUrges, setRemainingUrges] = useState(2)

  const colorConfig = cardColors[colorTheme as keyof typeof cardColors] || cardColors.pink

  // 获取初始催更数据
  useEffect(() => {
    fetchUrgeCount()
  }, [tutorialId])

  const fetchUrgeCount = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/urge/${tutorialId}`)
      const data: ApiResponse<{ urgeCount: number }> = await response.json()
      
      if (data.success && data.data) {
        setUrgeCount(data.data.urgeCount)
      } else {
        throw new Error(data.error || '获取催更数据失败')
      }
    } catch (error) {
      console.error('获取催更数据失败:', error)
      setError(error instanceof Error ? error.message : '获取数据失败')
      setUrgeCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleUrge = async () => {
    if (isUrging || hasUrged) return

    setIsUrging(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/urge/${tutorialId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data: ApiResponse<UrgeResponseData> = await response.json()
      
      if (data.success && data.data) {
        // 成功催更
        setUrgeCount(data.data.urgeCount)
        setRemainingUrges(data.data.remainingUrges)
        setHasUrged(true)
        setMessage(data.data.message)
        
        // 如果还有剩余次数，3秒后允许再次催更
        if (data.data.remainingUrges > 0) {
          setTimeout(() => {
            setHasUrged(false)
          }, 3000)
        }
      } else {
        // 催更失败
        throw new Error(data.error || '催更失败')
      }
      
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 4000)
      
    } catch (error) {
      console.error('催更失败:', error)
      const errorMessage = error instanceof Error ? error.message : '哎呀！催更失败啦！但是已经在写啦在写啦'
      setMessage(errorMessage)
      setError(errorMessage)
      setShowMessage(true)
      setTimeout(() => {
        setShowMessage(false)
        setError(null)
      }, 4000)
    } finally {
      setIsUrging(false)
    }
  }

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-8 py-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        <span className="text-sm text-slate-400 font-semibold">加载中...</span>
      </div>
    )
  }

  // 错误状态（持续显示）
  if (error && !showMessage) {
    return (
      <div className="flex items-center gap-2 px-8 py-4 bg-red-500/20 rounded-xl border border-red-500/30">
        <AlertCircle className="w-4 h-4 text-red-400" />
        <span className="text-sm text-red-400 font-semibold">加载失败</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={handleUrge}
        disabled={isUrging || (hasUrged && remainingUrges === 0)}
        className={`
          relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-sm
          transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
          ${hasUrged 
            ? `bg-gradient-to-r ${colorConfig.gradient} text-white` 
            : 'bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-600/50'
          }
          ${isUrging || (hasUrged && remainingUrges === 0) 
            ? 'opacity-70 cursor-not-allowed' 
            : 'cursor-pointer'
          }
          border ${colorConfig.border}
        `}
      >
        <div className="flex items-center gap-2">
          {isUrging ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : error && showMessage ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Heart className={`w-4 h-4 ${hasUrged ? 'fill-current' : ''}`} />
          )}
          <span>
            {hasUrged 
              ? `被催更 (${urgeCount}次)` 
              : urgeCount > 0 
                ? `催更 (${urgeCount}次)` 
                : '催更'
            }
          </span>
        </div>
        
        {/* 按钮光效 */}
        {hasUrged && !error && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
        )}
      </button>

      {/* 浮动消息提示 */}
      {showMessage && (
        <div className={`
          absolute top-full mt-2 left-1/2 transform -translate-x-1/2
          px-4 py-3 rounded-lg text-sm font-medium text-white
          ${error 
            ? 'bg-gradient-to-r from-red-500 to-red-600 border border-red-500/30' 
            : `bg-gradient-to-r ${colorConfig.gradient} border ${colorConfig.border}`
          }
          shadow-lg animate-in fade-in-0 slide-in-from-bottom-2
          z-50 whitespace-nowrap max-w-xs text-center
        `}>
          {message}
          {/* 箭头 */}
          <div className={`
            absolute bottom-full left-1/2 transform -translate-x-1/2 
            w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] 
            border-l-transparent border-r-transparent 
            ${error ? 'border-b-red-500' : 'border-b-pink-500'}
          `}></div>
        </div>
      )}

      {/* 剩余次数提示 */}
      {!loading && !error && remainingUrges < 2 && remainingUrges > 0 && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {remainingUrges}
        </div>
      )}
    </div>
  )
}