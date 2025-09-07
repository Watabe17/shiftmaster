'use client'

import React, { useState, useEffect } from 'react'
import {
  Bell, Check, X, Trash2, RefreshCw, AlertCircle, Info, Clock,
  CheckCircle, AlertTriangle, Star, Filter, Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

// 通知の型定義
interface Notification {
  id: string
  userId: string
  storeId: string
  type: 'SHIFT_REQUEST' | 'SHIFT_APPROVAL' | 'SHIFT_REJECTION' | 'ATTENDANCE' | 'GENERAL'
  title: string
  message: string
  data?: Record<string, any>
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  status: 'UNREAD' | 'READ' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
  readAt?: string
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'UNREAD' | 'READ' | 'ARCHIVED'>('all')
  const [selectedType, setSelectedType] = useState<'all' | 'SHIFT_REQUEST' | 'SHIFT_APPROVAL' | 'SHIFT_REJECTION' | 'ATTENDANCE' | 'GENERAL'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 通知一覧を取得
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 現在のユーザーID（後で認証から取得）
      const currentUserId = 'current-user-id'
      
      const response = await fetch(`/api/notifications?userId=${currentUserId}&status=${selectedStatus}&type=${selectedType}`)
      
      if (!response.ok) {
        throw new Error('通知データの取得に失敗しました')
      }
      
      const result = await response.json()
      if (result.success) {
        setNotifications(result.data)
        console.log('✅ 通知データ取得成功:', result.data)
      } else {
        setNotifications([])
        console.log('通知データが空です')
      }
    } catch (error) {
      console.error('通知データ取得エラー:', error)
      setError('通知データの取得に失敗しました')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  // フィルターが変更されたときにデータを再取得
  useEffect(() => {
    fetchNotifications()
  }, [selectedStatus, selectedType])

  // 通知を既読にする
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'READ',
          readAt: new Date().toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error('通知の更新に失敗しました')
      }

      const result = await response.json()
      if (result.success) {
        toast.success('通知を既読にしました')
        // ローカル状態を更新
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, status: 'READ', readAt: new Date().toISOString() }
              : notif
          )
        )
      } else {
        throw new Error(result.error || '通知の更新に失敗しました')
      }

    } catch (error) {
      console.error('通知更新エラー:', error)
      toast.error('通知の更新に失敗しました')
    }
  }

  // 通知をアーカイブする
  const archiveNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'ARCHIVED'
        }),
      })

      if (!response.ok) {
        throw new Error('通知のアーカイブに失敗しました')
      }

      const result = await response.json()
      if (result.success) {
        toast.success('通知をアーカイブしました')
        // ローカル状態を更新
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, status: 'ARCHIVED' }
              : notif
          )
        )
      } else {
        throw new Error(result.error || '通知のアーカイブに失敗しました')
      }

    } catch (error) {
      console.error('通知アーカイブエラー:', error)
      toast.error('通知のアーカイブに失敗しました')
    }
  }

  // 通知を削除する
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('通知の削除に失敗しました')
      }

      const result = await response.json()
      if (result.success) {
        toast.success('通知を削除しました')
        // ローカル状態から削除
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      } else {
        throw new Error(result.error || '通知の削除に失敗しました')
      }

    } catch (error) {
      console.error('通知削除エラー:', error)
      toast.error('通知の削除に失敗しました')
    }
  }

  // 検索フィルター
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  // 通知タイプに応じたアイコンを取得
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SHIFT_REQUEST':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'SHIFT_APPROVAL':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'SHIFT_REJECTION':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'ATTENDANCE':
        return <Info className="w-5 h-5 text-purple-500" />
      case 'GENERAL':
        return <Bell className="w-5 h-5 text-gray-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  // 優先度に応じたバッジの色を取得
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="destructive">緊急</Badge>
      case 'HIGH':
        return <Badge variant="default" className="bg-red-100 text-red-800">高</Badge>
      case 'NORMAL':
        return <Badge variant="default">通常</Badge>
      case 'LOW':
        return <Badge variant="secondary">低</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  // ステータスに応じたバッジの色を取得
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNREAD':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">未読</Badge>
      case 'READ':
        return <Badge variant="secondary">既読</Badge>
      case 'ARCHIVED':
        return <Badge variant="outline">アーカイブ</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bell className="h-6 w-6 mr-2 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">通知</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchNotifications}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                更新
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* フィルター */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>フィルター</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ステータス</label>
                <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="UNREAD">未読</SelectItem>
                    <SelectItem value="READ">既読</SelectItem>
                    <SelectItem value="ARCHIVED">アーカイブ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">タイプ</label>
                <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="SHIFT_REQUEST">シフト申請</SelectItem>
                    <SelectItem value="SHIFT_APPROVAL">シフト承認</SelectItem>
                    <SelectItem value="SHIFT_REJECTION">シフト却下</SelectItem>
                    <SelectItem value="ATTENDANCE">勤怠</SelectItem>
                    <SelectItem value="GENERAL">一般</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">検索</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="タイトルやメッセージで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 通知一覧 */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-gray-400" />
                  <p className="mt-2 text-gray-500">読み込み中...</p>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-red-500">
                  <AlertCircle className="w-8 h-8 mx-auto" />
                  <p className="mt-2">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto" />
                  <p className="mt-2">通知がありません</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`hover:shadow-md transition-shadow ${
                  notification.status === 'UNREAD' ? 'border-blue-200 bg-blue-50' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* 通知アイコン */}
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* 通知内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {getPriorityBadge(notification.priority)}
                          {getStatusBadge(notification.status)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {notification.status === 'UNREAD' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              既読
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => archiveNotification(notification.id)}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            アーカイブ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            削除
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{notification.message}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {new Date(notification.createdAt).toLocaleString('ja-JP')}
                        </span>
                        {notification.readAt && (
                          <span>
                            既読: {new Date(notification.readAt).toLocaleString('ja-JP')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage





