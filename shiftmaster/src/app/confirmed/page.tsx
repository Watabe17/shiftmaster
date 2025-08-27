'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Download } from 'lucide-react'

// 型定義
interface Shift {
  id: string
  date: string
  startTime: string
  endTime: string
  position: string
  status: 'confirmed' | 'pending' | 'completed'
  breakMinutes: number
  notes?: string
}

interface Employee {
  id: string
  name: string
  employeeCode: string
  position: string
}

export default function ConfirmedShiftPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('calendar')
  const [shifts, setShifts] = useState<Shift[]>([])
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // モックデータ
  useEffect(() => {
    setEmployee({
      id: '1',
      name: '田中太郎',
      employeeCode: 'EMP001',
      position: '店員'
    })

    // 1月のシフトデータ
    const mockShifts: Shift[] = [
      {
        id: '1',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '17:00',
        position: '店員',
        status: 'confirmed',
        breakMinutes: 60,
        notes: 'レジ担当'
      },
      {
        id: '2',
        date: '2024-01-16',
        startTime: '13:00',
        endTime: '21:00',
        position: '店員',
        status: 'confirmed',
        breakMinutes: 60,
        notes: '商品整理'
      },
      {
        id: '3',
        date: '2024-01-17',
        startTime: '09:00',
        endTime: '18:00',
        position: '店員',
        status: 'confirmed',
        breakMinutes: 60
      },
      {
        id: '4',
        date: '2024-01-18',
        startTime: '10:00',
        endTime: '19:00',
        position: '店員',
        status: 'confirmed',
        breakMinutes: 60
      },
      {
        id: '5',
        date: '2024-01-19',
        startTime: '13:00',
        endTime: '22:00',
        position: '店員',
        status: 'confirmed',
        breakMinutes: 60
      },
      {
        id: '6',
        date: '2024-01-20',
        startTime: '09:00',
        endTime: '17:00',
        position: '店員',
        status: 'confirmed',
        breakMinutes: 60
      }
    ]

    setShifts(mockShifts)
  }, [])

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long'
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const formatTime = (time: string) => {
    return time
  }

  const getShiftForDate = (date: string) => {
    return shifts.find(shift => shift.date === date)
  }

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    // 前月の日付を追加
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i)
      days.unshift(prevDate.toISOString().split('T')[0])
    }

    // 当月の日付を追加
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i).toISOString().split('T')[0])
    }

    // 翌月の日付を追加（7の倍数になるまで）
    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i).toISOString().split('T')[0])
      }
    }

    return days
  }

  const getShiftStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getShiftStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '確定'
      case 'pending':
        return '保留'
      case 'completed':
        return '完了'
      default:
        return '不明'
    }
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleExportCSV = () => {
    // CSVエクスポート処理
    const csvContent = shifts.map(shift => {
      return `${shift.date},${shift.startTime},${shift.endTime},${shift.position},${getShiftStatusText(shift.status)}`
    }).join('\n')
    
    const blob = new Blob([`日付,開始時刻,終了時刻,ポジション,ステータス\n${csvContent}`], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shifts_${formatMonth(currentMonth)}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const calculateTotalHours = () => {
    return shifts.reduce((total, shift) => {
      const start = new Date(`2000-01-01T${shift.startTime}`)
      const end = new Date(`2000-01-01T${shift.endTime}`)
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      return total + hours
    }, 0)
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
          <h1 className="text-2xl font-bold">確定シフト確認</h1>
          <p className="text-gray-600">{employee.name}さんの確定シフト</p>
            </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            CSV出力
              </Button>
          <Button onClick={() => window.history.back()} variant="outline">
            戻る
              </Button>
            </div>
          </div>

      {/* 月選択・ビュー切り替え */}
      <Card>
            <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button onClick={handlePreviousMonth} variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
              <h2 className="text-xl font-semibold">{formatMonth(currentMonth)}</h2>
              <Button onClick={handleNextMonth} variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">表示:</span>
              <Select value={selectedView} onValueChange={(value: 'calendar' | 'list') => setSelectedView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calendar">カレンダー</SelectItem>
                  <SelectItem value="list">リスト</SelectItem>
                </SelectContent>
              </Select>
                </div>
              </div>
            </CardContent>
          </Card>

      {/* サマリー情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{shifts.length}</p>
            <p className="text-sm text-gray-600">シフト数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{calculateTotalHours().toFixed(1)}</p>
            <p className="text-sm text-gray-600">総勤務時間</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {shifts.filter(s => s.status === 'confirmed').length}
            </p>
            <p className="text-sm text-gray-600">確定済み</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {shifts.reduce((total, s) => total + s.breakMinutes, 0)}
            </p>
            <p className="text-sm text-gray-600">総休憩時間(分)</p>
          </CardContent>
        </Card>
      </div>

      {/* シフト表示 */}
      {selectedView === 'calendar' ? (
        /* カレンダービュー */
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              カレンダービュー
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {/* 曜日ヘッダー */}
              {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50">
                  {day}
                  </div>
              ))}
              
              {/* 日付とシフト */}
              {getMonthDays(currentMonth).map((date, index) => {
                const shift = getShiftForDate(date)
                const isCurrentMonth = new Date(date).getMonth() === currentMonth.getMonth()
                const isToday = date === new Date().toISOString().split('T')[0]
                
                return (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border border-gray-200 ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(date).getDate()}
                </div>
                    
                    {shift && (
                      <div className="space-y-1">
                        <Badge className={`text-xs ${getShiftStatusColor(shift.status)}`}>
                          {getShiftStatusText(shift.status)}
                        </Badge>
                        <div className="text-xs">
                          <div className="font-medium">{shift.startTime} - {shift.endTime}</div>
                          <div className="text-gray-600">{shift.position}</div>
                  </div>
                </div>
                    )}
                  </div>
                )
              })}
              </div>
            </CardContent>
          </Card>
      ) : (
        /* リストビュー */
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              リストビュー
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
              {shifts.map(shift => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-medium">{formatDate(shift.date)}</p>
                      <p className="text-sm text-gray-600">{shift.date}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {shift.startTime} - {shift.endTime}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{shift.position}</span>
                    </div>
                    
                    {shift.notes && (
                      <div className="text-sm text-gray-600">
                        備考: {shift.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getShiftStatusColor(shift.status)}>
                      {getShiftStatusText(shift.status)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(shift.date)}
                    >
                      詳細
                    </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      )}

      {/* 詳細モーダル */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>シフト詳細</CardTitle>
              <CardDescription>{formatDate(selectedDate)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const shift = getShiftForDate(selectedDate)
                if (!shift) return <p>シフトがありません</p>
                
                return (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">日付:</span>
                      <span className="font-medium">{formatDate(shift.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">時間:</span>
                      <span className="font-medium">{shift.startTime} - {shift.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ポジション:</span>
                      <span className="font-medium">{shift.position}</span>
                      </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">休憩時間:</span>
                      <span className="font-medium">{shift.breakMinutes}分</span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ステータス:</span>
                      <Badge className={getShiftStatusColor(shift.status)}>
                        {getShiftStatusText(shift.status)}
                      </Badge>
                  </div>
                    {shift.notes && (
                      <div className="pt-2 border-t">
                        <span className="text-gray-600">備考:</span>
                        <p className="mt-1">{shift.notes}</p>
                </div>
              )}
                </div>
                )
              })()}
              
              <div className="pt-4 border-t">
                <Button
                  onClick={() => setSelectedDate(null)}
                  className="w-full"
                >
                  閉じる
                </Button>
                </div>
            </CardContent>
          </Card>
            </div>
          )}
    </div>
  )
}


