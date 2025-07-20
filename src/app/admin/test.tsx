'use client'

import { useState, useEffect } from 'react'

export default function AdminTest() {
  const [config, setConfig] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        console.log('开始加载配置...')
        const configModule = await import('@/site.config.js')
        console.log('配置模块:', configModule)
        
        const loadedConfig = {
          siteInfo: configModule.siteInfo,
          donation: configModule.donation,
          socialMedia: configModule.socialMedia,
          tabs: configModule.tabs || []
        }
        console.log('加载的配置:', loadedConfig)
        setConfig(loadedConfig)
      } catch (error) {
        console.error('加载配置失败:', error)
        setError(error instanceof Error ? error.message : String(error))
      }
    }

    loadConfig()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Admin 配置测试</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded p-4 mb-4">
          <h2 className="font-bold">错误:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {config ? (
        <div className="bg-green-500/20 border border-green-500 rounded p-4">
          <h2 className="font-bold mb-2">配置加载成功!</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="bg-blue-500/20 border border-blue-500 rounded p-4">
          <p>正在加载配置...</p>
        </div>
      )}
    </div>
  )
}