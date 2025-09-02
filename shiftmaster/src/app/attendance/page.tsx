'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

interface AttendanceRecord {
  id: string
  date: string
  clock_in_time: string
  clock_out_time?: string
  break_minutes: number
  total_work_minutes: number
  status: 'in_progress' | 'completed'
}

interface LocationStatus {
  status: 'getting' | 'ok' | 'out_of_range' | 'error' | 'denied'
  distance?: number
  message: string
}

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [locationStatus, setLocationStatus] = useState<LocationStatus>({
    status: 'getting',
    message: '位置情報を取得中...'
  })
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null)
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false)
  const [isClockOutModalOpen, setIsClockOutModalOpen] = useState(false)
  const [breakMinutes, setBreakMinutes] = useState(60)
  const [customBreakMinutes, setCustomBreakMinutes] = useState(60)
  const [isSimpleMode, setIsSimpleMode] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([])

  // モックの従業員データ
  const employees = [
    { id: '1', name: '佐藤太郎', code: 'E001' },
    { id: '2', name: '鈴木花子', code: 'E002' },
    { id: '3', name: '田中一郎', code: 'E003' }
  ]

  // 現在時刻の更新
  useEffect(() => {
    // 初期時刻を設定
    setCurrentTime(new Date())
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 位置情報の取得
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 店舗の座標（テスト用: 現在位置を店舗座標として設定）
          const userLat = position.coords.latitude
          const userLng = position.coords.longitude
          const storeLat = userLat  // テスト用: 現在位置を店舗座標として使用
          const storeLng = userLng  // テスト用: 現在位置を店舗座標として使用
          
          // 距離計算（テスト用: 常に店舗内）
          const distance = 0 // 距離0 = 店舗内
          
          if (distance <= 50) {
            setLocationStatus({
              status: 'ok',
              distance: Math.round(distance),
              message: `位置情報OK (店舗まで${Math.round(distance)}m)`
            })
          } else {
            setLocationStatus({
              status: 'out_of_range',
              distance: Math.round(distance),
              message: `範囲外 (店舗まで${Math.round(distance)}m)`
            })
          }
        },
        (error) => {
          let message = '位置情報の取得に失敗しました'
          if (error.code === 1) {
            message = '位置情報の許可が必要です'
            setLocationStatus({ status: 'denied', message })
          } else if (error.code === 2) {
            message = '位置情報を取得できませんでした'
            setLocationStatus({ status: 'error', message })
          } else {
            setLocationStatus({ status: 'error', message })
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      setLocationStatus({
        status: 'error',
        message: 'このブラウザは位置情報をサポートしていません'
      })
    }
  }, [])

  // 今日の勤怠記録を取得
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        
        // APIから今日の勤怠記録を取得
        const response = await fetch(`/api/attendance?employeeId=employee@shiftmaster.test&date=${today}`)
        const data = await response.json()
        
                 if (data.success && data.data) {
           // APIから取得したデータをフロントエンドの形式に変換
           const apiRecord: AttendanceRecord = {
             id: data.data.id,
             date: today,
             clock_in_time: data.data.clockInTime ? new Date(data.data.clockInTime).toTimeString().slice(0, 5) : '',
             clock_out_time: data.data.clockOutTime ? new Date(data.data.clockOutTime).toTimeString().slice(0, 5) : undefined,
             break_minutes: data.data.totalBreakMinutes || 0,
             total_work_minutes: data.data.totalWorkMinutes || 0,
             status: data.data.clockOutTime ? 'completed' : 'in_progress'
           }
          
          setCurrentRecord(apiRecord)
          setAttendanceHistory([apiRecord])
        } else {
          // 記録がない場合は空の状態
          setCurrentRecord(null)
          setAttendanceHistory([])
        }
      } catch (error) {
        console.error('勤怠記録取得エラー:', error)
        // エラー時はモックデータを使用
        const today = new Date().toISOString().split('T')[0]
        const mockRecord: AttendanceRecord = {
          id: '1',
          date: today,
          clock_in_time: '',
          clock_out_time: undefined,
          break_minutes: 0,
          total_work_minutes: 0,
          status: 'in_progress'
        }
        setCurrentRecord(mockRecord)
        setAttendanceHistory([])
      }
    }
    
    fetchTodayAttendance()
  }, [])

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3 // 地球の半径（メートル）
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c
  }

  const handleClockIn = async () => {
    if (locationStatus.status !== 'ok') {
      toast.error('店舗内でのみ出勤できます')
      return
    }
    
    try {
      const now = new Date()
      const timeString = now.toTimeString().slice(0, 5)
      
      // APIに出勤記録を送信
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
                 body: JSON.stringify({
           employeeId: 'employee@shiftmaster.test', // 実際の従業員メールアドレス
           action: 'clockIn',
           latitude: 35.6762, // テスト用固定座標
           longitude: 139.6503
         }),
      })

      const data = await response.json()
      
             if (data.success) {
         // 出勤成功後、実際のAPIデータを再取得
         const today = new Date().toISOString().split('T')[0]
         const refreshResponse = await fetch(`/api/attendance?employeeId=employee@shiftmaster.test&date=${today}`)
         const refreshData = await refreshResponse.json()
         
                   if (refreshData.success && refreshData.data) {
            const apiRecord: AttendanceRecord = {
              id: refreshData.data.id,
              date: today,
              clock_in_time: refreshData.data.clockInTime ? new Date(refreshData.data.clockInTime).toTimeString().slice(0, 5) : '',
              clock_out_time: refreshData.data.clockOutTime ? new Date(refreshData.data.clockOutTime).toTimeString().slice(0, 5) : undefined,
              break_minutes: refreshData.data.totalBreakMinutes || 0,
              total_work_minutes: refreshData.data.totalWorkMinutes || 0,
              status: refreshData.data.clockOutTime ? 'completed' : 'in_progress'
            }
           
           setCurrentRecord(apiRecord)
           setAttendanceHistory([apiRecord])
         }
         
         setIsClockInModalOpen(true)
         toast.success('出勤が記録されました！')
         
         // 5秒後に自動で閉じる
         setTimeout(() => {
           setIsClockInModalOpen(false)
           if (isSimpleMode) {
             setCurrentRecord(null)
           }
         }, 5000)
       } else {
         toast.error('出勤の記録に失敗しました: ' + data.error)
       }
    } catch (error) {
      console.error('出勤エラー:', error)
      toast.error('出勤の記録中にエラーが発生しました')
    }
  }

  const handleClockOut = async () => {
    if (!currentRecord) return
    
    try {
      const now = new Date()
      const timeString = now.toTimeString().slice(0, 5)
      
      // APIに退勤記録を送信
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
                 body: JSON.stringify({
           employeeId: 'employee@shiftmaster.test', // 実際の従業員メールアドレス
           action: 'clockOut',
           latitude: 35.6762, // テスト用固定座標
           longitude: 139.6503
         }),
      })

      const data = await response.json()
      
      if (data.success) {
        setIsClockOutModalOpen(true)
      } else {
        toast.error('退勤の記録に失敗しました: ' + data.error)
      }
    } catch (error) {
      console.error('退勤エラー:', error)
      toast.error('退勤の記録中にエラーが発生しました')
    }
  }

  const handleBreakSubmit = () => {
    if (!currentRecord) return
    
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 5)
    
    const updatedRecord: AttendanceRecord = {
      ...currentRecord,
      clock_out_time: timeString,
      break_minutes: breakMinutes,
      total_work_minutes: calculateWorkMinutes(currentRecord.clock_in_time, timeString, breakMinutes),
      status: 'completed'
    }
    
    setCurrentRecord(updatedRecord)
    setAttendanceHistory(prev => 
      prev.map(record => record.id === currentRecord.id ? updatedRecord : record)
    )
    
    setIsClockOutModalOpen(false)
    toast.success('退勤完了！お疲れ様でした！')
    
    // 5秒後に自動でリセット
    setTimeout(() => {
      if (isSimpleMode) {
        setCurrentRecord(null)
      }
    }, 5000)
  }

  const calculateWorkMinutes = (clockIn: string, clockOut: string, breakMinutes: number): number => {
    const [inHour, inMin] = clockIn.split(':').map(Number)
    const [outHour, outMin] = clockOut.split(':').map(Number)
    
    let totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin)
    if (totalMinutes < 0) totalMinutes += 24 * 60 // 日をまたぐ場合
    
    return totalMinutes - breakMinutes
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const getLocationStatusColor = () => {
    switch (locationStatus.status) {
      case 'ok': return 'text-green-600'
      case 'out_of_range': return 'text-red-600'
      case 'error': return 'text-red-600'
      case 'denied': return 'text-red-600'
      default: return 'text-yellow-600'
    }
  }

  const getLocationStatusIcon = () => {
    switch (locationStatus.status) {
      case 'ok': return '📍'
      case 'out_of_range': return '⚠️'
      case 'error': return '❌'
      case 'denied': return '🚫'
      default: return '⏳'
    }
  }

  // 簡易モードの従業員選択画面
  if (isSimpleMode && !currentRecord) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">従業員選択</h1>
          <p className="text-gray-600">出退勤を行う従業員を選択してください</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee-select">従業員</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="従業員を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full" 
                onClick={() => setCurrentRecord({
                  id: 'temp',
                  date: new Date().toISOString().split('T')[0],
                  clock_in_time: '',
                  break_minutes: 0,
                  total_work_minutes: 0,
                  status: 'in_progress'
                })}
                disabled={!selectedEmployee}
              >
                出退勤開始
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setIsSimpleMode(false)}
          >
            ログインモードに切り替え
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">出退勤管理</h1>
          <p className="text-gray-600">位置情報連動の出退勤システム</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isSimpleMode}
              onCheckedChange={setIsSimpleMode}
            />
            <Label>簡易モード</Label>
          </div>
          {isSimpleMode && selectedEmployee && (
            <Badge variant="secondary">
              {employees.find(e => e.id === selectedEmployee)?.name}
            </Badge>
          )}
        </div>
      </div>

             {/* 大型時計 */}
       <Card className="text-center">
         <CardContent className="p-8">
           <div className="text-6xl font-bold text-gray-800 mb-2">
             {currentTime ? formatTime(currentTime) : '--:--:--'}
           </div>
           <div className="text-xl text-gray-600">
             {currentTime ? formatDate(currentTime) : '読み込み中...'}
           </div>
         </CardContent>
       </Card>

      {/* 現在の状況 */}
      {currentRecord && (
        <Card>
          <CardHeader>
            <CardTitle>現在の状況</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {currentRecord.clock_in_time || '未出勤'}
                </div>
                <div className="text-sm text-blue-600">出勤時刻</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {currentRecord.status === 'completed' 
                    ? `${Math.floor(currentRecord.total_work_minutes / 60)}時間${currentRecord.total_work_minutes % 60}分`
                    : '勤務中'
                  }
                </div>
                <div className="text-sm text-green-600">勤務時間</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {currentRecord.break_minutes}分
                </div>
                <div className="text-sm text-orange-600">休憩時間</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 位置情報状況 */}
      <Card>
        <CardHeader>
          <CardTitle>位置情報状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center space-x-3 text-lg ${getLocationStatusColor()}`}>
            <span className="text-2xl">{getLocationStatusIcon()}</span>
            <span>{locationStatus.message}</span>
          </div>
          {locationStatus.distance && (
            <div className="mt-2 text-sm text-gray-600">
              店舗までの距離: {locationStatus.distance}m
            </div>
          )}
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          size="lg"
          className="h-16 text-lg bg-green-600 hover:bg-green-700"
          onClick={handleClockIn}
          disabled={locationStatus.status !== 'ok' || !!currentRecord?.clock_in_time}
        >
          出勤
        </Button>
        
        <Button
          size="lg"
          className="h-16 text-lg bg-red-600 hover:bg-red-700"
          onClick={handleClockOut}
          disabled={!currentRecord?.clock_in_time || currentRecord?.status === 'completed'}
        >
          退勤
        </Button>
      </div>

      {/* 今日の履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>今日の履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceHistory
              .filter(record => record.date === new Date().toISOString().split('T')[0])
              .map(record => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                      {record.status === 'completed' ? '完了' : '勤務中'}
                    </Badge>
                    <span className="font-medium">
                      {record.clock_in_time} 出勤
                    </span>
                    {record.clock_out_time && (
                      <span className="text-gray-600">
                        {record.clock_out_time} 退勤
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {record.break_minutes > 0 && `休憩: ${record.break_minutes}分`}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* 出勤完了モーダル */}
      <Dialog open={isClockInModalOpen} onOpenChange={setIsClockInModalOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl text-green-600">出勤完了！</DialogTitle>
            <DialogDescription>
              本日もよろしくお願いいたします！
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-lg font-medium">
              出勤時刻: {currentRecord?.clock_in_time}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {isSimpleMode ? '5秒後に従業員選択画面に戻ります' : '位置情報が正常に記録されました'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 退勤・休憩入力モーダル */}
      <Dialog open={isClockOutModalOpen} onOpenChange={setIsClockOutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>退勤・休憩時間入力</DialogTitle>
            <DialogDescription>
              本日の休憩時間を入力してください
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>クイック選択</Label>
              <div className="flex flex-wrap gap-2">
                {[0, 30, 45, 60].map(minutes => (
                  <Button
                    key={minutes}
                    variant={breakMinutes === minutes ? "default" : "outline"}
                    onClick={() => setBreakMinutes(minutes)}
                    size="sm"
                  >
                    {minutes === 0 ? 'なし' : `${minutes}分`}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>カスタム入力（15分単位）</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={customBreakMinutes}
                  onChange={(e) => setCustomBreakMinutes(parseInt(e.target.value))}
                  min="0"
                  max="180"
                  step="15"
                  className="w-24"
                />
                <span>分</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBreakMinutes(customBreakMinutes)}
                >
                  適用
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                実働時間: {currentRecord ? 
                  `${Math.floor((calculateWorkMinutes(currentRecord.clock_in_time, new Date().toTimeString().slice(0, 5), breakMinutes)) / 60)}時間${(calculateWorkMinutes(currentRecord.clock_in_time, new Date().toTimeString().slice(0, 5), breakMinutes)) % 60}分` 
                  : '計算中...'
                }
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsClockOutModalOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleBreakSubmit}>
              退勤確定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


