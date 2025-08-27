'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        toast.error("ログインエラー: " + error.message)
      } else {
        toast.success("ログイン成功！認証状態を確認中...")
        // 認証状態の更新を待ってからリダイレクト
        setTimeout(() => {
          console.log('Redirecting to dashboard...')
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error) {
      toast.error("予期しないエラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ShiftMaster</CardTitle>
          <CardDescription>
            シフト管理システムにログイン
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                placeholder="パスワードを入力"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              アカウントをお持ちでない場合は{' '}
              <button
                onClick={() => router.push('/auth/register')}
                className="text-blue-600 hover:text-blue-500 underline"
              >
                新規登録
              </button>
            </p>
            <p className="mt-2">
              <button
                onClick={() => router.push('/auth/reset-password')}
                className="text-blue-600 hover:text-blue-500 underline"
              >
                パスワードを忘れた場合
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


