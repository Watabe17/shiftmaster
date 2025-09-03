'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface InvitationData {
  status: 'valid' | 'expired' | 'used'
  employee_name?: string
  employee_code?: string
  store_name?: string
  email?: string
  message?: string
}

function OnboardForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error('招待リンクが無効です')
      router.push('/auth/login')
      return
    }

    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/invitations?token=${token}`)
      const data = await response.json()
      
      if (response.ok) {
        setInvitationData(data)
        if (data.email) {
          setEmail(data.email)
        }
      } else {
        toast.error(data.error || 'トークンの検証に失敗しました')
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('トークン検証エラー:', error)
      toast.error('トークンの検証中にエラーが発生しました')
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('パスワードが一致しません')
      return
    }

    if (password.length < 8) {
      toast.error('パスワードは8文字以上で入力してください')
      return
    }

    setSubmitting(true)

    try {
      // パスワード設定とアカウント作成
      const response = await fetch('/api/invitations/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password_set: true,
        }),
      })

      if (response.ok) {
        toast.success('アカウントの設定が完了しました！5秒後にログイン画面に移動します')
        setTimeout(() => {
          router.push('/auth/login')
        }, 5000)
      } else {
        const error = await response.json()
        toast.error(error.error || 'アカウント設定に失敗しました')
      }
    } catch (error) {
      console.error('アカウント設定エラー:', error)
      toast.error('予期しないエラーが発生しました')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">招待内容を確認中...</p>
        </div>
      </div>
    )
  }

  if (!invitationData || invitationData.status !== 'valid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-600">招待エラー</CardTitle>
            <CardDescription>
              {invitationData?.message || '招待リンクが無効です'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push('/auth/login')}
            >
              ログイン画面に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">アカウント設定</CardTitle>
          <CardDescription>
            {invitationData.store_name} への招待を受けました
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">招待内容</h3>
            <p className="text-sm text-blue-800">
              従業員: {invitationData.employee_name} ({invitationData.employee_code})
            </p>
            <p className="text-sm text-blue-800">
              店舗: {invitationData.store_name}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8文字以上で入力"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">パスワード（確認）</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="パスワードを再入力"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? '設定中...' : 'アカウントを設定'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// メインのOnboardPageコンポーネント（Suspenseでラップ）
export default function OnboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <OnboardForm />
    </Suspense>
  )
}

