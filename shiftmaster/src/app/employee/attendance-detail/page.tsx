'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Download,
  Filter,
  Search
} from 'lucide-react'

interface AttendanceRecord {
  id: string
  date: string
  clockIn: string
  clockOut?: string
  breakStart?: string
  breakEnd?: string
  totalWorkHours: number
  totalBreakMinutes: number
  overtimeHours: number
  status: 'present' | 'absent' | 'late' | 'early_leave' | 'half_day'
  location: {
    latitude: number
    longitude: number
    address: string
  }
  notes?: string
  adminComment?: string
}

interface PayrollSummary {
  period: string
  totalWorkDays: number
  totalWorkHours: number
  totalOvertimeHours: number
  totalBreakMinutes: number
  hourlyRate: number
  overtimeRate: number
  baseSalary: number
  overtimePay: number
  totalSalary: number
  deductions: number
  netSalary: number
}

export default function AttendanceDetailPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary | null>(null)
  const [activeTab, setActiveTab] = useState('daily')
  const [filterMonth, setFilterMonth] = useState(new Date())

  // モックデータ
  useEffect(() => {
    // 28日分の勤怠記録を作成
    const records: AttendanceRecord[] = []
    for (let i = 1; i <= 28; i++) {
      const date = `2025-02-${i.toString().padStart(2, '0')}`
      const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6
      const isPresent = Math.random() > 0.1 && !isWeekend
      
      if (isPresent) {
        const clockInHour = Math.random() > 0.8 ? 8 : 9
        const clockOutHour = Math.random() > 0.7 ? 18 : 17
        const workHours = clockOutHour - clockInHour
        const overtimeHours = Math.max(0, workHours - 8)
        
        records.push({
          id: `att-${i}`,
          date,
          clockIn: `${clockInHour.toString().padStart(2, '0')}:00`,
          clockOut: `${clockOutHour.toString().padStart(2, '0')}:00`,
          breakStart: '12:00',
          breakEnd: '13:00',
          totalWorkHours: workHours,
          totalBreakMinutes: 60,
          overtimeHours,
          status: clockInHour > 9 ? 'late' : 'present',
          location: {
            latitude: 35.658034 + (Math.random() - 0.5) * 0.001,
            longitude: 139.701636 + (Math.random() - 0.5) * 0.001,
            address: '東京都渋谷区渋谷1-1-1'
          },
          notes: Math.random() > 0.8 ? '体調不良のため早退' : undefined
        })
      } else if (isWeekend) {
        records.push({
          id: `att-${i}`,
          date,
          clockIn: '',
          totalWorkHours: 0,
          totalBreakMinutes: 0,
          overtimeHours: 0,
          status: 'absent',
          location: {
            latitude: 0,
            longitude: 0,
            address: ''
          }
        })
      } else {
        records.push({
          id: `att-${i}`,
          date,
          clockIn: '',
          totalWorkHours: 0,
          totalBreakMinutes: 0,
          overtimeHours: 0,
          status: 'absent',
          location: {
            latitude: 0,
            longitude: 0,
            address: ''
          }
        })
      }
    }
    setAttendanceRecords(records)

    // 給与サマリー
    setPayrollSummary({
      period: '2025年2月',
      totalWorkDays: records.filter(r => r.status !== 'absent').length,
      totalWorkHours: records.reduce((sum, r) => sum + r.totalWorkHours, 0),
      totalOvertimeHours: records.reduce((sum, r) => sum + r.overtimeHours, 0),
      totalBreakMinutes: records.reduce((sum, r) => sum + r.totalBreakMinutes, 0),
      hourlyRate: 1200,
      overtimeRate: 1800,
      baseSalary: 0,
      overtimePay: 0,
      totalSalary: 0,
      deductions: 0,
      netSalary: 0
    })
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-100 text-green-800">出勤</Badge>
      case 'absent':
        return <Badge variant="secondary">欠勤</Badge>
      case 'late':
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800">遅刻</Badge>
      case 'early_leave':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">早退</Badge>
      case 'half_day':
        return <Badge variant="outline">半休</Badge>
      default:
        return <Badge variant="outline">未設定</Badge>
    }
  }

  const getAttendanceForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return attendanceRecords.find(record => record.date === dateStr)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setActiveTab('daily')
    }
  }

  const calculatePayroll = () => {
    if (!payrollSummary) return null

    const baseSalary = payrollSummary.totalWorkHours * payrollSummary.hourlyRate
    const overtimePay = payrollSummary.totalOvertimeHours * payrollSummary.overtimeRate
    const totalSalary = baseSalary + overtimePay
    const deductions = totalSalary * 0.1 // 10%の控除（税金・保険料等）
    const netSalary = totalSalary - deductions

    return {
      ...payrollSummary,
      baseSalary,
      overtimePay,
      totalSalary,
      deductions,
      netSalary
    }
  }

  const currentPayroll = calculatePayroll()

  const getCalendarModifiers = () => {
    return {
      present: (date: Date) => {
        const record = getAttendanceForDate(date)
        return record && record.status === 'present'
      },
      late: (date: Date) => {
        const record = getAttendanceForDate(date)
        return record && record.status === 'late'
      },
      absent: (date: Date) => {
        const record = getAttendanceForDate(date)
        return record && record.status === 'absent'
      },
      weekend: (date: Date) => {
        return date.getDay() === 0 || date.getDay() === 6
      }
    }
  }

  const getCalendarModifierStyles = () => {
    return {
      present: { backgroundColor: '#dbeafe', color: '#1e40af' },
      late: { backgroundColor: '#fef3c7', color: '#92400e' },
      absent: { backgroundColor: '#fee2e2', color: '#991b1b' },
      weekend: { backgroundColor: '#f3f4f6', color: '#6b7280' }
    }
  }

  const handleExportCSV = () => {
    // CSVエクスポート機能
    toast.success('CSVファイルをダウンロードしました')
  }

  const handleFilterChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(filterMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setFilterMonth(newMonth)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">勤怠記録詳細</h1>
          <p className="text-muted-foreground">日別の勤怠状況と給与計算を確認できます</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV出力
          </Button>
        </div>
      </div>

      {/* 月次フィルター */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>期間選択</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('prev')}
              >
                ←
              </Button>
              <span className="text-lg font-semibold">
                {filterMonth.getFullYear()}年{filterMonth.getMonth() + 1}月
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('next')}
              >
                →
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={filterMonth}
            className="w-full"
            modifiers={getCalendarModifiers()}
            modifiersStyles={getCalendarModifierStyles()}
          />
          
          {/* 凡例 */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span className="text-sm">出勤</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-200 rounded"></div>
              <span className="text-sm">遅刻</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span className="text-sm">欠勤</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-sm">休日</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>日別詳細</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>月次サマリー</span>
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>給与計算</span>
          </TabsTrigger>
        </TabsList>

        {/* 日別詳細タブ */}
        <TabsContent value="daily" className="space-y-6">
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
                  この日の詳細な勤怠記録
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const record = getAttendanceForDate(selectedDate)
                  
                  if (!record) {
                    return (
                      <div className="text-center py-8 text-muted-foreground">
                        この日の勤怠記録はありません
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-6">
                      {/* 基本情報 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-medium text-lg">勤怠状況</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span>ステータス:</span>
                              {getStatusBadge(record.status)}
                            </div>
                            {record.clockIn && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span>出勤時間:</span>
                                  <span className="font-medium">{record.clockIn}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>退勤時間:</span>
                                  <span className="font-medium">{record.clockOut || '未退勤'}</span>
                                </div>
                              </>
                            )}
                            {record.breakStart && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span>休憩開始:</span>
                                  <span>{record.breakStart}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>休憩終了:</span>
                                  <span>{record.breakEnd || '未終了'}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium text-lg">時間計算</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span>総勤務時間:</span>
                              <span className="font-medium">{record.totalWorkHours}時間</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>休憩時間:</span>
                              <span>{record.totalBreakMinutes}分</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>残業時間:</span>
                              <span className="font-medium text-orange-600">
                                {record.overtimeHours}時間
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>実働時間:</span>
                              <span className="font-medium text-blue-600">
                                {record.totalWorkHours - (record.totalBreakMinutes / 60)}時間
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 位置情報 */}
                      {record.location.latitude !== 0 && (
                        <div className="space-y-4">
                          <h3 className="font-medium text-lg flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <span>打刻位置情報</span>
                          </h3>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">緯度:</span>
                                <span className="ml-2 font-mono">{record.location.latitude}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">経度:</span>
                                <span className="ml-2 font-mono">{record.location.longitude}</span>
                              </div>
                              <div className="md:col-span-2">
                                <span className="text-muted-foreground">住所:</span>
                                <span className="ml-2">{record.location.address}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* メモ・コメント */}
                      {(record.notes || record.adminComment) && (
                        <div className="space-y-4">
                          <h3 className="font-medium text-lg">メモ・コメント</h3>
                          <div className="space-y-3">
                            {record.notes && (
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Info className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium text-blue-800">従業員メモ</span>
                                </div>
                                <p className="text-blue-700">{record.notes}</p>
                              </div>
                            )}
                            {record.adminComment && (
                              <div className="p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                  <span className="font-medium text-yellow-800">管理者コメント</span>
                                </div>
                                <p className="text-yellow-700">{record.adminComment}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  カレンダーから日付を選択して勤怠詳細を確認してください
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 月次サマリータブ */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  総出勤日数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceRecords.filter(r => r.status !== 'absent').length}日
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  総勤務時間
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceRecords.reduce((sum, r) => sum + r.totalWorkHours, 0)}時間
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  総残業時間
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {attendanceRecords.reduce((sum, r) => sum + r.overtimeHours, 0)}時間
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  平均勤務時間
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {(attendanceRecords.reduce((sum, r) => sum + r.totalWorkHours, 0) / 
                    Math.max(1, attendanceRecords.filter(r => r.status !== 'absent').length)).toFixed(1)}時間
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 日別サマリーテーブル */}
          <Card>
            <CardHeader>
              <CardTitle>日別勤怠サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">日付</th>
                      <th className="text-left p-2">ステータス</th>
                      <th className="text-left p-2">勤務時間</th>
                      <th className="text-left p-2">残業時間</th>
                      <th className="text-left p-2">休憩時間</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{record.date}</td>
                        <td className="p-2">{getStatusBadge(record.status)}</td>
                        <td className="p-2">{record.totalWorkHours}時間</td>
                        <td className="p-2">{record.overtimeHours}時間</td>
                        <td className="p-2">{record.totalBreakMinutes}分</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 給与計算タブ */}
        <TabsContent value="payroll" className="space-y-6">
          {currentPayroll ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 給与計算詳細 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>給与計算詳細</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>基本給（{currentPayroll.hourlyRate}円/時）:</span>
                      <span className="font-medium">
                        ¥{currentPayroll.baseSalary.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>残業手当（{currentPayroll.overtimeRate}円/時）:</span>
                      <span className="font-medium text-orange-600">
                        ¥{currentPayroll.overtimePay.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between font-bold">
                        <span>総支給額:</span>
                        <span className="text-lg">
                          ¥{currentPayroll.totalSalary.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-red-600">
                      <span>控除額（10%）:</span>
                      <span>-¥{currentPayroll.deductions.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between font-bold text-green-600">
                        <span>手取り額:</span>
                        <span className="text-xl">
                          ¥{currentPayroll.netSalary.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 勤務実績 */}
              <Card>
                <CardHeader>
                  <CardTitle>勤務実績サマリー</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>勤務日数:</span>
                      <span className="font-medium">{currentPayroll.totalWorkDays}日</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>総勤務時間:</span>
                      <span className="font-medium">{currentPayroll.totalWorkHours}時間</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>総残業時間:</span>
                      <span className="font-medium text-orange-600">
                        {currentPayroll.totalOvertimeHours}時間
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>総休憩時間:</span>
                      <span>{currentPayroll.totalBreakMinutes}分</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>平均勤務時間:</span>
                      <span className="font-medium text-blue-600">
                        {(currentPayroll.totalWorkHours / Math.max(1, currentPayroll.totalWorkDays)).toFixed(1)}時間
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  給与計算データを読み込み中...
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

