'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  Settings, 
  Globe, 
  Clock, 
  Bell, 
  Mail, 
  Smartphone,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Database,
  Server,
  Users,
  Key,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

interface GeneralSettings {
  systemName: string
  companyName: string
  timezone: string
  language: string
  dateFormat: string
  timeFormat: string
  maintenanceMode: boolean
  systemVersion: string
  lastUpdate: string
}

interface NotificationSettings {
  emailEnabled: boolean
  smsEnabled: boolean
  pushEnabled: boolean
  systemNotifications: boolean
  securityAlerts: boolean
  maintenanceNotifications: boolean
  emailServer: string
  smsProvider: string
  notificationFrequency: string
}

interface SecuritySettings {
  passwordMinLength: number
  passwordRequireUppercase: boolean
  passwordRequireLowercase: boolean
  passwordRequireNumbers: boolean
  passwordRequireSymbols: boolean
  passwordExpiryDays: number
  maxLoginAttempts: number
  sessionTimeoutMinutes: number
  twoFactorEnabled: boolean
  ipWhitelist: string[]
  auditLogEnabled: boolean
}

interface SystemSettings {
  general: GeneralSettings
  notifications: NotificationSettings
  security: SecuritySettings
}

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      systemName: 'ShiftMaster',
      companyName: '株式会社サンプル',
      timezone: 'Asia/Tokyo',
      language: 'ja',
      dateFormat: 'YYYY/MM/DD',
      timeFormat: '24h',
      maintenanceMode: false,
      systemVersion: '1.0.0',
      lastUpdate: new Date().toISOString()
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      systemNotifications: true,
      securityAlerts: true,
      maintenanceNotifications: true,
      emailServer: 'smtp.gmail.com',
      smsProvider: 'Twilio',
      notificationFrequency: 'realtime'
    },
    security: {
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: false,
      passwordExpiryDays: 90,
      maxLoginAttempts: 5,
      sessionTimeoutMinutes: 30,
      twoFactorEnabled: false,
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
      auditLogEnabled: true
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (section: keyof SystemSettings, key: string, value: string | number | boolean | string[]) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSecuritySettingChange = (key: string, value: string | number | boolean | string[]) => {
    handleSettingChange('security', key, value)
  }

  const handleGeneralSettingChange = (key: string, value: string | number | boolean) => {
    handleSettingChange('general', key, value)
  }

  const handleNotificationSettingChange = (key: string, value: string | number | boolean) => {
    handleSettingChange('notifications', key, value)
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // 実際のAPI呼び出しをここに実装
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('設定を保存しました')
      setHasChanges(false)
    } catch (error) {
      toast.error('設定の保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSettings = () => {
    if (confirm('設定をリセットしますか？変更内容は失われます。')) {
      // デフォルト値にリセット
      toast.success('設定をリセットしました')
      setHasChanges(false)
    }
  }

  const handleTestEmail = () => {
    toast.success('テストメールを送信しました')
  }

  const handleTestSMS = () => {
    toast.success('テストSMSを送信しました')
  }

  const getPasswordStrength = () => {
    let score = 0
    if (settings.security.passwordMinLength >= 8) score++
    if (settings.security.passwordRequireUppercase) score++
    if (settings.security.passwordRequireLowercase) score++
    if (settings.security.passwordRequireNumbers) score++
    if (settings.security.passwordRequireSymbols) score++
    
    if (score <= 2) return { level: '弱', color: 'text-red-600', bg: 'bg-red-100' }
    if (score <= 4) return { level: '中', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: '強', color: 'text-green-600', bg: 'bg-green-100' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">システム設定</h1>
          <p className="text-muted-foreground">システムの全般設定、通知、セキュリティを管理</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            リセット
          </Button>
          <Button onClick={handleSaveSettings} disabled={!hasChanges || isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存
              </>
            )}
          </Button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>全般設定</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>通知設定</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>セキュリティ</span>
          </TabsTrigger>
        </TabsList>

        {/* 全般設定タブ */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
              <CardDescription>
                システムの基本情報と表示設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">システム名</Label>
                  <Input
                    id="systemName"
                    value={settings.general.systemName}
                    onChange={(e) => handleGeneralSettingChange('systemName', e.target.value)}
                    placeholder="システム名を入力"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">会社名</Label>
                  <Input
                    id="companyName"
                    value={settings.general.companyName}
                    onChange={(e) => handleGeneralSettingChange('companyName', e.target.value)}
                    placeholder="会社名を入力"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">タイムゾーン</Label>
                  <Select value={settings.general.timezone} onValueChange={(value) => handleGeneralSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">言語</Label>
                  <Select value={settings.general.language} onValueChange={(value) => handleGeneralSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">日付形式</Label>
                  <Select value={settings.general.dateFormat} onValueChange={(value) => handleGeneralSettingChange('dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => handleGeneralSettingChange('maintenanceMode', checked)}
                />
                <Label htmlFor="maintenanceMode">メンテナンスモード</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>システムバージョン</Label>
                  <div className="text-sm text-muted-foreground">
                    {settings.general.systemVersion}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>最終更新日</Label>
                  <div className="text-sm text-muted-foreground">
                    {new Date(settings.general.lastUpdate).toLocaleString('ja-JP')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知設定タブ */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>
                システム通知の受信方法と種類を設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">通知方法</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">メール通知</div>
                      <div className="text-sm text-muted-foreground">重要な通知をメールで受信</div>
                    </div>
                    <Switch
                      checked={settings.notifications.emailEnabled}
                      onCheckedChange={(checked) => handleNotificationSettingChange('emailEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium">SMS通知</div>
                      <div className="text-sm text-muted-foreground">緊急時のみSMSで通知</div>
                    </div>
                    <Switch
                      checked={settings.notifications.smsEnabled}
                      onCheckedChange={(checked) => handleNotificationSettingChange('smsEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <div className="font-medium">プッシュ通知</div>
                      <div className="text-sm text-muted-foreground">アプリ内でプッシュ通知</div>
                    </div>
                    <Switch
                      checked={settings.notifications.pushEnabled}
                      onCheckedChange={(checked) => handleNotificationSettingChange('pushEnabled', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">通知種類</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <Info className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">システム通知</div>
                    </div>
                    <Switch
                      checked={settings.notifications.systemNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange('systemNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div className="flex-1">
                      <div className="font-medium">セキュリティアラート</div>
                    </div>
                    <Switch
                      checked={settings.notifications.securityAlerts}
                      onCheckedChange={(checked) => handleNotificationSettingChange('securityAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Server className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium">メンテナンス通知</div>
                    </div>
                    <Switch
                      checked={settings.notifications.maintenanceNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange('maintenanceNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emailServer">メールサーバー</Label>
                  <Input
                    id="emailServer"
                    value={settings.notifications.emailServer}
                    onChange={(e) => handleNotificationSettingChange('emailServer', e.target.value)}
                    placeholder="SMTPサーバーアドレス"
                  />
                  <Button variant="outline" size="sm" onClick={handleTestEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    テスト送信
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsProvider">SMSプロバイダー</Label>
                  <Select value={settings.notifications.smsProvider} onValueChange={(value) => handleNotificationSettingChange('smsProvider', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Twilio">Twilio</SelectItem>
                      <SelectItem value="AWS_SNS">AWS SNS</SelectItem>
                      <SelectItem value="Nexmo">Nexmo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={handleTestSMS}>
                    <Smartphone className="h-4 w-4 mr-2" />
                    テスト送信
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* セキュリティタブ */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>パスワードポリシー</CardTitle>
              <CardDescription>
                パスワードの強度と有効期限を設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">最小文字数</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleSecuritySettingChange('passwordMinLength', parseInt(e.target.value))}
                    min="6"
                    max="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiryDays">有効期限（日）</Label>
                  <Input
                    id="passwordExpiryDays"
                    type="number"
                    value={settings.security.passwordExpiryDays}
                    onChange={(e) => handleSecuritySettingChange('passwordExpiryDays', parseInt(e.target.value))}
                    min="0"
                    max="365"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">パスワード要件</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="requireUppercase"
                      checked={settings.security.passwordRequireUppercase}
                      onCheckedChange={(checked) => handleSecuritySettingChange('passwordRequireUppercase', checked)}
                    />
                    <Label htmlFor="requireUppercase">大文字を含む</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="requireLowercase"
                      checked={settings.security.passwordRequireLowercase}
                      onCheckedChange={(checked) => handleSecuritySettingChange('passwordRequireLowercase', checked)}
                    />
                    <Label htmlFor="requireLowercase">小文字を含む</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="requireNumbers"
                      checked={settings.security.passwordRequireNumbers}
                      onCheckedChange={(checked) => handleSecuritySettingChange('passwordRequireNumbers', checked)}
                    />
                    <Label htmlFor="requireNumbers">数字を含む</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="requireSymbols"
                      checked={settings.security.passwordRequireSymbols}
                      onCheckedChange={(checked) => handleSecuritySettingChange('passwordRequireSymbols', checked)}
                    />
                    <Label htmlFor="requireSymbols">記号を含む</Label>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${passwordStrength.bg}`}>
                  <div className="flex items-center space-x-2">
                    <Shield className={`h-5 w-5 ${passwordStrength.color}`} />
                    <span className={`font-medium ${passwordStrength.color}`}>
                      パスワード強度: {passwordStrength.level}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>セッション管理</CardTitle>
              <CardDescription>
                ログインセッションとアクセス制御の設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">最大ログイン試行回数</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSecuritySettingChange('maxLoginAttempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">セッションタイムアウト（分）</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeoutMinutes}
                    onChange={(e) => handleSecuritySettingChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                    min="15"
                    max="480"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="twoFactorEnabled"
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorEnabled', checked)}
                  />
                  <Label htmlFor="twoFactorEnabled">二要素認証を有効にする</Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Switch
                    id="auditLogEnabled"
                    checked={settings.security.auditLogEnabled}
                    onCheckedChange={(checked) => handleSecuritySettingChange('auditLogEnabled', checked)}
                  />
                  <Label htmlFor="auditLogEnabled">監査ログを有効にする</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>IPアドレスホワイトリスト</Label>
                <Textarea
                  value={settings.security.ipWhitelist.join('\n')}
                  onChange={(e) => handleSecuritySettingChange('ipWhitelist', e.target.value.split('\n').filter(ip => ip.trim()))}
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                  rows={4}
                />
                <div className="text-sm text-muted-foreground">
                  1行に1つのIPアドレスまたはCIDR表記を入力してください
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
