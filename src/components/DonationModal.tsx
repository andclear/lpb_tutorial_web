'use client'

import { X } from 'lucide-react'
import Image from 'next/image'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  text: string
  qrCodeUrl: string
}

export default function DonationModal({ 
  isOpen, 
  onClose, 
  title, 
  text, 
  qrCodeUrl 
}: DonationModalProps) {
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

        {/* 标题 */}
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          {title}
        </h2>

        {/* 描述文字 */}
        <p className="text-gray-300 text-center mb-6 leading-relaxed whitespace-pre-line">
          {text}
        </p>

        {/* 二维码 */}
        <div className="flex justify-center mb-4">
          <div className="w-48 h-48 bg-gray-700 rounded-lg flex items-center justify-center">
            <Image
              src={qrCodeUrl}
              alt="赞赏二维码"
              width={192}
              height={192}
              className="rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `
                    <div class="text-center text-gray-400">
                      <div class="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span class="text-white text-2xl">💝</span>
                      </div>
                      <p class="text-sm">二维码图片</p>
                    </div>
                  `
                }
              }}
              unoptimized
            />
          </div>
        </div>

        {/* 提示文字 */}
        <p className="text-sm text-gray-400 text-center">
          扫描上方二维码进行赞赏
        </p>
      </div>
    </div>
  )
}