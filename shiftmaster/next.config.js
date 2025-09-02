/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドでの環境変数の設定
      const webpack = require('webpack')
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
          'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        })
      )
    }
    return config
  },
  // Vercelデプロイ用の最適化設定
  output: 'standalone',
  experimental: {
    // turbo設定は削除（deprecated）
  },
  // 画像最適化設定
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
}

module.exports = nextConfig
