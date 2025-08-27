'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Save, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Info,
  User,
  MapPin,
  Star
} from 'lucide-react'

interface ShiftPreference {
  id: string
  date: string
  available: boolean
  preferredStartTime?: string
  preferredEndTime?: string
  priority: 'high' | 'medium' | 'low'
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  adminComment?: string
}

interface ShiftPeriod {
  id: string
  name: string
  startDate: string
  endDate: string
  submissionDeadline: string
  status: 'collecting' | 'generating' | 'published' | 'finalized'
}

export default function ShiftPreferencesPage() {
  const [currentPeriod, setCurrentPeriod] = useState<ShiftPeriod | null>(null)
  const [preferences, setPreferences] = useState<ShiftPreference[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('calendar')

  // モックデータ
  useEffect(() => {
    setCurrentPeriod({
      id: '1',
      name: '2025年2月',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      submissionDeadline: '2025-01-25T23:59:59Z',
      status: 'collecting'
    })

    // 28日分の初期データを作成
    const initialPreferences: ShiftPreference[] = []
    for (let i = 1; i <= 28; i++) {
      const date = `2025-02-${i.toString().padStart(2, '0')}`
      initialPreferences.push({
        id: `pref-${i}`,
        date,
        available: Math.random() > 0.3,
        preferredStartTime: Math.random() > 0.5 ? '09:00' : '10:00',
        preferredEndTime: Math.random() > 0.5 ? '17:00' : '18:00',
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
        reason: Math.random() > 0.8 ? '希望時間あり' : undefined,
        status: 'pending'
      })
    }
    setPreferences(initialPreferences)
  }, [])

  const handlePreferenceChange = (date: string, field: string, value: string | number | boolean) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.date === date 
          ? { ...pref, [field]: value }
          : pref
      )
    )
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setActiveTab('detail')
    }
  }

  const getPreferenceForDate = (date: string) => {
    return preferences.find(pref => pref.date === date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">承認済み</Badge>
      case 'rejected':
        return <Badge variant="destructive">却下</Badge>
      default:
        return <Badge variant="secondary">未承認</Badge>
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

  const handleSubmitPreferences = async () => {
    setIsSubmitting(true)
    try {
      // 実際の実装ではAPI呼び出し
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('シフト希望を提出しました！')
    } catch (error) {
      toast.error('提出に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      // 下書き保存
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('下書きを保存しました')
    } catch (error) {
      toast.error('保存に失敗しました')
    }
  }

  const isDeadlinePassed = () => {
    if (!currentPeriod) return false
    return new Date() > new Date(currentPeriod.submissionDeadline)
  }

  const getDaysInPeriod = () => {
    if (!currentPeriod) return []
    const days: Date[] = []
    const start = new Date(currentPeriod.startDate)
    const end = new Date(currentPeriod.endDate)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d))
    }
    return days
  }

  const getSubmissionStatus = () => {
    if (!currentPeriod) return 'loading'
    if (isDeadlinePassed()) return 'deadline_passed'
    if (currentPeriod.status === 'finalized') return 'finalized'
    return 'open'
  }

  const submissionStatus = getSubmissionStatus()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">シフト希望提出</h1>
          <p className="text-muted-foreground">希望する勤務時間と日を設定してください</p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">佐藤太郎さん</span>
        </div>
      </div>

      {/* 期間情報 */}
      {currentPeriod && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{currentPeriod.name}</span>
            </CardTitle>
            <CardDescription>
              シフト希望の提出期間と現在の状況
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {new Date(currentPeriod.startDate).getDate()}日
                </div>
                <div className="text-sm text-blue-600">開始日</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {new Date(currentPeriod.endDate).getDate()}日
                </div>
                <div className="text-sm text-green-600">終了日</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {new Date(currentPeriod.submissionDeadline).getDate()}日
                </div>
                <div className="text-sm text-orange-600">提出期限</div>
              </div>
            </div>

            {/* 提出状況 */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">提出状況</span>
                </div>
                {submissionStatus === 'deadline_passed' && (
                  <Badge variant="destructive">提出期限終了</Badge>
                )}
                {submissionStatus === 'finalized' && (
                  <Badge variant="default" className="bg-green-100 text-green-800">シフト確定済み</Badge>
                )}
                {submissionStatus === 'open' && (
                  <Badge variant="default" className="bg-blue-100 text-blue-800">提出受付中</Badge>
                )}
              </div>
              
              {submissionStatus === 'deadline_passed' && (
                <p className="text-sm text-red-600 mt-2">
                  提出期限が終了しました。次回の期間をお待ちください。
                </p>
              )}
              
              {submissionStatus === 'finalized' && (
                <p className="text-sm text-green-600 mt-2">
                  シフトが確定しました。確定されたシフトは変更できません。
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>カレンダー</span>
          </TabsTrigger>
          <TabsTrigger value="detail" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>詳細設定</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>提出状況</span>
          </TabsTrigger>
        </TabsList>

        {/* カレンダータブ */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>カレンダー表示</CardTitle>
              <CardDescription>
                日付をクリックしてシフト希望を設定してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={new Date(currentPeriod?.startDate || '2025-02-01')}
                className="w-full"
                modifiers={{
                  hasPreference: (date) => {
                    const dateStr = date.toISOString().split('T')[0]
                    const pref = getPreferenceForDate(dateStr)
                    return pref && pref.available
                  },
                  highPriority: (date) => {
                    const dateStr = date.toISOString().split('T')[0]
                    const pref = getPreferenceForDate(dateStr)
                    return pref && pref.priority === 'high'
                  }
                }}
                modifiersStyles={{
                  hasPreference: { backgroundColor: '#dbeafe', color: '#1e40af' },
                  highPriority: { backgroundColor: '#fef3c7', color: '#92400e' }
                }}
              />
            </CardContent>
          </Card>

          {/* 凡例 */}
          <Card>
            <CardHeader>
              <CardTitle>凡例</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-200 rounded"></div>
                  <span className="text-sm">希望提出済み</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                  <span className="text-sm">高優先度</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span className="text-sm">未設定</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 詳細設定タブ */}
        <TabsContent value="detail" className="space-y-6">
          {selectedDate ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>
                    {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
                  </span>
                </CardTitle>
                <CardDescription>
                  この日のシフト希望を詳細に設定してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const dateStr = selectedDate.toISOString().split('T')[0]
                  const preference = getPreferenceForDate(dateStr)
                  
                  if (!preference) return null

                  return (
                    <>
                      {/* 勤務可能設定 */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Label className="font-medium">勤務可能</Label>
                          <Select
                            value={preference.available ? 'available' : 'unavailable'}
                            onValueChange={(value) => 
                              handlePreferenceChange(dateStr, 'available', value === 'available')
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">可能</SelectItem>
                              <SelectItem value="unavailable">不可</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {preference.available && (
                          <>
                            {/* 希望時間 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="start-time">希望開始時間</Label>
                                <Input
                                  id="start-time"
                                  type="time"
                                  value={preference.preferredStartTime || ''}
                                  onChange={(e) => 
                                    handlePreferenceChange(dateStr, 'preferredStartTime', e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="end-time">希望終了時間</Label>
                                <Input
                                  id="end-time"
                                  type="time"
                                  value={preference.preferredEndTime || ''}
                                  onChange={(e) => 
                                    handlePreferenceChange(dateStr, 'preferredEndTime', e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            {/* 優先度 */}
                            <div>
                              <Label htmlFor="priority">優先度</Label>
                              <Select
                                value={preference.priority}
                                onValueChange={(value: 'high' | 'medium' | 'low') => 
                                  handlePreferenceChange(dateStr, 'priority', value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">
                                    <div className="flex items-center space-x-2">
                                      <Star className="h-4 w-4 text-red-500 fill-current" />
                                      <span>高（強く希望）</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="medium">
                                    <div className="flex items-center space-x-2">
                                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                      <span>中（希望）</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="low">
                                    <div className="flex items-center space-x-2">
                                      <Star className="h-4 w-4 text-gray-400" />
                                      <span>低（可能）</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* 理由 */}
                            <div>
                              <Label htmlFor="reason">希望理由（任意）</Label>
                              <Textarea
                                id="reason"
                                value={preference.reason || ''}
                                onChange={(e) => 
                                  handlePreferenceChange(dateStr, 'reason', e.target.value)
                                }
                                placeholder="希望する理由があれば入力してください"
                                rows={3}
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {/* 現在の設定状況 */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">現在の設定</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>勤務可能:</span>
                            <Badge variant={preference.available ? "default" : "secondary"}>
                              {preference.available ? '可能' : '不可'}
                            </Badge>
                          </div>
                          {preference.available && (
                            <>
                              <div className="flex items-center justify-between">
                                <span>希望時間:</span>
                                <span>
                                  {preference.preferredStartTime} - {preference.preferredEndTime}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>優先度:</span>
                                {getPriorityBadge(preference.priority)}
                              </div>
                              <div className="flex items-center justify-between">
                                <span>承認状況:</span>
                                {getStatusBadge(preference.status)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  カレンダーから日付を選択してシフト希望を設定してください
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 提出状況タブ */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>提出状況サマリー</span>
              </CardTitle>
              <CardDescription>
                全期間のシフト希望提出状況を確認できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {preferences.filter(p => p.available).length}
                    </div>
                    <div className="text-sm text-blue-600">勤務可能日</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {preferences.filter(p => p.priority === 'high').length}
                    </div>
                    <div className="text-sm text-green-600">高優先度</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {preferences.filter(p => p.status === 'approved').length}
                    </div>
                    <div className="text-sm text-yellow-600">承認済み</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {preferences.filter(p => p.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-600">未承認</div>
                  </div>
                </div>

                {/* 日別詳細 */}
                <div className="space-y-2">
                  <h4 className="font-medium">日別詳細</h4>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {preferences.map((pref) => (
                      <div
                        key={pref.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{pref.date}</span>
                          {getPriorityBadge(pref.priority)}
                          {getStatusBadge(pref.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {pref.available ? (
                            <span>
                              {pref.preferredStartTime} - {pref.preferredEndTime}
                            </span>
                          ) : (
                            <span>勤務不可</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* アクションボタン */}
      {submissionStatus === 'open' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-orange-600">
                  提出期限: {currentPeriod?.submissionDeadline ? 
                    new Date(currentPeriod.submissionDeadline).toLocaleDateString('ja-JP') : ''
                  }
                </span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4 mr-2" />
                  下書き保存
                </Button>
                <Button 
                  onClick={handleSubmitPreferences} 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? '提出中...' : 'シフト希望を提出'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
