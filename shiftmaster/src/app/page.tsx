'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // 初期化の遅延を追加
    const timer = setTimeout(() => {
      setIsInitialized(true)
      // 認証状態に関係なく、ログインページにリダイレクト
      router.push('/auth/login')
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">読み込み中...</p>
        </div>
      </div>
    )
  }

  return null
}
