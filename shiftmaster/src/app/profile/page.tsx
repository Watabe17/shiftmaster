'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Settings, Bell, Shield, Clock, MapPin } from 'lucide-react'

// 型定義
interface Employee {
  id: string
  name: string
  employeeCode: string
  email: string
  phone: string
  position: string
  department: string
  hireDate: string
  status: 'active' | 'inactive'
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  shiftReminders: boolean
  attendanceAlerts: boolean
  systemUpdates: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'team' | 'private'
  locationSharing: boolean
  activityStatus: boolean
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Employee>>({})
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    shiftReminders: true,
    attendanceAlerts: true,
    systemUpdates: false
  })
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'team',
    locationSharing: true,
    activityStatus: true
  })
  const [isSaving, setIsSaving] = useState(false)

  // モックデータ
  useEffect(() => {
    setEmployee({
      id: '1',
      name: '田中太郎',
      employeeCode: 'EMP001',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
      position: '店員',
      department: '販売部',
      hireDate: '2023-04-01',
      status: 'active'
    })
  }, [])

  const handleEdit = () => {
    if (employee) {
      setEditForm({
        name: employee.name,
        email: employee.email,
        phone: employee.phone
      })
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // 保存処理のシミュレーション
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (employee) {
      setEmployee({
        ...employee,
        ...editForm
      })
    }
    
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({})
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">プロフィール</h1>
          <p className="text-gray-600">個人情報と設定の管理</p>
        </div>
        <Button onClick={() => window.history.back()} variant="outline">
          戻る
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            プロフィール
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            通知設定
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            プライバシー
          </TabsTrigger>
        </TabsList>

        {/* プロフィールタブ */}
        <TabsContent value="profile" className="space-y-6">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                基本情報
              </CardTitle>
              <CardDescription>
                従業員の基本情報を確認・編集できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">従業員コード</Label>
                    <p className="text-lg font-semibold">{employee.employeeCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">氏名</Label>
                    <p className="text-lg font-semibold">{employee.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">メールアドレス</Label>
                    <p className="text-lg">{employee.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">電話番号</Label>
                    <p className="text-lg">{employee.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">部署</Label>
                    <p className="text-lg">{employee.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">役職</Label>
                    <p className="text-lg">{employee.position}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">入社日</Label>
                    <p className="text-lg">{new Date(employee.hireDate).toLocaleDateString('ja-JP')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">ステータス</Label>
                    <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                      {employee.status === 'active' ? '在職中' : '退職'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">氏名</Label>
                    <Input
                      id="name"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">電話番号</Label>
                    <Input
                      id="phone"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {!isEditing ? (
                  <Button onClick={handleEdit}>
                    編集
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? '保存中...' : '保存'}
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      キャンセル
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 勤務情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                勤務情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">24</p>
                  <p className="text-sm text-gray-600">今月の勤務日数</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">192</p>
                  <p className="text-sm text-gray-600">今月の勤務時間</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">8</p>
                  <p className="text-sm text-gray-600">今月の残業時間</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知設定タブ */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                通知設定
              </CardTitle>
              <CardDescription>
                各種通知の受信設定を管理できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">メール通知</Label>
                    <p className="text-sm text-gray-600">重要な更新や変更をメールで受け取る</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">プッシュ通知</Label>
                    <p className="text-sm text-gray-600">ブラウザでのプッシュ通知を受信する</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">シフトリマインダー</Label>
                    <p className="text-sm text-gray-600">シフト開始前に通知を受け取る</p>
                  </div>
                  <Switch
                    checked={notificationSettings.shiftReminders}
                    onCheckedChange={(checked) => handleNotificationChange('shiftReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">勤怠アラート</Label>
                    <p className="text-sm text-gray-600">勤怠に関する重要な通知を受け取る</p>
                  </div>
                  <Switch
                    checked={notificationSettings.attendanceAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('attendanceAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">システム更新</Label>
                    <p className="text-sm text-gray-600">システムの更新やメンテナンス情報を受け取る</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('systemUpdates', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* プライバシータブ */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                プライバシー設定
              </CardTitle>
              <CardDescription>
                個人情報の表示範囲と共有設定を管理できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">プロフィールの表示範囲</Label>
                  <p className="text-sm text-gray-600">他の従業員に表示される情報の範囲を設定</p>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  >
                    <option value="public">全員に公開</option>
                    <option value="team">チーム内のみ</option>
                    <option value="private">非公開</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">位置情報の共有</Label>
                    <p className="text-sm text-gray-600">勤怠管理での位置情報共有を許可する</p>
                  </div>
                  <Switch
                    checked={privacySettings.locationSharing}
                    onCheckedChange={(checked) => handlePrivacyChange('locationSharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">アクティビティステータス</Label>
                    <p className="text-sm text-gray-600">オンライン/オフライン状態を表示する</p>
                  </div>
                  <Switch
                    checked={privacySettings.activityStatus}
                    onCheckedChange={(checked) => handlePrivacyChange('activityStatus', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* セキュリティ情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                セキュリティ情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">最終ログイン</Label>
                  <p className="text-lg">2024年1月15日 09:30</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">ログイン回数</Label>
                  <p className="text-lg">今月: 24回</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">パスワード更新</Label>
                  <p className="text-lg">2023年12月1日</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">2段階認証</Label>
                  <Badge variant="secondary">未設定</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  パスワード変更
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
