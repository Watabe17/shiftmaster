'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  PieChart,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Database,
  Settings
} from 'lucide-react'

interface AttendanceStats {
  totalEmployees: number
  presentToday: number
  absentToday: number
  lateToday: number
  overtimeHours: number
  averageWorkHours: number
}

interface ShiftEfficiency {
  totalShifts: number
  completedShifts: number
  cancelledShifts: number
  coverageRate: number
  averageShiftLength: number
  preferredShiftSatisfaction: number
}

interface CostAnalysis {
  totalLaborCost: number
  overtimeCost: number
  averageHourlyRate: number
  costPerEmployee: number
  monthlyTrend: number
  budgetUtilization: number
}

interface ReportData {
  period: string
  department: string
  attendanceStats: AttendanceStats
  shiftEfficiency: ShiftEfficiency
  costAnalysis: CostAnalysis
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('current_month')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // モックデータ
  useEffect(() => {
    const mockData: ReportData = {
      period: '2025年1月',
      department: '全店舗',
      attendanceStats: {
        totalEmployees: 45,
        presentToday: 38,
        absentToday: 5,
        lateToday: 2,
        overtimeHours: 12.5,
        averageWorkHours: 7.8
      },
      shiftEfficiency: {
        totalShifts: 120,
        completedShifts: 115,
        cancelledShifts: 3,
        coverageRate: 95.8,
        averageShiftLength: 7.5,
        preferredShiftSatisfaction: 87.3
      },
      costAnalysis: {
        totalLaborCost: 2850000,
        overtimeCost: 180000,
        averageHourlyRate: 1200,
        costPerEmployee: 63333,
        monthlyTrend: 2.3,
        budgetUtilization: 94.2
      }
    }
    setReportData(mockData)
  }, [])

  const handleExportReport = (format: 'csv' | 'excel' | 'pdf') => {
    toast.success(`${format.toUpperCase()}形式でレポートをエクスポートしました`)
  }

  const handleGenerateCustomReport = () => {
    setIsLoading(true)
    setTimeout(() => {
      toast.success('カスタムレポートを生成しました')
      setIsLoading(false)
    }, 2000)
  }

  const getStatusColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-600'
    if (value >= threshold * 0.8) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (!reportData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">レポート・分析</h1>
          <p className="text-muted-foreground">勤怠・シフト・コストの詳細分析とレポート生成</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleGenerateCustomReport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                カスタムレポート
              </>
            )}
          </Button>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">今月</SelectItem>
              <SelectItem value="last_month">先月</SelectItem>
              <SelectItem value="current_quarter">今四半期</SelectItem>
              <SelectItem value="last_quarter">先四半期</SelectItem>
              <SelectItem value="current_year">今年</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全店舗</SelectItem>
              <SelectItem value="store1">渋谷店</SelectItem>
              <SelectItem value="store2">新宿店</SelectItem>
              <SelectItem value="store3">池袋店</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>概要</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>勤怠分析</span>
          </TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>シフト分析</span>
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>コスト分析</span>
          </TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI カード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>出勤率</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(reportData.attendanceStats.presentToday / reportData.attendanceStats.totalEmployees * 100, 90)}`}>
                  {((reportData.attendanceStats.presentToday / reportData.attendanceStats.totalEmployees) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {reportData.attendanceStats.presentToday}/{reportData.attendanceStats.totalEmployees}人
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>シフト充足率</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(reportData.shiftEfficiency.coverageRate, 95)}`}>
                  {formatPercentage(reportData.shiftEfficiency.coverageRate)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {reportData.shiftEfficiency.completedShifts}/{reportData.shiftEfficiency.totalShifts}件
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>予算消化率</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(reportData.costAnalysis.budgetUtilization, 90)}`}>
                  {formatPercentage(reportData.costAnalysis.budgetUtilization)}
                </div>
                <div className="text-xs text-muted-foreground">
                  予算内で運用中
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>月次トレンド</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(reportData.costAnalysis.monthlyTrend, 0)}`}>
                  {reportData.costAnalysis.monthlyTrend > 0 ? '+' : ''}{reportData.costAnalysis.monthlyTrend}%
                </div>
                <div className="text-xs text-muted-foreground">
                  前月比
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 詳細サマリー */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>勤怠サマリー</span>
                  <Button variant="outline" size="sm" onClick={() => handleExportReport('csv')}>
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>総従業員数</span>
                    <span className="font-medium">{reportData.attendanceStats.totalEmployees}人</span>
                  </div>
                  <div className="flex justify-between">
                    <span>本日出勤</span>
                    <span className="font-medium text-green-600">{reportData.attendanceStats.presentToday}人</span>
                  </div>
                  <div className="flex justify-between">
                    <span>欠勤</span>
                    <span className="font-medium text-red-600">{reportData.attendanceStats.absentToday}人</span>
                  </div>
                  <div className="flex justify-between">
                    <span>遅刻</span>
                    <span className="font-medium text-yellow-600">{reportData.attendanceStats.lateToday}人</span>
                  </div>
                  <div className="flex justify-between">
                    <span>平均勤務時間</span>
                    <span className="font-medium">{reportData.attendanceStats.averageWorkHours}時間</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>シフト効率</span>
                  <Button variant="outline" size="sm" onClick={() => handleExportReport('excel')}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>総シフト数</span>
                    <span className="font-medium">{reportData.shiftEfficiency.totalShifts}件</span>
                  </div>
                  <div className="flex justify-between">
                    <span>完了シフト</span>
                    <span className="font-medium text-green-600">{reportData.shiftEfficiency.completedShifts}件</span>
                  </div>
                  <div className="flex justify-between">
                    <span>キャンセル</span>
                    <span className="font-medium text-red-600">{reportData.shiftEfficiency.cancelledShifts}件</span>
                  </div>
                  <div className="flex justify-between">
                    <span>充足率</span>
                    <span className="font-medium">{formatPercentage(reportData.shiftEfficiency.coverageRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>希望シフト満足度</span>
                    <span className="font-medium">{formatPercentage(reportData.shiftEfficiency.preferredShiftSatisfaction)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 勤怠分析タブ */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>勤怠統計詳細</CardTitle>
              <CardDescription>
                期間: {reportData.period} | 対象: {reportData.department}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {reportData.attendanceStats.totalEmployees}
                  </div>
                  <div className="text-sm text-muted-foreground">総従業員数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {reportData.attendanceStats.presentToday}
                  </div>
                  <div className="text-sm text-muted-foreground">本日出勤</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {reportData.attendanceStats.absentToday}
                  </div>
                  <div className="text-sm text-muted-foreground">欠勤</div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">平均勤務時間</div>
                      <div className="text-sm text-muted-foreground">月間平均</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {reportData.attendanceStats.averageWorkHours}時間
                    </div>
                    <div className="text-sm text-muted-foreground">目標: 8.0時間</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">残業時間</div>
                      <div className="text-sm text-muted-foreground">月間合計</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      {reportData.attendanceStats.overtimeHours}時間
                    </div>
                    <div className="text-sm text-muted-foreground">前月比: +5.2%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* シフト分析タブ */}
        <TabsContent value="shifts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>シフト効率分析</CardTitle>
              <CardDescription>
                シフトの充足率と効率性を詳細分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">シフト状況</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>総シフト数</span>
                      <span className="font-medium">{reportData.shiftEfficiency.totalShifts}件</span>
                    </div>
                    <div className="flex justify-between">
                      <span>完了</span>
                      <span className="font-medium text-green-600">{reportData.shiftEfficiency.completedShifts}件</span>
                    </div>
                    <div className="flex justify-between">
                      <span>キャンセル</span>
                      <span className="font-medium text-red-600">{reportData.shiftEfficiency.cancelledShifts}件</span>
                    </div>
                    <div className="flex justify-between">
                      <span>充足率</span>
                      <span className="font-medium">{formatPercentage(reportData.shiftEfficiency.coverageRate)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">品質指標</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>平均シフト時間</span>
                      <span className="font-medium">{reportData.shiftEfficiency.averageShiftLength}時間</span>
                    </div>
                    <div className="flex justify-between">
                      <span>希望シフト満足度</span>
                      <span className="font-medium">{formatPercentage(reportData.shiftEfficiency.preferredShiftSatisfaction)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>シフト変更率</span>
                      <span className="font-medium">2.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>緊急シフト発生率</span>
                      <span className="font-medium">1.2%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" onClick={() => handleExportReport('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  詳細レポートPDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* コスト分析タブ */}
        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>コスト分析詳細</CardTitle>
              <CardDescription>
                人件費とコスト効率の詳細分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">コスト概要</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>総人件費</span>
                      <span className="font-medium">{formatCurrency(reportData.costAnalysis.totalLaborCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>残業手当</span>
                      <span className="font-medium text-orange-600">{formatCurrency(reportData.costAnalysis.overtimeCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>平均時給</span>
                      <span className="font-medium">{formatCurrency(reportData.costAnalysis.averageHourlyRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>従業員1人あたり</span>
                      <span className="font-medium">{formatCurrency(reportData.costAnalysis.costPerEmployee)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">トレンド分析</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>月次トレンド</span>
                      <span className={`font-medium ${getStatusColor(reportData.costAnalysis.monthlyTrend, 0)}`}>
                        {reportData.costAnalysis.monthlyTrend > 0 ? '+' : ''}{reportData.costAnalysis.monthlyTrend}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>予算消化率</span>
                      <span className="font-medium">{formatPercentage(reportData.costAnalysis.budgetUtilization)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>効率性指標</span>
                      <span className="font-medium">85.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>コスト削減余地</span>
                      <span className="font-medium text-green-600">5.8%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">コスト最適化の提案</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 残業時間の削減により月額約¥50,000の削減が可能</li>
                  <li>• シフト効率の向上で人件費を3-5%削減可能</li>
                  <li>• 勤務時間の最適化で従業員満足度向上</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

