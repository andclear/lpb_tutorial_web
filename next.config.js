/** @type {import('next').NextConfig} */
const nextConfig = {
  // 注释掉静态导出配置以支持API路由
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig