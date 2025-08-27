'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Clock, Settings, BarChart3, Bot } from 'lucide-react'
import { getUserRole } from '@/lib/auth-utils'

export default function AdminHomePage() {
  const { user, session, loading, signOut } = useAuth()
  const router = useRouter()

  // 認証チェック
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to login...')
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // 権限チェック
  useEffect(() => {
    if (user && !loading) {
      const role = getUserRole(user)
      if (role === 'employee') {
        console.log('User is an employee, redirecting...')
        router.push('/employee-dashboard')
      }
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

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
    return null
  }

  const role = getUserRole(user)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">管理者ダッシュボード</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.email || 'ゲストユーザー'}
              </span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {role === 'admin' ? '管理者' : role === 'system_admin' ? 'システム管理者' : role}
              </span>
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">管理者ダッシュボード</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 従業員管理カード */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  従業員管理
                </CardTitle>
                <CardDescription>
                  従業員情報・招待・権限の管理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => router.push('/admin/employees')}
                >
                  従業員を管理
                </Button>
              </CardContent>
            </Card>

            {/* シフト作成カード */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  シフト作成
                </CardTitle>
                <CardDescription>
                  従業員の希望を考慮したシフト作成
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => router.push('/admin/shift-create')}
                >
                  シフトを作成
                </Button>
              </CardContent>
            </Card>

            {/* 勤怠管理カード */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  勤怠管理
                </CardTitle>
                <CardDescription>
                  出勤・退勤・休憩時間の確認・修正
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => router.push('/admin/attendance')}
                >
                  勤怠を確認
                </Button>
              </CardContent>
            </Card>

            {/* 店舗設定カード */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  店舗設定
                </CardTitle>
                <CardDescription>
                  営業時間・ルール・決済設定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => router.push('/admin/settings')}
                >
                  設定を変更
                </Button>
              </CardContent>
            </Card>

            {/* レポート・分析カード */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  レポート・分析
                </CardTitle>
                <CardDescription>
                  勤怠・シフトの統計・分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  レポートを表示
                </Button>
              </CardContent>
            </Card>

            {/* AIシフト生成カード */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  AIシフト生成
                </CardTitle>
                <CardDescription>
                  従業員の希望を考慮した自動シフト生成
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  シフトを生成
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 今日の状況 */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>今日の状況</CardTitle>
                <CardDescription>
                  本日の勤務状況と注意事項
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">15</div>
                    <div className="text-sm text-green-600">出勤中</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-blue-600">休憩中</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">2</div>
                    <div className="text-sm text-gray-600">未出勤</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


