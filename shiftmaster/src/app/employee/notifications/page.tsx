'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Bell, 
  BellOff, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search,
  Mail,
  Smartphone,
  Calendar,
  User,
  MapPin,
  DollarSign
} from 'lucide-react'

interface Notification {
  id: string
  type: 'shift_confirmed' | 'attendance_alert' | 'deadline_reminder' | 'system' | 'payroll' | 'schedule_change'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  priority: 'high' | 'medium' | 'low'
  category: 'shift' | 'attendance' | 'system' | 'payroll'
  actionUrl?: string
  metadata?: {
    shiftDate?: string
    shiftTime?: string
    location?: string
    amount?: number
    deadline?: string
  }
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  shiftNotifications: boolean
  attendanceAlerts: boolean
  deadlineReminders: boolean
  systemNotifications: boolean
  payrollNotifications: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    shiftNotifications: true,
    attendanceAlerts: true,
    deadlineReminders: true,
    systemNotifications: true,
    payrollNotifications: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  })
  const [activeTab, setActiveTab] = useState('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // モックデータ
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'shift_confirmed',
        title: 'シフト確定のお知らせ',
        message: '2025年2月15日のシフトが確定しました。確認をお願いします。',
        timestamp: '2025-01-20T10:30:00Z',
        isRead: false,
        priority: 'high',
        category: 'shift',
        actionUrl: '/employee/shifts',
        metadata: {
          shiftDate: '2025-02-15',
          shiftTime: '09:00-17:00',
          location: '渋谷店'
        }
      },
      {
        id: '2',
        type: 'attendance_alert',
        title: '勤怠異常のアラート',
        message: '本日の出勤時間が通常より遅いです。体調に問題はありませんか？',
        timestamp: '2025-01-20T09:15:00Z',
        isRead: false,
        priority: 'medium',
        category: 'attendance',
        actionUrl: '/employee/attendance'
      },
      {
        id: '3',
        type: 'deadline_reminder',
        title: 'シフト希望提出期限のリマインダー',
        message: '2月のシフト希望提出期限まであと3日です。',
        timestamp: '2025-01-20T08:00:00Z',
        isRead: true,
        priority: 'medium',
        category: 'shift',
        metadata: {
          deadline: '2025-01-23T23:59:59Z'
        }
      },
      {
        id: '4',
        type: 'payroll',
        title: '給与明細書の配布',
        message: '1月分の給与明細書が配布されました。確認をお願いします。',
        timestamp: '2025-01-19T16:00:00Z',
        isRead: true,
        priority: 'low',
        category: 'payroll',
        metadata: {
          amount: 180000
        }
      },
      {
        id: '5',
        type: 'system',
        title: 'システムメンテナンスのお知らせ',
        message: '1月25日深夜2時から4時までシステムメンテナンスを実施します。',
        timestamp: '2025-01-19T14:00:00Z',
        isRead: true,
        priority: 'low',
        category: 'system'
      },
      {
        id: '6',
        type: 'schedule_change',
        title: 'シフト変更のお知らせ',
        message: '2月10日のシフト時間が変更されました。',
        timestamp: '2025-01-19T12:00:00Z',
        isRead: false,
        priority: 'high',
        category: 'shift',
        metadata: {
          shiftDate: '2025-02-10',
          shiftTime: '10:00-18:00'
        }
      }
    ]
    setNotifications(mockNotifications)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'shift_confirmed':
        return <Calendar className="h-5 w-5 text-green-600" />
      case 'attendance_alert':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'deadline_reminder':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'payroll':
        return <DollarSign className="h-5 w-5 text-purple-600" />
      case 'system':
        return <Info className="h-5 w-5 text-gray-600" />
      case 'schedule_change':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">高</Badge>
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">中</Badge>
      case 'low':
        return <Badge variant="secondary">低</Badge>
      default:
        return <Badge variant="outline">未設定</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'shift':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">シフト</Badge>
      case 'attendance':
        return <Badge variant="default" className="bg-green-100 text-green-800">勤怠</Badge>
      case 'payroll':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">給与</Badge>
      case 'system':
        return <Badge variant="secondary">システム</Badge>
      default:
        return <Badge variant="outline">その他</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays}日前`
    } else if (diffHours > 0) {
      return `${diffHours}時間前`
    } else {
      return '数分前'
    }
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
    toast.success('既読にしました')
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
    toast.success('すべて既読にしました')
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
    toast.success('通知を削除しました')
  }

  const handleClearAll = () => {
    setNotifications([])
    toast.success('すべての通知を削除しました')
  }

  const handleSettingChange = (key: string, value: boolean | string) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof NotificationSettings],
          [child]: value
        }
      }))
    } else {
      setSettings(prev => ({ ...prev, [key]: value }))
    }
    toast.success('設定を更新しました')
  }

  const filteredNotifications = notifications.filter(notification => {
    // タブフィルター
    if (activeTab !== 'all' && notification.category !== activeTab) {
      return false
    }
    
    // 優先度フィルター
    if (filterPriority !== 'all' && notification.priority !== filterPriority) {
      return false
    }
    
    // 検索フィルター
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })

  const unreadCount = notifications.filter(n => !n.isRead).length
  const shiftNotifications = notifications.filter(n => n.category === 'shift')
  const attendanceNotifications = notifications.filter(n => n.category === 'attendance')
  const systemNotifications = notifications.filter(n => n.category === 'system')
  const payrollNotifications = notifications.filter(n => n.category === 'payroll')

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">通知センター</h1>
          <p className="text-muted-foreground">重要な情報とアラートを確認できます</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={unreadCount > 0 ? "destructive" : "secondary"}>
            {unreadCount}件の未読
          </Badge>
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            すべて既読
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>シフト関連</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {shiftNotifications.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {shiftNotifications.filter(n => !n.isRead).length}件未読
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>勤怠関連</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {attendanceNotifications.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {attendanceNotifications.filter(n => !n.isRead).length}件未読
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>給与関連</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {payrollNotifications.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {payrollNotifications.filter(n => !n.isRead).length}件未読
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span>システム</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {systemNotifications.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {systemNotifications.filter(n => !n.isRead).length}件未読
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フィルター・検索 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="通知を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="high">高優先度</SelectItem>
                  <SelectItem value="medium">中優先度</SelectItem>
                  <SelectItem value="low">低優先度</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                全削除
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>すべて</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="shift" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>シフト</span>
            {shiftNotifications.filter(n => !n.isRead).length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {shiftNotifications.filter(n => !n.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>勤怠</span>
            {attendanceNotifications.filter(n => !n.isRead).length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {attendanceNotifications.filter(n => !n.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>給与</span>
            {payrollNotifications.filter(n => !n.isRead).length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {payrollNotifications.filter(n => !n.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Info className="h-4 w-4" />
            <span>システム</span>
            {systemNotifications.filter(n => !n.isRead).length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {systemNotifications.filter(n => !n.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* 通知一覧 */}
        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {activeTab === 'all' ? '通知はありません' : `${activeTab}関連の通知はありません`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.isRead ? 'border-blue-200 bg-blue-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className={`font-medium ${!notification.isRead ? 'text-blue-900' : ''}`}>
                                {notification.title}
                              </h3>
                              {getPriorityBadge(notification.priority)}
                              {getCategoryBadge(notification.category)}
                            </div>
                            
                            <p className={`text-sm ${!notification.isRead ? 'text-blue-800' : 'text-muted-foreground'}`}>
                              {notification.message}
                            </p>
                            
                            {/* メタデータ表示 */}
                            {notification.metadata && (
                              <div className="mt-3 p-3 bg-white rounded-lg border">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                  {notification.metadata.shiftDate && (
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-3 w-3 text-muted-foreground" />
                                      <span>日付: {notification.metadata.shiftDate}</span>
                                    </div>
                                  )}
                                  {notification.metadata.shiftTime && (
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      <span>時間: {notification.metadata.shiftTime}</span>
                                    </div>
                                  )}
                                  {notification.metadata.location && (
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="h-3 w-3 text-muted-foreground" />
                                      <span>場所: {notification.metadata.location}</span>
                                    </div>
                                  )}
                                  {notification.metadata.amount && (
                                    <div className="flex items-center space-x-2">
                                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                                      <span>金額: ¥{notification.metadata.amount.toLocaleString()}</span>
                                    </div>
                                  )}
                                  {notification.metadata.deadline && (
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      <span>期限: {new Date(notification.metadata.deadline).toLocaleDateString('ja-JP')}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              
                              <div className="flex items-center space-x-2">
                                {!notification.isRead && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    既読
                                  </Button>
                                )}
                                {notification.actionUrl && (
                                  <Button variant="outline" size="sm">
                                    詳細
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 通知設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>通知設定</span>
          </CardTitle>
          <CardDescription>
            通知の受信方法と種類をカスタマイズできます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 受信方法 */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">受信方法</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium">メール通知</div>
                  <div className="text-sm text-muted-foreground">重要な通知をメールで受信</div>
                </div>
                <Switch
                  checked={settings.email}
                  onCheckedChange={(checked) => handleSettingChange('email', checked)}
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium">プッシュ通知</div>
                  <div className="text-sm text-muted-foreground">アプリ内でプッシュ通知</div>
                </div>
                <Switch
                  checked={settings.push}
                  onCheckedChange={(checked) => handleSettingChange('push', checked)}
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <div className="font-medium">SMS通知</div>
                  <div className="text-sm text-muted-foreground">緊急時のみSMSで通知</div>
                </div>
                <Switch
                  checked={settings.sms}
                  onCheckedChange={(checked) => handleSettingChange('sms', checked)}
                />
              </div>
            </div>
          </div>

          {/* 通知種類 */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">通知種類</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium">シフト関連</div>
                  <div className="text-sm text-muted-foreground">シフト確定・変更・希望提出期限</div>
                </div>
                <Switch
                  checked={settings.shiftNotifications}
                  onCheckedChange={(checked) => handleSettingChange('shiftNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium">勤怠関連</div>
                  <div className="text-sm text-muted-foreground">勤怠異常・打刻リマインダー</div>
                </div>
                <Switch
                  checked={settings.attendanceAlerts}
                  onCheckedChange={(checked) => handleSettingChange('attendanceAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <div className="font-medium">給与関連</div>
                  <div className="text-sm text-muted-foreground">給与明細・支給日のお知らせ</div>
                </div>
                <Switch
                  checked={settings.payrollNotifications}
                  onCheckedChange={(checked) => handleSettingChange('payrollNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Info className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium">システム関連</div>
                  <div className="text-sm text-muted-foreground">メンテナンス・アップデート</div>
                </div>
                <Switch
                  checked={settings.systemNotifications}
                  onCheckedChange={(checked) => handleSettingChange('systemNotifications', checked)}
                />
              </div>
            </div>
          </div>

          {/* 静寂時間 */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">静寂時間</h3>
            <div className="flex items-center space-x-4">
              <Switch
                checked={settings.quietHours.enabled}
                onCheckedChange={(checked) => handleSettingChange('quietHours.enabled', checked)}
              />
              <span className="text-sm text-muted-foreground">
                指定した時間帯は通知を送信しない
              </span>
            </div>
            
            {settings.quietHours.enabled && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">開始:</span>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => handleSettingChange('quietHours.start', e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">終了:</span>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => handleSettingChange('quietHours.end', e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

