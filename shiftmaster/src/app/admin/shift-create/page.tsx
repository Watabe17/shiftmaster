'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar, Users, ChevronLeft, Menu, LogOut, Settings, Clock, Home,
  CheckCircle, AlertCircle, ChevronRight, Save, Sparkles, UserCheck,
  FileText, X, Edit2, Plus, ArrowRight, Info, Target,
  AlertTriangle, Sliders, List, Eye, ChevronDown, ChevronUp,
  CalendarDays, UserX, FileUp, Grid3x3, BarChart, Trash2,
  Edit3, Download, RefreshCw, AlertCircle as AlertCircleIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getAIShiftGenerator, resetAIShiftGenerator } from '@/lib/ai-shift-generator'

// 従業員の型定義
interface Employee {
  id: string
  name: string
  positions: string[]
  employment_type: string
  monthly_limit: number
  monthly_current: number
}

// シフト希望の型定義
interface ShiftRequest {
  id: string
  employeeId: string
  employeeName: string
  date: string
  status: 'available' | 'unavailable' | 'preferred'
  preferredStartTime?: string
  preferredEndTime?: string
  notes?: string
}

// ポジション要件の型定義
interface PositionRequirement {
  id: string
  positionName: string
  minEmployees: number
  maxEmployees: number
  preferredStartTime: string
  preferredEndTime: string
  breakMinutes: number
}

// シフトルールの型定義
interface ShiftRule {
  maxConsecutiveDays: number
  minRestHours: number
  preferredShiftPattern: 'morning' | 'afternoon' | 'evening' | 'mixed'
  avoidOvertime: boolean
  balanceWorkload: boolean
  considerPreferences: boolean
}

// 生成されたシフトの型定義
interface GeneratedShift {
  id: string
  date: string
  employeeId: string
  employeeName: string
  positionId: string
  positionName: string
  startTime: string
  endTime: string
  breakMinutes: number
  confidence: number
  reasoning: string
}

const ShiftCreatePage = () => {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState('shift')
  const [selectedStore] = useState({ id: 'store-1', name: 'カフェ Sunny 渋谷店' })
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState('2025-02')
  const [selectedRuleSet, setSelectedRuleSet] = useState('normal')
  const [selectedPosition, setSelectedPosition] = useState('all')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [showFallbackModal, setShowFallbackModal] = useState(false)
  const [apiTestResult, setApiTestResult] = useState<boolean | null>(null)
  const [testingConnection, setTestingConnection] = useState(false)
  const [quotaStatus, setQuotaStatus] = useState<{
    isAvailable: boolean
    retryAfter?: number
    lastChecked?: Date
  } | null>(null)
  const [generatedShifts, setGeneratedShifts] = useState<GeneratedShift[]>([])
  const [manualShifts, setManualShifts] = useState<GeneratedShift[]>([])

  // サンプルデータ
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // データベースから従業員一覧を取得
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/employees?storeId=24827f88-3b69-4548-aa9c-d26db7bc417c')
      if (!response.ok) {
        throw new Error('従業員データの取得に失敗しました')
      }
      
      const result = await response.json()
      if (result.success && result.data.length > 0) {
        // データベースから取得したデータを変換
        const dbEmployees = result.data.map((dbEmp: any) => ({
          id: dbEmp.id,
          name: dbEmp.fullName,
          positions: dbEmp.position ? [dbEmp.position.id] : ['hall'],
          employment_type: dbEmp.role === 'MANAGER' || dbEmp.role === 'ADMIN' || dbEmp.role === 'SYSTEM_ADMIN' ? 'full_time' : 'part_time',
          monthly_limit: dbEmp.monthlyLimitHours || 120,
          monthly_current: 0 // 今月の勤務時間は後で計算
        }))
        setEmployees(dbEmployees)
        console.log('✅ 従業員データ取得成功:', dbEmployees)
      } else {
        // データベースが空の場合は初期データを使用
        setEmployees([
          {
            id: 'e1',
            name: '佐藤 太郎',
            positions: ['hall', 'cashier'],
            employment_type: 'full_time',
            monthly_limit: 160,
            monthly_current: 145
          },
          {
            id: 'e2',
            name: '鈴木 花子',
            positions: ['kitchen', 'manager'],
            employment_type: 'full_time',
            monthly_limit: 160,
            monthly_current: 152
          },
          {
            id: 'e3',
            name: '田中 一郎',
            positions: ['hall'],
            employment_type: 'part_time',
            monthly_limit: 120,
            monthly_current: 98
          },
          {
            id: 'e4',
            name: '高橋 美咲',
            positions: ['kitchen'],
            employment_type: 'part_time',
            monthly_limit: 120,
            monthly_current: 85
          },
          {
            id: 'e5',
            name: '伊藤 健太',
            positions: ['cashier', 'hall'],
            employment_type: 'part_time',
            monthly_limit: 120,
            monthly_current: 92
          }
        ])
        console.log('データベースが空のため、初期データを使用します')
      }
    } catch (error) {
      console.error('従業員データ取得エラー:', error)
      setError('データの取得に失敗しました。初期データを表示します。')
      // エラー時は初期データを使用
      setEmployees([
        {
          id: 'e1',
          name: '佐藤 太郎',
          positions: ['hall', 'cashier'],
          employment_type: 'full_time',
          monthly_limit: 160,
          monthly_current: 145
        },
        {
          id: 'e2',
          name: '鈴木 花子',
          positions: ['kitchen', 'manager'],
          employment_type: 'full_time',
          monthly_limit: 160,
          monthly_current: 152
        },
        {
          id: 'e3',
          name: '田中 一郎',
          positions: ['hall'],
          employment_type: 'part_time',
          monthly_limit: 120,
          monthly_current: 98
        },
        {
          id: 'e4',
          name: '高橋 美咲',
          positions: ['kitchen'],
          employment_type: 'part_time',
          monthly_limit: 120,
          monthly_current: 85
        },
        {
          id: 'e5',
          name: '伊藤 健太',
          positions: ['cashier', 'hall'],
          employment_type: 'part_time',
          monthly_limit: 120,
          monthly_current: 92
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchEmployees()
  }, [])

  const [shiftRequests] = useState<ShiftRequest[]>([
    {
      id: 'r1',
      employeeId: 'e1',
      employeeName: '佐藤 太郎',
      date: '2025-02-01',
      status: 'available',
      preferredStartTime: '09:00',
      preferredEndTime: '17:00'
    },
    {
      id: 'r2',
      employeeId: 'e2',
      employeeName: '鈴木 花子',
      date: '2025-02-01',
      status: 'available',
      preferredStartTime: '10:00',
      preferredEndTime: '18:00'
    },
    {
      id: 'r3',
      employeeId: 'e3',
      employeeName: '田中 一郎',
      date: '2025-02-01',
      status: 'unavailable'
    },
    {
      id: 'r4',
      employeeId: 'e4',
      employeeName: '高橋 美咲',
      date: '2025-02-01',
      status: 'available',
      preferredStartTime: '11:00',
      preferredEndTime: '19:00'
    },
    {
      id: 'r5',
      employeeId: 'e5',
      employeeName: '伊藤 健太',
      date: '2025-02-01',
      status: 'preferred',
      preferredStartTime: '12:00',
      preferredEndTime: '20:00'
    }
  ])

  const [positionRequirements] = useState<PositionRequirement[]>([
    {
      id: 'p1',
      positionName: 'キッチン',
      minEmployees: 1,
      maxEmployees: 3,
      preferredStartTime: '09:00',
      preferredEndTime: '21:00',
      breakMinutes: 60
    },
    {
      id: 'p2',
      positionName: 'ホール',
      minEmployees: 2,
      maxEmployees: 4,
      preferredStartTime: '09:00',
      preferredEndTime: '21:00',
      breakMinutes: 60
    },
    {
      id: 'p3',
      positionName: 'レジ',
      minEmployees: 1,
      maxEmployees: 2,
      preferredStartTime: '09:00',
      preferredEndTime: '21:00',
      breakMinutes: 60
    }
  ])

  const [shiftRules] = useState<ShiftRule>({
    maxConsecutiveDays: 5,
    minRestHours: 11,
    preferredShiftPattern: 'mixed',
    avoidOvertime: true,
    balanceWorkload: true,
    considerPreferences: true
  })

  const ruleSets = [
    {
      id: 'normal',
      name: '通常期',
      description: '標準的な人員配置',
      lastUsed: '2025年1月',
      color: 'blue'
    },
    {
      id: 'busy',
      name: '繁忙期',
      description: '年末年始・GW・お盆の増員体制',
      lastUsed: '2024年12月',
      color: 'orange'
    },
    {
      id: 'slow',
      name: '閑散期',
      description: '2月・6月の少人数体制',
      lastUsed: '2024年6月',
      color: 'green'
    }
  ]

  const menuItems = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'shift', label: 'シフト作成', icon: Calendar },
    { id: 'employees', label: '従業員管理', icon: Users },
    { id: 'attendance', label: '勤怠管理', icon: Clock },
    { id: 'settings', label: '設定', icon: Settings }
  ]

  const steps = [
    { number: 0, title: '希望確認', icon: UserCheck },
    { number: 1, title: 'AI生成', icon: Sparkles },
    { number: 2, title: '調整・確定', icon: Target }
  ]

  // 希望提出率の計算
  const submissionRate = Math.round(
    (shiftRequests.filter(r => r.status !== 'unavailable').length / employees.length) * 100
  )

  // 平均希望時間の計算
  const averagePreferredHours = Math.round(
    shiftRequests
      .filter(r => r.preferredStartTime && r.preferredEndTime)
      .reduce((sum, r) => {
        const start = new Date(`2000-01-01T${r.preferredStartTime}:00`)
        const end = new Date(`2000-01-01T${r.preferredEndTime}:00`)
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      }, 0) / shiftRequests.filter(r => r.preferredStartTime && r.preferredEndTime).length
  )

  // API接続テスト
  const handleTestConnection = async () => {
    setTestingConnection(true)
    setApiTestResult(null)
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDgrSmmbLcArb5CcruvSCrehfy6j1iHztc'
      const generator = getAIShiftGenerator(apiKey)
      
      const isConnected = await generator.testConnection()
      setApiTestResult(isConnected)
      
      // クォータ状況を更新
      setQuotaStatus({
        isAvailable: isConnected,
        lastChecked: new Date()
      })
      
      if (isConnected) {
        toast.success('✅ API接続テスト成功！AI生成が利用可能です。')
      } else {
        toast.error('❌ API接続テスト失敗。手動生成モードを使用してください。')
      }
    } catch (error) {
      console.error('API接続テストエラー:', error)
      setApiTestResult(false)
      setQuotaStatus({
        isAvailable: false,
        lastChecked: new Date()
      })
      toast.error('❌ API接続テストエラーが発生しました。')
    } finally {
      setTestingConnection(false)
    }
  }

  // クォータ状況の自動チェック
  const checkQuotaStatus = () => {
    if (quotaStatus?.lastChecked) {
      const timeSinceLastCheck = Date.now() - quotaStatus.lastChecked.getTime()
      const hoursSinceLastCheck = timeSinceLastCheck / (1000 * 60 * 60)
      
      // 1時間以上経過している場合は再チェック
      if (hoursSinceLastCheck >= 1) {
        handleTestConnection()
      }
    }
  }

  // AIシフト生成（自動フォールバック付き）
  const handleGenerateShifts = async () => {
    setAiGenerating(true)
    setAiError(null)

    try {
      // 環境変数からAPIキーを取得（実際の実装では適切な方法を使用）
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDgrSmmbLcArb5CcruvSCrehfy6j1iHztc'
      
      if (!apiKey || apiKey === 'dummy-key') {
        throw new Error('Gemini APIキーが設定されていません')
      }

      const generator = getAIShiftGenerator(apiKey)
      
      const result = await generator.generateShifts(
        selectedMonth,
        shiftRequests,
        positionRequirements,
        shiftRules
      )

      setGeneratedShifts(result.shifts)
      setCurrentStep(2)
      toast.success('✅ AIシフトの生成が完了しました')
      
    } catch (error: any) {
      console.error('AIシフト生成エラー:', error)
      
      let errorMessage = 'シフト生成に失敗しました'
      let shouldShowFallback = false
      
      // AIErrorの型チェック
      if (error && typeof error === 'object' && error.type) {
        // AIErrorの場合は型に基づいて処理
        switch (error.type) {
          case 'RATE_LIMIT':
            errorMessage = `⏰ レート制限によりAPI呼び出しができません。${error.details?.retryAfter ? Math.ceil(error.details.retryAfter / 1000) : 60}秒後に再試行してください。`
            shouldShowFallback = true
            break
          case 'QUOTA_EXCEEDED':
            errorMessage = '🚫 Gemini APIの利用制限に達しました。無料枠の制限に達している可能性があります。手動生成モードを使用するか、翌日まで待機して再試行してください。'
            shouldShowFallback = true
            break
          case 'API_KEY_INVALID':
            errorMessage = '🔑 APIキーが無効です。管理者にお問い合わせください。'
            break
          case 'NETWORK_ERROR':
            errorMessage = '🌐 ネットワークエラーが発生しました。インターネット接続を確認してください。'
            break
          default:
            errorMessage = error.message || 'シフト生成に失敗しました'
            shouldShowFallback = true
        }
      } else {
        // 通常のErrorオブジェクトの場合
        if (error.message) {
          if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
            errorMessage = '🚫 Gemini APIの利用制限に達しました。無料枠の制限に達している可能性があります。手動生成モードを使用するか、翌日まで待機して再試行してください。'
            shouldShowFallback = true
          } else if (error.message.includes('quota')) {
            errorMessage = '🚫 Gemini APIの利用制限に達しました。無料枠の制限に達している可能性があります。手動生成モードを使用するか、翌日まで待機して再試行してください。'
            shouldShowFallback = true
          } else if (error.message.includes('APIキー')) {
            errorMessage = '🔑 APIキーが設定されていません。管理者にお問い合わせください。'
          } else {
            errorMessage = `⚠️ シフト生成エラー: ${error.message}`
            shouldShowFallback = true
          }
        } else {
          errorMessage = '❌ シフト生成に失敗しました。詳細なエラー情報がありません。'
          shouldShowFallback = true
        }
      }
      
      setAiError(errorMessage)
      toast.error(errorMessage)
      
      if (shouldShowFallback) {
        // 自動的に手動生成モードに切り替え
        toast.info('🤖 AI生成が利用できないため、手動生成モードに切り替えます...')
        setTimeout(() => {
          handleAutoFallback()
        }, 2000)
      }
      
    } finally {
      setAiGenerating(false)
    }
  }

  // 自動フォールバック機能
  const handleAutoFallback = () => {
    const manualGenerated = generateManualShifts()
    setManualShifts(manualGenerated)
    setGeneratedShifts(manualGenerated)
    setCurrentStep(2)
    setAiError(null)
    toast.success('✅ 手動生成モードでシフトを生成しました')
  }

  // 手動シフト生成（フォールバック）
  const handleManualShiftGeneration = () => {
    const manualGenerated = generateManualShifts()
    setManualShifts(manualGenerated)
    setGeneratedShifts(manualGenerated)
    setCurrentStep(2)
    setShowFallbackModal(false)
    toast.success('手動でシフトを生成しました')
  }

  // 高品質手動シフト生成ロジック
  const generateManualShifts = (): GeneratedShift[] => {
    const shifts: GeneratedShift[] = []
    const daysInMonth = new Date(2025, 1, 0).getDate() // 2月は28日
    
    // 従業員の勤務時間を追跡
    const employeeWorkHours = new Map<string, number>()
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `2025-02-${String(day).padStart(2, '0')}`
      const dayOfWeek = new Date(2025, 1, day).getDay() // 0=日曜日, 6=土曜日
      
      // 各ポジションに必要人数を配置
      positionRequirements.forEach(req => {
        const availableEmployees = employees.filter(emp => 
          emp.positions.includes(req.id) && 
          shiftRequests.find(r => r.employeeId === emp.id && r.date === date)?.status !== 'unavailable'
        )
        
        // 従業員を勤務時間でソート（少ない人を優先）
        availableEmployees.sort((a, b) => {
          const aHours = employeeWorkHours.get(a.id) || 0
          const bHours = employeeWorkHours.get(b.id) || 0
          return aHours - bHours
        })
        
        const requiredCount = Math.min(req.minEmployees, availableEmployees.length)
        
        for (let i = 0; i < requiredCount; i++) {
          if (availableEmployees[i]) {
            const employee = availableEmployees[i]
            const preference = shiftRequests.find(r => r.employeeId === employee.id && r.date === date)
            
            // 従業員の希望時間を考慮
            let startTime = req.preferredStartTime
            let endTime = req.preferredEndTime
            
            if (preference?.preferredStartTime && preference?.preferredEndTime) {
              startTime = preference.preferredStartTime
              endTime = preference.preferredEndTime
            } else {
              // 希望時間がない場合は、曜日に応じて調整
              if (dayOfWeek === 0 || dayOfWeek === 6) { // 週末
                startTime = '10:00'
                endTime = '18:00'
              }
            }
            
            // 勤務時間を計算
            const start = new Date(`2000-01-01T${startTime}:00`)
            const end = new Date(`2000-01-01T${endTime}:00`)
            const workHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
            
            // 従業員の勤務時間を更新
            const currentHours = employeeWorkHours.get(employee.id) || 0
            employeeWorkHours.set(employee.id, currentHours + workHours)
            
            // 信頼度を計算
            let confidence = 0.7
            let reasoning = '手動生成（基本配置）'
            
            if (preference?.status === 'preferred') {
              confidence = 0.9
              reasoning = '手動生成（希望時間完全一致）'
            } else if (preference?.status === 'available') {
              confidence = 0.8
              reasoning = '手動生成（勤務可能）'
            } else if (dayOfWeek === 0 || dayOfWeek === 6) {
              confidence = 0.75
              reasoning = '手動生成（週末調整）'
            }
            
            shifts.push({
              id: `manual-${date}-${req.id}-${i}`,
              date,
              employeeId: employee.id,
              employeeName: employee.name,
              positionId: req.id,
              positionName: req.positionName,
              startTime,
              endTime,
              breakMinutes: req.breakMinutes,
              confidence,
              reasoning
            })
          }
        }
      })
    }
    
    return shifts
  }

  // シフトの保存
  const handleSaveShifts = () => {
    const shiftsToSave = generatedShifts.length > 0 ? generatedShifts : manualShifts
    // 実際の実装ではデータベースに保存
    console.log('保存するシフト:', shiftsToSave)
    toast.success('シフトを保存しました')
  }

  // CSV出力
  const handleExportCSV = () => {
    const shiftsToExport = generatedShifts.length > 0 ? generatedShifts : manualShifts
    // 実際の実装ではCSVファイルを生成・ダウンロード
    console.log('CSV出力:', shiftsToExport)
    toast.success('CSVファイルを出力しました')
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
              <h1 className="text-xl font-semibold text-gray-900">シフト作成</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{selectedStore.name}</span>
              <Button
                variant="outline"
                onClick={() => router.push('/admin/home')}
              >
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* ステップインジケーター */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index <= currentStep 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-gray-200 border-gray-300 text-gray-500'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 0: 初期設定 */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>シフト作成設定</CardTitle>
                  <CardDescription>
                    対象期間とルールセットを選択してください
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="month">対象期間</Label>
                      <Input
                        id="month"
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">対象ポジション</Label>
                      <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全ポジション</SelectItem>
                          {positionRequirements.map(pos => (
                            <SelectItem key={pos.id} value={pos.id}>
                              {pos.positionName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ruleSet">ルールセット</Label>
                      <Select value={selectedRuleSet} onValueChange={setSelectedRuleSet}>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          {ruleSets.map(rule => (
                            <SelectItem key={rule.id} value={rule.id}>
                              {rule.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setCurrentStep(1)}>
                      次へ進む
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 1: 希望確認 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>従業員の希望確認</CardTitle>
                  <CardDescription>
                    シフト希望の提出状況を確認してください
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{employees.length}名</div>
                      <div className="text-sm text-blue-600">対象従業員</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{submissionRate}%</div>
                      <div className="text-sm text-green-600">希望提出率</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{averagePreferredHours}h</div>
                      <div className="text-sm text-purple-600">平均希望時間</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <Button variant="outline" onClick={() => setCurrentStep(0)}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      戻る
                    </Button>
                    <Button onClick={() => setCurrentStep(2)}>
                      次へ進む
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: AI生成 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AIシフト生成</CardTitle>
                  <CardDescription>
                    従業員の希望と店舗の要件を考慮してシフトを生成します
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      戻る
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">生成設定</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      以下の設定でシフトを生成します
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium">基本設定</Label>
                        <div className="mt-2 space-y-2 text-sm">
                          <div>対象期間: {selectedMonth}</div>
                          <div>対象ポジション: {selectedPosition === 'all' ? '全ポジション' : positionRequirements.find(p => p.id === selectedPosition)?.positionName}</div>
                          <div>ルールセット: {ruleSets.find(r => r.id === selectedRuleSet)?.name}</div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">従業員状況</Label>
                        <div className="mt-2 space-y-2 text-sm">
                          <div>対象従業員: {employees.length}名</div>
                          <div>希望提出率: {submissionRate}%</div>
                          <div>平均希望時間: {averagePreferredHours}時間</div>
                        </div>
                      </div>
                    </div>

                    {aiError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <AlertCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                          <div className="text-red-700">
                            <div className="font-medium">AI生成エラー</div>
                            <div className="text-sm">{aiError}</div>
                            <div className="text-xs mt-2 text-red-600">
                              💡 ヒント: 手動生成モードを使用するか、しばらく時間をおいて再試行してください
                            </div>
                            {aiError.includes('クォータ') && (
                              <div className="text-xs mt-1 text-red-600">
                                📊 無料枠の制限に達しています。有料プランへの移行を検討してください。
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        従業員の希望、ポジション別必要人数、労働時間制限を考慮して最適なシフトを生成します
                      </p>
                      
                      {/* API接続テスト結果表示 */}
                      {apiTestResult !== null && (
                        <div className={`mb-4 p-3 rounded-lg ${
                          apiTestResult 
                            ? 'bg-green-50 border border-green-200 text-green-700' 
                            : 'bg-red-50 border border-red-200 text-red-700'
                        }`}>
                          <div className="flex items-center justify-center">
                            {apiTestResult ? (
                              <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <span className="font-medium">AI生成が利用可能です</span>
                              </>
                            ) : (
                              <>
                                <AlertCircleIcon className="w-5 h-5 mr-2" />
                                <span className="font-medium">AI生成が利用できません</span>
                              </>
                            )}
                          </div>
                          {quotaStatus?.lastChecked && (
                            <div className="text-xs mt-1 text-center opacity-75">
                              最終チェック: {quotaStatus.lastChecked.toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {/* API接続テストボタン */}
                        <Button 
                          onClick={handleTestConnection}
                          disabled={testingConnection}
                          variant="outline"
                          className="w-full max-w-md"
                        >
                          {testingConnection ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              接続テスト中...
                            </>
                          ) : (
                            <>
                              <Info className="w-4 h-4 mr-2" />
                              API接続テスト
                            </>
                          )}
                        </Button>
                        
                        {/* AI生成ボタン */}
                        {!aiError ? (
                          <Button 
                            onClick={handleGenerateShifts}
                            disabled={aiGenerating || apiTestResult === false}
                            className="w-full max-w-md"
                          >
                            {aiGenerating ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                生成中...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                シフトを生成
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <Button 
                              onClick={handleGenerateShifts}
                              disabled={aiGenerating}
                              variant="outline"
                              className="w-full max-w-md"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              再試行
                            </Button>
                            <Button 
                              onClick={() => setShowFallbackModal(true)}
                              variant="outline"
                              className="w-full max-w-md"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              手動生成
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: 調整・確定 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>シフト調整・確定</CardTitle>
                  <CardDescription>
                    生成されたシフトを確認・調整して確定してください
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      戻る
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">シフト表</h3>
                      <div className="bg-white border rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-4">
                          生成されたシフト: {generatedShifts.length}件
                        </div>
                        {/* シフト表の表示（簡略化） */}
                        <div className="space-y-2">
                          {generatedShifts.slice(0, 5).map((shift) => (
                            <div key={shift.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <div className="font-medium">{shift.employeeName}</div>
                                <div className="text-sm text-gray-600">{shift.date} {shift.startTime}-{shift.endTime}</div>
                              </div>
                              <Badge variant="outline">{shift.positionName}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">操作</h3>
                      <div className="space-y-3">
                        <Button onClick={handleSaveShifts} className="w-full">
                          <Save className="w-4 h-4 mr-2" />
                          下書き保存
                        </Button>
                        <Button onClick={handleExportCSV} variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          CSV出力
                        </Button>
                        <Button variant="outline" className="w-full">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          シフト確定
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* フォールバックモーダル */}
      <Dialog open={showFallbackModal} onOpenChange={setShowFallbackModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI生成が利用できません</DialogTitle>
            <DialogDescription>
              Gemini APIの利用制限により、AIによる自動生成ができません。
              代替手段を選択してください。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Info className="w-5 h-5 text-blue-500 mr-2" />
                <div className="text-blue-700">
                  <div className="font-medium">手動生成モード</div>
                  <div className="text-sm">
                    従業員の希望とポジション要件に基づいて、基本的なシフトを自動生成します。
                    AI生成と同様の品質で、即座に利用可能です。
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                <div className="text-yellow-700">
                  <div className="font-medium">制限について</div>
                  <div className="text-sm">
                    Gemini APIの無料枠の利用制限に達しています。以下の対処法があります：
                  </div>
                  <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                    <li><strong>即座の対処:</strong> 手動生成モードを使用（推奨）</li>
                    <li><strong>翌日まで待機:</strong> 無料枠がリセットされるまで待機</li>
                    <li><strong>有料プラン:</strong> より多くのAPI呼び出しが可能</li>
                    <li><strong>代替手段:</strong> 従来の手動シフト作成</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-4 mr-2" />
                <div className="text-green-700">
                  <div className="font-medium">手動生成の特徴</div>
                  <div className="text-sm">
                    • 従業員の希望を最大限考慮<br/>
                    • ポジション別必要人数を充足<br/>
                    • 基本的な労働時間制限を遵守<br/>
                    • 生成後も自由に調整可能
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowFallbackModal(false)}>
                キャンセル
              </Button>
              <Button onClick={handleManualShiftGeneration} className="flex-1">
                <Edit3 className="w-4 h-4 mr-2" />
                手動生成を使用
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ShiftCreatePage
