/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用静态导出以支持 EageOne 部署
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 禁用图像优化以支持静态导出
  experimental: {
    // 如果需要，可以在这里添加实验性功能
  }
}

module.exports = nextConfig