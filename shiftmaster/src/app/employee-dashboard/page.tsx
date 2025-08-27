'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Clock, Calendar, User, MapPin, TrendingUp, AlertCircle } from 'lucide-react'

// 型定義
interface Employee {
  id: string
  name: string
  employeeCode: string
  position: string
  status: 'active' | 'inactive'
}

interface AttendanceRecord {
  id: string
  date: string
  clockIn: string
  clockOut: string
  breakMinutes: number
  status: 'present' | 'absent' | 'late' | 'early_leave'
}

interface Shift {
  id: string
  date: string
  startTime: string
  endTime: string
  position: string
  status: 'confirmed' | 'pending' | 'completed'
}

interface ShiftRequest {
  id: string
  month: string
  submittedAt: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  progress: number
}

export default function EmployeeDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null)
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([])
  const [shiftRequest, setShiftRequest] = useState<ShiftRequest | null>(null)
  const [locationStatus, setLocationStatus] = useState<'checking' | 'ok' | 'out_of_range' | 'error'>('checking')

  // 現在時刻の更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 位置情報の確認
  useEffect(() => {
    const checkLocation = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // 店舗の座標（仮の値）
              const storeLat = 35.6762
              const storeLng = 139.6503
              const userLat = position.coords.latitude
              const userLng = position.coords.longitude
              
              // 距離計算（簡易版）
              const distance = Math.sqrt(
                Math.pow(userLat - storeLat, 2) + Math.pow(userLng - storeLng, 2)
              ) * 111000 // 概算でメートルに変換
              
              if (distance <= 50) {
                setLocationStatus('ok')
              } else {
                setLocationStatus('out_of_range')
              }
            },
            () => setLocationStatus('error'),
            { timeout: 10000, enableHighAccuracy: true }
          )
        } else {
          setLocationStatus('error')
        }
      } catch (error) {
        setLocationStatus('error')
      }
    }

    checkLocation()
  }, [])

  // モックデータ
  useEffect(() => {
    setEmployee({
      id: '1',
      name: '田中太郎',
      employeeCode: 'EMP001',
      position: '店員',
      status: 'active'
    })

    setTodayAttendance({
      id: '1',
      date: new Date().toISOString().split('T')[0],
      clockIn: '09:00',
      clockOut: null,
      breakMinutes: 0,
      status: 'present'
    })

    setUpcomingShifts([
      {
        id: '1',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '17:00',
        position: '店員',
        status: 'confirmed'
      },
      {
        id: '2',
        date: '2024-01-16',
        startTime: '13:00',
        endTime: '21:00',
        position: '店員',
        status: 'confirmed'
      }
    ])

    setShiftRequest({
      id: '1',
      month: '2024年1月',
      submittedAt: '2024-01-10',
      status: 'submitted',
      progress: 85
    })
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const getLocationStatusText = () => {
    switch (locationStatus) {
      case 'checking':
        return '位置情報確認中...'
      case 'ok':
        return '店舗内です'
      case 'out_of_range':
        return '店舗から離れています'
      case 'error':
        return '位置情報エラー'
      default:
        return '不明'
    }
  }

  const getLocationStatusColor = () => {
    switch (locationStatus) {
      case 'ok':
        return 'bg-green-100 text-green-800'
      case 'out_of_range':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleClockIn = () => {
    if (locationStatus === 'ok') {
      // 出勤処理
      setTodayAttendance(prev => prev ? {
        ...prev,
        clockIn: formatTime(new Date()),
        status: 'present'
      } : null)
    }
  }

  const handleClockOut = () => {
    if (todayAttendance?.clockIn) {
      // 退勤処理
      setTodayAttendance(prev => prev ? {
        ...prev,
        clockOut: formatTime(new Date())
      } : null)
    }
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
          <h1 className="text-2xl font-bold">従業員ダッシュボード</h1>
          <p className="text-gray-600">お疲れ様です、{employee.name}さん</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{employee.employeeCode}</p>
          <Badge variant="secondary">{employee.position}</Badge>
        </div>
      </div>

      {/* 現在時刻・位置情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            現在時刻・位置情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {formatTime(currentTime)}
            </div>
            <div className="text-lg text-gray-600 mt-2">
              {formatDate(currentTime)}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            <Badge className={getLocationStatusColor()}>
              {getLocationStatusText()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 出退勤管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            今日の出退勤
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayAttendance ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">出勤時刻</p>
                  <p className="text-lg font-semibold">
                    {todayAttendance.clockIn || '未出勤'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">退勤時刻</p>
                  <p className="text-lg font-semibold">
                    {todayAttendance.clockOut || '未退勤'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 justify-center">
                {!todayAttendance.clockIn && (
                  <Button 
                    onClick={handleClockIn}
                    disabled={locationStatus !== 'ok'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    出勤
                  </Button>
                )}
                {todayAttendance.clockIn && !todayAttendance.clockOut && (
                  <Button 
                    onClick={handleClockOut}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    退勤
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              今日の勤怠記録がありません
            </div>
          )}
          
          <div className="pt-4 border-t">
            <Link href="/attendance">
              <Button variant="outline" className="w-full">
                詳細な勤怠管理
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* シフト状況 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 今後のシフト */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              今後のシフト
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingShifts.length > 0 ? (
              upcomingShifts.map((shift) => (
                <div key={shift.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{shift.date}</p>
                    <p className="text-sm text-gray-600">
                      {shift.startTime} - {shift.endTime}
                    </p>
                  </div>
                  <Badge variant={shift.status === 'confirmed' ? 'default' : 'secondary'}>
                    {shift.status === 'confirmed' ? '確定' : '保留'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">今後のシフトはありません</p>
            )}
            
            <div className="pt-2">
              <Link href="/shift">
                <Button variant="outline" className="w-full">
                  シフト希望提出
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* シフト申請状況 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              シフト申請状況
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shiftRequest ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{shiftRequest.month}</span>
                  <Badge variant={shiftRequest.status === 'submitted' ? 'default' : 'secondary'}>
                    {shiftRequest.status === 'submitted' ? '提出済み' : '下書き'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>提出進捗</span>
                    <span>{shiftRequest.progress}%</span>
                  </div>
                  <Progress value={shiftRequest.progress} className="h-2" />
                </div>
                
                <p className="text-xs text-gray-500">
                  提出日: {shiftRequest.submittedAt}
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                シフト申請がありません
              </div>
            )}
            
            <div className="pt-2">
              <Link href="/shift">
                <Button variant="outline" className="w-full">
                  シフト申請作成
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* クイックアクション */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            クイックアクション
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/attendance">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">出退勤管理</p>
                  <p className="text-sm text-gray-600">打刻・履歴確認</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/shift">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">シフト申請</p>
                  <p className="text-sm text-gray-600">希望提出・確認</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/profile">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-medium">プロフィール</p>
                  <p className="text-sm text-gray-600">個人情報・設定</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* お知らせ・アラート */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            お知らせ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">シフト申請期限</p>
                <p className="text-sm text-blue-700">
                  1月のシフト申請は1月15日までです。まだ提出していない方はお早めにお願いします。
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">勤怠記録の確認</p>
                <p className="text-sm text-green-700">
                  今月の勤怠記録が確定しました。内容をご確認ください。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

