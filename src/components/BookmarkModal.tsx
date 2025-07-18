'use client'

import { X, Bookmark } from 'lucide-react'

interface BookmarkModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookmarkModal({ isOpen, onClose }: BookmarkModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* 图标 */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center">
            <Bookmark className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* 标题 */}
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          收藏本站
        </h2>

        {/* 说明文字 */}
        <div className="text-gray-300 text-center leading-relaxed space-y-4">
          <div>
            <p className="font-medium mb-2">请按以下快捷键将本站加入收藏夹：</p>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <span className="bg-gray-600 px-3 py-1 rounded border border-gray-500 text-sm font-mono text-white">Ctrl</span>
                <span className="text-gray-400">+</span>
                <span className="bg-gray-600 px-3 py-1 rounded border border-gray-500 text-sm font-mono text-white">D</span>
                <span className="text-gray-400 text-sm ml-2">(Windows/Linux)</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="bg-gray-600 px-3 py-1 rounded border border-gray-500 text-sm font-mono text-white">⌘</span>
                <span className="text-gray-400">+</span>
                <span className="bg-gray-600 px-3 py-1 rounded border border-gray-500 text-sm font-mono text-white">D</span>
                <span className="text-gray-400 text-sm ml-2">(Mac)</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-300 font-medium">
              手机用户可以将本页面添加到书签或主屏幕
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}