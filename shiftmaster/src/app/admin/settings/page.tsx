'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Clock, 
  MapPin, 
  CreditCard, 
  Settings, 
  Save, 
  RefreshCw,
  Building2,
  Users,
  Timer,
  Shield
} from 'lucide-react'

interface BusinessHours {
  [key: string]: {
    open: string
    close: string
    isOpen: boolean
  }
}

interface ClockInRules {
  graceTimeMinutes: number
  roundingMinutes: number
  strictLocationMode: boolean
  locationRadiusMeters: number
}

interface BreakRules {
  autoBreakEnabled: boolean
  autoBreakStartHours: number
  autoBreakDurationMinutes: number
  overtimeThresholdMinutes: number
}

interface StoreSettings {
  name: string
  address: string
  phone: string
  email: string
  latitude: number
  longitude: number
  businessHours: BusinessHours
  clockInRules: ClockInRules
  breakRules: BreakRules
  stripeCustomerId?: string
}

export default function StoreSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<StoreSettings>({
    name: 'カフェSunny渋谷店',
    address: '東京都渋谷区渋谷1-1-1',
    phone: '03-1234-5678',
    email: 'info@cafe-sunny.jp',
    latitude: 35.658034,
    longitude: 139.701636,
    businessHours: {
      monday: { open: '08:00', close: '22:00', isOpen: true },
      tuesday: { open: '08:00', close: '22:00', isOpen: true },
      wednesday: { open: '08:00', close: '22:00', isOpen: true },
      thursday: { open: '08:00', close: '22:00', isOpen: true },
      friday: { open: '08:00', close: '22:00', isOpen: true },
      saturday: { open: '09:00', close: '21:00', isOpen: true },
      sunday: { open: '09:00', close: '21:00', isOpen: true }
    },
    clockInRules: {
      graceTimeMinutes: 15,
      roundingMinutes: 15,
      strictLocationMode: true,
      locationRadiusMeters: 50
    },
    breakRules: {
      autoBreakEnabled: true,
      autoBreakStartHours: 6.0,
      autoBreakDurationMinutes: 60,
      overtimeThresholdMinutes: 480
    }
  })

  const daysOfWeek = [
    { key: 'monday', label: '月曜日' },
    { key: 'tuesday', label: '火曜日' },
    { key: 'wednesday', label: '水曜日' },
    { key: 'thursday', label: '木曜日' },
    { key: 'friday', label: '金曜日' },
    { key: 'saturday', label: '土曜日' },
    { key: 'sunday', label: '日曜日' }
  ]

  const handleBusinessHoursChange = (day: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }))
  }

  const handleClockInRulesChange = (field: string, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      clockInRules: {
        ...prev.clockInRules,
        [field]: value
      }
    }))
  }

  const handleBreakRulesChange = (field: string, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      breakRules: {
        ...prev.breakRules,
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // 実際の実装ではAPI呼び出し
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('設定を保存しました')
    } catch (error) {
      toast.error('設定の保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    // 設定をデフォルト値にリセット
    toast.success('設定をリセットしました')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">店舗設定</h1>
          <p className="text-muted-foreground">店舗の基本設定、営業時間、ルールを管理します</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            リセット
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>基本情報</span>
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>営業時間</span>
          </TabsTrigger>
          <TabsTrigger value="clockin" className="flex items-center space-x-2">
            <Timer className="h-4 w-4" />
            <span>打刻ルール</span>
          </TabsTrigger>
          <TabsTrigger value="break" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>休憩ルール</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>決済設定</span>
          </TabsTrigger>
        </TabsList>

        {/* 基本情報タブ */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>店舗基本情報</span>
              </CardTitle>
              <CardDescription>
                店舗の基本情報と連絡先を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store-name">店舗名 *</Label>
                  <Input
                    id="store-name"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="店舗名を入力"
                  />
                </div>
                <div>
                  <Label htmlFor="store-phone">電話番号</Label>
                  <Input
                    id="store-phone"
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="03-1234-5678"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="store-email">メールアドレス</Label>
                <Input
                  id="store-email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="info@example.com"
                />
              </div>

              <div>
                <Label htmlFor="store-address">住所 *</Label>
                <Textarea
                  id="store-address"
                  value={settings.address}
                  onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="店舗の住所を入力"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store-latitude">緯度</Label>
                  <Input
                    id="store-latitude"
                    type="number"
                    step="0.000001"
                    value={settings.latitude}
                    onChange={(e) => setSettings(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                    placeholder="35.658034"
                  />
                </div>
                <div>
                  <Label htmlFor="store-longitude">経度</Label>
                  <Input
                    id="store-longitude"
                    type="number"
                    step="0.000001"
                    value={settings.longitude}
                    onChange={(e) => setSettings(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                    placeholder="139.701636"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 営業時間タブ */}
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>営業時間設定</span>
              </CardTitle>
              <CardDescription>
                各曜日の営業時間と定休日を設定します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daysOfWeek.map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.businessHours[key].isOpen}
                        onCheckedChange={(checked) => handleBusinessHoursChange(key, 'isOpen', checked)}
                      />
                      <Label className="w-20">{label}</Label>
                    </div>
                    
                    {settings.businessHours[key].isOpen ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={settings.businessHours[key].open}
                          onChange={(e) => handleBusinessHoursChange(key, 'open', e.target.value)}
                          className="w-24"
                        />
                        <span>〜</span>
                        <Input
                          type="time"
                          value={settings.businessHours[key].close}
                          onChange={(e) => handleBusinessHoursChange(key, 'close', e.target.value)}
                          className="w-24"
                        />
                      </div>
                    ) : (
                      <Badge variant="secondary">定休日</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 打刻ルールタブ */}
        <TabsContent value="clockin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Timer className="h-5 w-5" />
                <span>打刻・計上ルール</span>
              </CardTitle>
              <CardDescription>
                出退勤の打刻ルールと時間計算の設定を行います
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">時間計算ルール</h3>
                  
                  <div>
                    <Label htmlFor="grace-time">猶予時間（分）</Label>
                    <Input
                      id="grace-time"
                      type="number"
                      min="0"
                      max="60"
                      value={settings.clockInRules.graceTimeMinutes}
                      onChange={(e) => handleClockInRulesChange('graceTimeMinutes', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      定時前後の打刻を許容する時間
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="rounding">丸め時間（分）</Label>
                    <Select
                      value={settings.clockInRules.roundingMinutes.toString()}
                      onValueChange={(value) => handleClockInRulesChange('roundingMinutes', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1分</SelectItem>
                        <SelectItem value="5">5分</SelectItem>
                        <SelectItem value="10">10分</SelectItem>
                        <SelectItem value="15">15分</SelectItem>
                        <SelectItem value="30">30分</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      勤務時間計算時の丸め単位
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">位置情報ルール</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.clockInRules.strictLocationMode}
                      onCheckedChange={(checked) => handleClockInRulesChange('strictLocationMode', checked)}
                    />
                    <Label>厳格な位置情報チェック</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    店舗外での打刻を完全に禁止する
                  </p>

                  <div>
                    <Label htmlFor="location-radius">打刻可能範囲（メートル）</Label>
                    <Input
                      id="location-radius"
                      type="number"
                      min="10"
                      max="1000"
                      value={settings.clockInRules.locationRadiusMeters}
                      onChange={(e) => handleClockInRulesChange('locationRadiusMeters', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      店舗からの距離で打刻可能範囲を設定
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 休憩ルールタブ */}
        <TabsContent value="break" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>休憩・労働時間ルール</span>
              </CardTitle>
              <CardDescription>
                休憩時間の自動付与と労働時間制限を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">自動休憩設定</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.breakRules.autoBreakEnabled}
                      onCheckedChange={(checked) => handleBreakRulesChange('autoBreakEnabled', checked)}
                    />
                    <Label>自動休憩付与</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    一定時間勤務後に自動で休憩時間を付与
                  </p>

                  <div>
                    <Label htmlFor="break-start">休憩開始時間（時間）</Label>
                    <Input
                      id="break-start"
                      type="number"
                      min="1"
                      max="12"
                      step="0.5"
                      value={settings.breakRules.autoBreakStartHours}
                      onChange={(e) => handleBreakRulesChange('autoBreakStartHours', parseFloat(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      何時間勤務後に休憩を開始するか
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="break-duration">休憩時間（分）</Label>
                    <Input
                      id="break-duration"
                      type="number"
                      min="15"
                      max="120"
                      step="15"
                      value={settings.breakRules.autoBreakDurationMinutes}
                      onChange={(e) => handleBreakRulesChange('autoBreakDurationMinutes', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">労働時間制限</h3>
                  
                  <div>
                    <Label htmlFor="overtime-threshold">残業開始時間（分）</Label>
                    <Input
                      id="overtime-threshold"
                      type="number"
                      min="240"
                      max="600"
                      step="30"
                      value={settings.breakRules.overtimeThresholdMinutes}
                      onChange={(e) => handleBreakRulesChange('overtimeThresholdMinutes', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      何分を超えると残業として計算するか
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">現在の設定例</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>• 6時間勤務後に60分の休憩を自動付与</div>
                      <div>• 8時間（480分）を超えると残業計算</div>
                      <div>• 15分単位で時間を丸め計算</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 決済設定タブ */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>決済・請求設定</span>
              </CardTitle>
              <CardDescription>
                Stripe決済の設定と請求管理を行います
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Stripe設定</h3>
                  
                  <div>
                    <Label htmlFor="stripe-customer">Stripe Customer ID</Label>
                    <Input
                      id="stripe-customer"
                      value={settings.stripeCustomerId || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, stripeCustomerId: e.target.value }))}
                      placeholder="cus_xxxxxxxxxxxxx"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Stripeダッシュボードで確認できます
                    </p>
                  </div>

                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Stripe Customer Portal を開く
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">請求情報</h3>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">現在のプラン</span>
                      <Badge variant="default">Pro</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• 月額: ¥9,800</div>
                      <div>• 従業員上限: 100名</div>
                      <div>• 次回請求: 2025年3月1日</div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    請求履歴を表示
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <Shield className="h-5 w-5" />
                  <h4 className="font-medium">セキュリティ情報</h4>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  決済情報は暗号化されて保存され、PCI DSS準拠のStripeで安全に処理されます。
                  クレジットカード情報は当システムには保存されません。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

