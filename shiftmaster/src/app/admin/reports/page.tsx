'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3, PieChart, TrendingUp, Users, Clock, Calendar, Download,
  RefreshCw, Filter, FileText, AlertCircle, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, CalendarDays, UserCheck, Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// レポートデータの型定義
interface ReportData {
  period: {
    startDate?: string
    endDate?: string
  }
  summary?: {
    totalRecords?: number
    totalWorkHours?: number
    totalOvertimeHours?: number
    averageWorkHours?: number
    averageOvertimeHours?: number
    totalShifts?: number
    totalHours?: number
    averageHoursPerShift?: number
  }
  overview?: {
    employeeCount: number
    attendanceCount: number
    shiftCount: number
    shiftRequestCount: number
    notificationCount: number
  }
  employeeStats?: any[]
  positionStats?: any[]
  monthlyAttendance?: any[]
  details?: any[]
}

const ReportsPage = () => {
  const router = useRouter()
  const [selectedStore] = useState({ id: '24827f88-3b69-4548-aa9c-d26db7bc417c', name: 'カフェ Sunny 渋谷店' })
  const [reportType, setReportType] = useState<'summary' | 'attendance' | 'shift'>('summary')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all')
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 初期日付を設定（今月の初日と最終日）
  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(lastDay.toISOString().split('T')[0])
  }, [])

  // レポートを生成
  const generateReport = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        storeId: selectedStore.id,
        type: reportType,
        startDate,
        endDate
      })
      
      if (selectedEmployee !== 'all') {
        params.append('employeeId', selectedEmployee)
      }
      
      const response = await fetch(`/api/reports?${params}`)
      
      if (!response.ok) {
        throw new Error('レポートの生成に失敗しました')
      }
      
      const result = await response.json()
      if (result.success) {
        setReportData(result.data)
        console.log('✅ レポート生成成功:', result.data)
      } else {
        throw new Error(result.error || 'レポートの生成に失敗しました')
      }
    } catch (error) {
      console.error('レポート生成エラー:', error)
      setError('レポートの生成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // レポートタイプが変更されたときに自動生成
  useEffect(() => {
    if (startDate && endDate) {
      generateReport()
    }
  }, [reportType])

  // レポートをエクスポート
  const exportReport = () => {
    if (!reportData) return
    
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType}_report_${startDate}_${endDate}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    toast.success('レポートをエクスポートしました')
  }

  // 数値を適切な形式でフォーマット
  const formatNumber = (num: number, decimals: number = 1) => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(decimals)
  }

  // 時間を適切な形式でフォーマット
  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    return `${wholeHours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin/home')}
                className="mr-4"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                管理者ホーム
              </Button>
              <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">レポート・分析</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={exportReport}
                disabled={!reportData}
              >
                <Download className="w-4 h-4 mr-2" />
                エクスポート
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* フィルター */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>レポート設定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>レポートタイプ</Label>
                <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">サマリー</SelectItem>
                    <SelectItem value="attendance">勤怠</SelectItem>
                    <SelectItem value="shift">シフト</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>開始日</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>終了日</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>従業員</Label>
                <Select value={selectedEmployee} onValueChange={(value: any) => setSelectedEmployee(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全員</SelectItem>
                    {/* 後で従業員リストを動的に取得 */}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={generateReport} disabled={loading} className="w-full">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  生成
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* レポート表示 */}
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto animate-spin text-gray-400" />
                <p className="mt-2 text-gray-500">レポート生成中...</p>
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
        ) : reportData ? (
          <div className="space-y-6">
            {/* サマリーカード */}
            {reportType === 'summary' && reportData.overview && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">従業員数</p>
                        <p className="text-2xl font-bold">{reportData.overview.employeeCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">勤怠記録</p>
                        <p className="text-2xl font-bold">{reportData.overview.attendanceCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600">シフト数</p>
                        <p className="text-2xl font-bold">{reportData.overview.shiftCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600">シフト申請</p>
                        <p className="text-2xl font-bold">{reportData.overview.shiftRequestCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600">通知数</p>
                        <p className="text-2xl font-bold">{reportData.overview.notificationCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 勤怠レポート */}
            {reportType === 'attendance' && reportData.summary && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">総勤務時間</p>
                          <p className="text-2xl font-bold">{formatHours(reportData.summary.totalWorkHours || 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">総残業時間</p>
                          <p className="text-2xl font-bold">{formatHours(reportData.summary.totalOvertimeHours || 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600">平均勤務時間</p>
                          <p className="text-2xl font-bold">{formatHours(reportData.summary.averageWorkHours || 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="text-sm text-gray-600">記録数</p>
                          <p className="text-2xl font-bold">{reportData.summary.totalRecords || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 従業員別統計 */}
                {reportData.employeeStats && reportData.employeeStats.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>従業員別統計</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">従業員</th>
                              <th className="text-left p-2">勤務日数</th>
                              <th className="text-left p-2">総勤務時間</th>
                              <th className="text-left p-2">総残業時間</th>
                              <th className="text-left p-2">平均勤務時間</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.employeeStats.map((emp: any) => (
                              <tr key={emp.employeeId} className="border-b">
                                <td className="p-2">
                                  <div>
                                    <p className="font-medium">{emp.employeeName}</p>
                                    <p className="text-sm text-gray-500">{emp.employeeCode}</p>
                                  </div>
                                </td>
                                <td className="p-2">{emp.totalDays}日</td>
                                <td className="p-2">{formatHours(emp.totalWorkHours)}</td>
                                <td className="p-2">{formatHours(emp.totalOvertimeHours)}</td>
                                <td className="p-2">{formatHours(emp.averageWorkHours)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* シフトレポート */}
            {reportType === 'shift' && reportData.summary && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">総シフト数</p>
                          <p className="text-2xl font-bold">{reportData.summary.totalShifts || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">総勤務時間</p>
                          <p className="text-2xl font-bold">{formatHours(reportData.summary.totalHours || 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600">平均シフト時間</p>
                          <p className="text-2xl font-bold">{formatHours(reportData.summary.averageHoursPerShift || 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 従業員別シフト統計 */}
                {reportData.employeeStats && reportData.employeeStats.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>従業員別シフト統計</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">従業員</th>
                              <th className="text-left p-2">シフト数</th>
                              <th className="text-left p-2">総勤務時間</th>
                              <th className="text-left p-2">平均シフト時間</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.employeeStats.map((emp: any) => (
                              <tr key={emp.employeeId} className="border-b">
                                <td className="p-2">
                                  <div>
                                    <p className="font-medium">{emp.employeeName}</p>
                                    <p className="text-sm text-gray-500">{emp.employeeCode}</p>
                                  </div>
                                </td>
                                <td className="p-2">{emp.totalShifts}回</td>
                                <td className="p-2">{formatHours(emp.totalHours)}</td>
                                <td className="p-2">{formatHours(emp.averageHoursPerShift)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ポジション別統計 */}
                {reportData.positionStats && reportData.positionStats.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>ポジション別統計</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">ポジション</th>
                              <th className="text-left p-2">シフト数</th>
                              <th className="text-left p-2">総勤務時間</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.positionStats.map((pos: any) => (
                              <tr key={pos.positionId} className="border-b">
                                <td className="p-2 font-medium">{pos.positionName}</td>
                                <td className="p-2">{pos.totalShifts}回</td>
                                <td className="p-2">{formatHours(pos.totalHours)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-8 h-8 mx-auto" />
                <p className="mt-2">レポートを生成してください</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ReportsPage

