'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface PaymentOption {
  id: string
  name: string
  qrCodeUrl: string
  color: string
}

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  text: string
  paymentOptions: PaymentOption[]
}

export default function DonationModal({ 
  isOpen, 
  onClose, 
  title, 
  text, 
  paymentOptions 
}: DonationModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

  if (!isOpen) return null

  const selectedOption = paymentOptions.find(option => option.id === selectedPayment)

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

        {/* 支付选项按钮 */}
        {!selectedPayment && (
          <div className="flex flex-col gap-3 mb-6">
            {paymentOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedPayment(option.id)}
                className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{ 
                  backgroundColor: option.color,
                  color: 'white'
                }}
              >
                {option.name}
              </button>
            ))}
          </div>
        )}

        {/* 二维码显示 */}
        {selectedPayment && selectedOption && (
          <div className="text-center">
            {/* 返回按钮 */}
            <button
              onClick={() => setSelectedPayment(null)}
              className="mb-4 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-lg transition-all duration-200 border border-gray-500 hover:border-gray-400 shadow-lg hover:shadow-xl"
            >
              ← 返回选择
            </button>

            {/* 当前选择的支付方式 */}
            <div className="mb-4">
              <span 
                className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: selectedOption.color }}
              >
                {selectedOption.name}
              </span>
            </div>

            {/* 二维码 */}
            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                <Image
                  src={selectedOption.qrCodeUrl}
                  alt={`${selectedOption.name}赞赏二维码`}
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
        )}
      </div>
    </div>
  )
}