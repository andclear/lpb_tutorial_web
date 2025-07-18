'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import Image from 'next/image'

interface Tutorial {
  id: string
  title: string
  coverUrl: string
  linkUrl: string
  remark: string
  category?: string
}

interface TutorialCardProps {
  tutorial: Tutorial
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative group">
      <a
        href={tutorial.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="tutorial-card card-hover block bg-gray-800/60 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl transition-all duration-500"
      >
        {/* 封面图片 */}
        <div className="relative h-40 sm:h-44 md:h-40 bg-gray-700/50 overflow-hidden">
          {!imageError ? (
            <Image
              src={tutorial.coverUrl}
              alt={tutorial.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 mx-auto mb-3 bg-gray-600/50 rounded-full flex items-center justify-center">
                  <span className="text-gray-300 text-xl sm:text-2xl md:text-3xl font-bold">
                    {tutorial.title.charAt(0)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">封面图片</p>
              </div>
            </div>
          )}
          
          {/* 分类角标 */}
          {tutorial.category && tutorial.category.trim() && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg border border-blue-400/30">
                {tutorial.category}
              </span>
            </div>
          )}
        </div>

        {/* 标题 */}
        <div className="p-4 sm:p-5 md:p-4">
          <h3 className="tutorial-title font-semibold text-white line-clamp-2 leading-tight text-base sm:text-lg transition-colors">
            {tutorial.title}
          </h3>
        </div>
      </a>

      {/* Info 图标和提示框 */}
      <div className="absolute top-3 right-3">
        <button
          className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-all border border-gray-600/50 hover:border-gray-500"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={(e) => {
            e.preventDefault()
            setShowTooltip(!showTooltip)
          }}
        >
          <Info className="w-4 h-4 text-gray-300" />
        </button>

        {/* 提示框 */}
        {showTooltip && (
          <div className="absolute top-10 right-0 w-64 bg-gray-800/95 backdrop-blur-xl border border-gray-600/30 rounded-lg p-3 shadow-2xl z-30">
            <div className="text-sm text-gray-300 leading-relaxed">
              {tutorial.remark}
            </div>
            <div className="absolute -top-2 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800/95"></div>
          </div>
        )}
      </div>
    </div>
  )
}