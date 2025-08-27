'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        toast.error("パスワードリセットエラー: " + error.message)
      } else {
        setSent(true)
        toast.success("パスワードリセットメールを送信しました")
      }
    } catch (error) {
      toast.error("予期しないエラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">メール送信完了</CardTitle>
            <CardDescription>
              パスワードリセットメールを送信しました
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">メールをご確認ください</p>
                  <p className="text-blue-700">
                    {email} 宛にパスワードリセット用のリンクを送信しました。
                    メール内のリンクをクリックして、新しいパスワードを設定してください。
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full"
              >
                ログインページに戻る
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSent(false)
                  setEmail('')
                }}
                className="w-full"
              >
                別のメールアドレスで再試行
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ShiftMaster</CardTitle>
          <CardDescription>
            パスワードをリセット
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
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? '送信中...' : 'リセットメールを送信'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-3">
            <Button
              variant="ghost"
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              ログインページに戻る
            </Button>
            
            <p className="text-sm text-gray-600">
              アカウントをお持ちでない場合は{' '}
              <button
                onClick={() => router.push('/auth/register')}
                className="text-blue-600 hover:text-blue-500 underline"
              >
                新規登録
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


