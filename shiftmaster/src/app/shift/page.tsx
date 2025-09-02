'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ShiftPreference {
  date: string
  available: boolean
  preferred_start?: string
  preferred_end?: string
  priority: 'high' | 'medium' | 'low'
  reason?: string
}

interface ShiftRequest {
  id: string
  month: string
  preferences: ShiftPreference[]
  status: 'draft' | 'submitted'
  submitted_at?: string
  updated_at: string
}

export default function ShiftRequestPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [shiftRequest, setShiftRequest] = useState<ShiftRequest | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('calendar')
  const [isSaving, setIsSaving] = useState(false)
  const [submissionDeadline, setSubmissionDeadline] = useState<Date | null>(null)

  // モックデータ
  useEffect(() => {
    const deadline = new Date()
    deadline.setDate(25) // 前月25日締切
    deadline.setMonth(deadline.getMonth() - 1)
    setSubmissionDeadline(deadline)

    // モックのシフト希望データ
    const mockRequest: ShiftRequest = {
      id: '1',
      month: '2025-02',
      preferences: [],
      status: 'draft',
      updated_at: new Date().toISOString()
    }
    setShiftRequest(mockRequest)
  }, [])

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    
    // 前月の日付を追加
    const firstDayOfWeek = firstDay.getDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }
    
    // 当月の日付を追加
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i)
      days.push({ date: currentDate, isCurrentMonth: true })
    }
    
    // 翌月の日付を追加
    const lastDayOfWeek = lastDay.getDay()
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({ date: nextDate, isCurrentMonth: false })
    }
    
    return days
  }

  const getSubmissionRate = () => {
    if (!shiftRequest) return 0
    const totalDays = getMonthDays(currentMonth).filter(day => day.isCurrentMonth).length
    const submittedDays = shiftRequest.preferences.length
    return Math.round((submittedDays / totalDays) * 100)
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
    setSelectedDates([])
  }

  const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return
    
    const dateString = date.toISOString().split('T')[0]
    setSelectedDates(prev => {
      if (prev.includes(dateString)) {
        return prev.filter(d => d !== dateString)
      } else {
        return [...prev, dateString]
      }
    })
  }

  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    const dates = []
    const current = new Date(startDate)
    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }
    setSelectedDates(dates)
  }

  const handleQuickSetting = (setting: 'morning' | 'day' | 'evening' | 'full') => {
    if (selectedDates.length === 0) {
      toast.error('日付を選択してください')
      return
    }

    const timeSettings = {
      morning: { start: '06:00', end: '14:00' },
      day: { start: '09:00', end: '17:00' },
      evening: { start: '14:00', end: '22:00' },
      full: { start: '09:00', end: '18:00' }
    }

    const newPreferences: ShiftPreference[] = selectedDates.map(date => ({
      date,
      available: true,
      preferred_start: timeSettings[setting].start,
      preferred_end: timeSettings[setting].end,
      priority: 'medium'
    }))

    setShiftRequest(prev => prev ? {
      ...prev,
      preferences: [...prev.preferences.filter(p => !selectedDates.includes(p.date)), ...newPreferences],
      updated_at: new Date().toISOString()
    } : null)

    toast.success(`${selectedDates.length}日分の設定を適用しました`)
    setSelectedDates([])
  }

  const handleEditPreference = (date: string) => {
    setEditModalOpen(true)
  }

  const handleSavePreference = (preference: ShiftPreference) => {
    setShiftRequest(prev => prev ? {
      ...prev,
      preferences: prev.preferences.map(p => 
        p.date === preference.date ? preference : p
      ),
      updated_at: new Date().toISOString()
    } : null)

    setEditModalOpen(false)
    toast.success('希望を保存しました')
  }

  const handleDeletePreference = (date: string) => {
    setShiftRequest(prev => prev ? {
      ...prev,
      preferences: prev.preferences.filter(p => p.date !== date),
      updated_at: new Date().toISOString()
    } : null)

    toast.success('希望を削除しました')
  }

  const handleSubmit = async () => {
    if (!shiftRequest || shiftRequest.preferences.length === 0) {
      toast.error('シフト希望を入力してください')
      return
    }

    setIsSaving(true)
    
    try {
      // 提出処理のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setShiftRequest(prev => prev ? {
        ...prev,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      } : null)
      
      toast.success('シフト希望を提出しました！')
    } catch (error) {
      toast.error('提出に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const getPreferenceForDate = (date: Date) => {
    if (!shiftRequest) return null
    const dateString = date.toISOString().split('T')[0]
    return shiftRequest.preferences.find(p => p.date === dateString)
  }

  const isDeadlinePassed = () => {
    if (!submissionDeadline) return false
    return new Date() > submissionDeadline
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric'
    })
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">シフト希望提出</h1>
          <p className="text-gray-600">来月の勤務可能日時を入力してください</p>
            </div>
            <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">提出締切</div>
            <div className="font-medium">
              {submissionDeadline ? formatDate(submissionDeadline) : '設定中...'}
            </div>
          </div>
              <Button
                onClick={handleSubmit}
            disabled={isSaving || isDeadlinePassed() || shiftRequest?.status === 'submitted'}
            className="bg-orange-600 hover:bg-orange-700"
              >
            {isSaving ? '提出中...' : '提出'}
              </Button>
            </div>
          </div>

      {/* 進捗バー */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium">提出進捗</div>
            <div className="text-2xl font-bold text-blue-600">{getSubmissionRate()}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getSubmissionRate()}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {shiftRequest?.status === 'submitted' ? '提出済み' : '下書き保存中'}
        </div>
        </CardContent>
      </Card>

          {/* 月選択 */}
      <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
              onClick={() => handleMonthChange('prev')}
                >
              ← 前月
                </Button>
            <div className="text-xl font-bold">
              {formatMonth(currentMonth)}
            </div>
                <Button
                  variant="outline"
              onClick={() => handleMonthChange('next')}
                >
              翌月 →
                </Button>
              </div>
            </CardContent>
          </Card>

      {/* ビュータブ */}
                      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as 'calendar' | 'list')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">カレンダー</TabsTrigger>
          <TabsTrigger value="list">リスト</TabsTrigger>
        </TabsList>

        {/* カレンダービュー */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>カレンダー</CardTitle>
              <CardDescription>日付をクリックして希望を設定できます</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                  <div key={day} className="p-2 text-center font-medium text-gray-600">
                    {day}
                  </div>
                ))}
                
                {getMonthDays(currentMonth).map(({ date, isCurrentMonth }, index) => {
                  const preference = getPreferenceForDate(date)
                  const isSelected = selectedDates.includes(date.toISOString().split('T')[0])
                  const isToday = date.toDateString() === new Date().toDateString()
                  
                  return (
                    <div
                      key={index}
                      className={`
                        p-2 text-center border cursor-pointer transition-colors
                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-100 text-gray-400'}
                        ${isSelected ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'}
                        ${isToday ? 'ring-2 ring-blue-500' : ''}
                      `}
                      onClick={() => handleDateClick(date, isCurrentMonth)}
                    >
                      <div className="text-sm font-medium">
                        {date.getDate()}
                      </div>
                      {preference && (
                        <div className="text-xs mt-1">
                          {preference.available ? (
                            <Badge variant="default" className="text-xs">
                              {preference.preferred_start}-{preference.preferred_end}
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              NG
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* リストビュー */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>希望一覧</CardTitle>
              <CardDescription>設定済みの希望を一覧で確認できます</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shiftRequest?.preferences
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(preference => (
                    <div key={preference.date} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium">
                          {new Date(preference.date).toLocaleDateString('ja-JP', {
                            month: 'numeric',
                            day: 'numeric',
                            weekday: 'short'
                          })}
                        </div>
                        {preference.available ? (
                          <Badge variant="default">
                            {preference.preferred_start}-{preference.preferred_end}
                          </Badge>
                        ) : (
                          <Badge variant="destructive">NG</Badge>
                        )}
                        <Badge variant="outline">
                          {preference.priority === 'high' ? '高' : 
                           preference.priority === 'medium' ? '中' : '低'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPreference(preference.date)}
                        >
                          編集
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePreference(preference.date)}
                        >
                          削除
                        </Button>
                      </div>
                  </div>
                ))}
                
                {(!shiftRequest || shiftRequest.preferences.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    まだシフト希望が設定されていません
              </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 一括編集パネル */}
      {selectedDates.length > 0 && (
        <Card className="sticky bottom-6">
              <CardHeader>
            <CardTitle>一括編集</CardTitle>
                <CardDescription>
              選択日: {selectedDates.length}日間
                </CardDescription>
              </CardHeader>
              <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleQuickSetting('morning')}
                >
                  早番
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleQuickSetting('day')}
                >
                  日勤
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleQuickSetting('evening')}
                >
                  遅番
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleQuickSetting('full')}
                >
                  終日可
                </Button>
                </div>
                
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const newPreferences: ShiftPreference[] = selectedDates.map(date => ({
                      date,
                      available: false,
                      priority: 'medium'
                    }))
                    
                    setShiftRequest(prev => prev ? {
                      ...prev,
                      preferences: [...prev.preferences.filter(p => !selectedDates.includes(p.date)), ...newPreferences],
                      updated_at: new Date().toISOString()
                    } : null)
                    
                    setSelectedDates([])
                    toast.success(`${selectedDates.length}日分をNGに設定しました`)
                  }}
                >
                  すべてNG
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setSelectedDates([])}
                >
                  選択解除
                </Button>
              </div>
                </div>
              </CardContent>
            </Card>
          )}

      {/* 編集モーダル */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>シフト希望編集</DialogTitle>
            <DialogDescription>
              勤務希望を詳細に設定できます
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>勤務可否</Label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="available"
                    value="true"
                    defaultChecked={true}
                    className="text-blue-600"
                  />
                  <span>勤務可能</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="available"
                    value="false"
                    className="text-red-600"
                  />
                  <span>勤務不可</span>
                </label>
                  </div>
                </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>希望開始時刻</Label>
                <Input type="time" defaultValue="09:00" />
                  </div>
              <div className="space-y-2">
                <Label>希望終了時刻</Label>
                <Input type="time" defaultValue="17:00" />
                </div>
                  </div>
            
            <div className="space-y-2">
              <Label>優先度</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
                </div>
            
            <div className="space-y-2">
              <Label>備考</Label>
              <Textarea placeholder="特記事項があれば入力してください" />
                </div>
              </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={() => {
              // モーダルの値を取得して保存
              const formData = new FormData(document.querySelector('form') || document.createElement('form'))
              const available = formData.get('available') === 'true'
              
              const preference: ShiftPreference = {
                date: selectedDates[0], // 単一編集の場合
                available,
                preferred_start: '09:00', // 実際はフォームから取得
                preferred_end: '17:00',
                priority: 'medium'
              }
              
              handleSavePreference(preference)
            }}>
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 締切警告 */}
      {isDeadlinePassed() && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">提出締切が過ぎています</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              管理者に連絡して提出期間の延長を依頼してください
            </p>
            </CardContent>
          </Card>
      )}
    </div>
  )
}


