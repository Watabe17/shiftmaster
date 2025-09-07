/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
  eslint: {
    // ビルド時にESLintの警告を無視
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ビルド時にTypeScriptのエラーを無視
    ignoreBuildErrors: true,
  },
  // Prismaクライアントを外部パッケージとして扱う（Next.js 14では不要）
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドでの環境変数の設定
      const webpack = require('webpack')
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
          'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
          'process.env.NEXT_PUBLIC_GEMINI_API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_GEMINI_API_KEY),
        })
      )
    }
    return config
  },
  // 画像最適化設定
  images: {
    domains: ['localhost'],
    unoptimized: true
  }
};

module.exports = nextConfig;
