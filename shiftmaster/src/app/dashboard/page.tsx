'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getUserRole, getRedirectPath } from '@/lib/auth-utils'

export default function DashboardPage() {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // デバッグ用のログ
  useEffect(() => {
    console.log('Dashboard - Current state:', {
      user: user ? { id: user.id, email: user.email } : null,
      session: session ? 'exists' : null,
      loading,
      redirecting
    })
  }, [user, session, loading, redirecting])

  // 認証チェックと権限に基づくリダイレクト
  useEffect(() => {
    if (!loading) {
      console.log('Dashboard - Loading finished, processing redirect...')
      
      if (!user) {
        console.log('Dashboard - No user found, redirecting to login...')
        router.push('/auth/login')
      } else if (!redirecting) {
        try {
          setRedirecting(true)
          setError(null)
          
          const redirectPath = getRedirectPath(user)
          const role = getUserRole(user)
          
          console.log('Dashboard - User authenticated:', {
            email: user.email,
            role,
            redirectPath
          })
          
          // 少し遅延を入れてからリダイレクト
          setTimeout(() => {
            console.log('Dashboard - Executing redirect to:', redirectPath)
            router.push(redirectPath)
          }, 500)
          
        } catch (err) {
          console.error('Dashboard - Error during redirect:', err)
          setError(err instanceof Error ? err.message : 'Unknown error')
          setRedirecting(false)
        }
      }
    }
  }, [user, loading, router, redirecting])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">ログイン画面に遷移中...</p>
        </div>
      </div>
    )
  }

  const role = getUserRole(user)
  const redirectPath = getRedirectPath(user)

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg">リダイレクト中...</p>
        <p className="mt-2 text-sm text-gray-600">
          権限: {role === 'employee' ? '従業員' : role === 'admin' ? '管理者' : 'システム管理者'}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          遷移先: {redirectPath}
        </p>
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            <p className="text-sm">エラー: {error}</p>
          </div>
        )}
        <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
          <p className="text-sm">ユーザー: {user.email}</p>
          <p className="text-sm">ユーザーID: {user.id}</p>
          <p className="text-sm">リダイレクト状態: {redirecting ? '実行中' : '待機中'}</p>
        </div>
      </div>
    </div>
  )
}


