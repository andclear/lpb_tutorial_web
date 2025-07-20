'use client'

import { useEffect, useState } from 'react'

export default function ConfigTest() {
  const [config, setConfig] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        console.log('开始加载配置...')
        const configModule = await import('../../site.config.js')
        console.log('配置模块加载成功:', configModule)
        
        const loadedConfig = {
          siteInfo: configModule.siteInfo,
          donation: configModule.donation,
          socialMedia: configModule.socialMedia,
          tabs: configModule.tabs || []
        }
        
        console.log('处理后的配置:', loadedConfig)
        setConfig(loadedConfig)
        setLoading(false)
      } catch (err) {
        console.error('加载配置失败:', err)
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">配置加载测试</h1>
        <p>加载配置文件中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">配置加载测试</h1>
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <h2 className="text-red-400 font-semibold mb-2">加载失败</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">配置加载测试</h1>
      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
        <h2 className="text-green-400 font-semibold mb-2">加载成功！</h2>
        <p className="text-green-300">配置文件已成功加载</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">站点信息</h3>
          <div className="bg-slate-800 rounded-lg p-4">
            <p><strong>标题:</strong> {config.siteInfo?.title}</p>
            <p><strong>页脚:</strong> {config.siteInfo?.footerText}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">标签页数量</h3>
          <div className="bg-slate-800 rounded-lg p-4">
            <p>共有 {config.tabs?.length || 0} 个标签页</p>
            {config.tabs?.map((tab: any, index: number) => (
              <div key={tab.id} className="mt-2">
                <p>标签页 {index + 1}: {tab.name} (包含 {tab.groups?.length || 0} 个分组)</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">赞赏配置</h3>
          <div className="bg-slate-800 rounded-lg p-4">
            <p><strong>启用状态:</strong> {config.donation?.enabled ? '已启用' : '未启用'}</p>
            <p><strong>标题:</strong> {config.donation?.title}</p>
            <p><strong>支付选项:</strong> {config.donation?.paymentOptions?.length || 0} 个</p>
          </div>
        </div>
      </div>
    </div>
  )
}