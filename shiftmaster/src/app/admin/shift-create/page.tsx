'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { getAIShiftGenerator, type EmployeePreference, type PositionRequirement, type ShiftRule, type GeneratedShift, type AIGenerationResult } from '@/lib/ai-shift-generator'
import { ShiftCalendar } from '@/components/ShiftCalendar'

interface ShiftPreference {
  employee_id: string
  date: string
  available: boolean
  preferred_start?: string
  preferred_end?: string
  priority?: 'high' | 'medium' | 'low'
  reason?: string
}

interface Employee {
  id: string
  name: string
  employeeCode: string
  position: string
  status: 'active' | 'inactive'
}

interface ShiftPeriod {
  id: string
  name: string
  start_date: string
  end_date: string
  status: 'draft' | 'collecting' | 'generating' | 'published' | 'finalized'
  submission_deadline: string
}

interface Shift {
  id: string
  employee_id: string
  date: string
  start_time: string
  end_time: string
  position: string
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
}

export default function ShiftCreatePage() {
  const [currentStep, setCurrentStep] = useState(-1) // -1: 初期設定, 0: 希望確認, 1: AI生成, 2: 調整・確定
  const [selectedRuleSet, setSelectedRuleSet] = useState('')
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  const [shiftPeriod, setShiftPeriod] = useState<ShiftPeriod | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [shiftPreferences, setShiftPreferences] = useState<{ [key: string]: ShiftPreference[] }>({})
  const [generatedShifts, setGeneratedShifts] = useState<GeneratedShift[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedView, setSelectedView] = useState<'shifts' | 'staffing' | 'csv'>('shifts')
  const [editingShift, setEditingShift] = useState<GeneratedShift | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [aiGenerationResult, setAiGenerationResult] = useState<AIGenerationResult | null>(null)
  const [isShiftsConfirmed, setIsShiftsConfirmed] = useState(false) // シフト確定状態
  const [confirmationComment, setConfirmationComment] = useState('') // 確定時のコメント
  const [selectedDate, setSelectedDate] = useState<string | null>(null) // 選択された日付

  // モックデータ
  const positions = ['ホール', 'キッチン', 'レジ']
  useEffect(() => {
    setEmployees([
      { id: '1', name: '佐藤太郎', employeeCode: 'E001', position: 'ホール', status: 'active' },
      { id: '2', name: '鈴木花子', employeeCode: 'E002', position: 'キッチン', status: 'active' },
      { id: '3', name: '田中一郎', employeeCode: 'E003', position: 'レジ', status: 'active' },
      { id: '4', name: '高橋美咲', employeeCode: 'E004', position: 'ホール', status: 'active' },
      { id: '5', name: '伊藤健太', employeeCode: 'E005', position: 'キッチン', status: 'active' }
    ])

    setShiftPeriod({
      id: '1',
      name: '2025年2月',
      start_date: '2025-02-01',
      end_date: '2025-02-28',
      status: 'collecting',
      submission_deadline: '2025-01-25T23:59:59Z'
    })

    // モックのシフト希望データ
    const mockPreferences: { [key: string]: ShiftPreference[] } = {}
    for (let i = 1; i <= 28; i++) {
      const date = `2025-02-${i.toString().padStart(2, '0')}`
      mockPreferences[date] = employees.map(emp => ({
        employee_id: emp.id, // 従業員IDを追加
        date,
        available: Math.random() > 0.3,
        preferred_start: Math.random() > 0.5 ? '09:00' : '10:00',
        preferred_end: Math.random() > 0.5 ? '17:00' : '18:00',
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low'
      }))
    }
    setShiftPreferences(mockPreferences)
  }, [])

  const ruleSets = [
    { id: 'normal', name: '通常期', description: '標準配置', color: 'bg-blue-500' },
    { id: 'busy', name: '繁忙期', description: '増員体制', color: 'bg-orange-500' },
    { id: 'quiet', name: '閑散期', description: '少人数', color: 'bg-green-500' }
  ]

  // AIシフト生成の設定
  const aiShiftRules: ShiftRule = {
    maxConsecutiveDays: 6,
    minRestHours: 11,
    preferredShiftPattern: 'mixed',
    avoidOvertime: true,
    balanceWorkload: true,
    considerPreferences: true,
            aiModel: 'gemini-1.5-pro',
    temperature: 0.7
  }



  const handlePositionToggle = (position: string) => {
    setSelectedPositions(prev => 
      prev.includes(position) 
        ? prev.filter(p => p !== position)
        : [...prev, position]
    )
  }

  const handleRuleSetSelect = (ruleSetId: string) => {
    setSelectedRuleSet(ruleSetId)
    setCurrentStep(0)
  }

  const handleGenerateShifts = async () => {
    setIsGenerating(true)
    
    try {
      // 従業員の希望をAI用の形式に変換
      const employeePreferences: EmployeePreference[] = []
      Object.entries(shiftPreferences).forEach(([date, preferences]) => {
        preferences.forEach(pref => {
          const employee = employees.find(emp => emp.id === pref.employee_id)
          if (employee) {
            employeePreferences.push({
              id: `${date}-${employee.id}`,
              employeeId: employee.id,
              employeeName: employee.name,
              date,
              status: pref.available ? 'available' : 'unavailable',
              preferredStartTime: pref.preferred_start,
              preferredEndTime: pref.preferred_end,
              notes: pref.reason
            })
          }
        })
      })

      // ポジション要件を設定
      const positionRequirements: PositionRequirement[] = [
        {
          id: '1',
          positionName: 'ホール',
          minEmployees: 2,
          maxEmployees: 4,
          preferredStartTime: '09:00',
          preferredEndTime: '17:00',
          breakMinutes: 60
        },
        {
          id: '2',
          positionName: 'キッチン',
          minEmployees: 1,
          maxEmployees: 3,
          preferredStartTime: '08:00',
          preferredEndTime: '18:00',
          breakMinutes: 60
        },
        {
          id: '3',
          positionName: 'レジ',
          minEmployees: 1,
          maxEmployees: 2,
          preferredStartTime: '09:00',
          preferredEndTime: '17:00',
          breakMinutes: 60
        }
      ]

      // AIシフト生成を実行
      const generator = getAIShiftGenerator(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'demo-key')
      const result = await generator.generateShifts(
        shiftPeriod?.name || '2025年2月',
        employeePreferences,
        positionRequirements,
        aiShiftRules
      )

      setGeneratedShifts(result.shifts)
      setAiGenerationResult(result)
      setCurrentStep(2)
      toast.success('AIシフト生成が完了しました！')
      
      // 結果の詳細を表示
      console.log('AI生成結果:', result)
      
    } catch (error) {
      console.error('AIシフト生成エラー:', error)
      toast.error('AIシフト生成に失敗しました。しばらく時間をおいて再試行してください。')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShiftEdit = (shift: GeneratedShift) => {
    setEditingShift(shift)
    setEditModalOpen(true)
  }

  const handleShiftSave = (updatedShift: GeneratedShift) => {
    setGeneratedShifts(prev => 
      prev.map(s => s.id === updatedShift.id ? updatedShift : s)
    )
    setEditModalOpen(false)
    toast.success('シフトを更新しました')
  }

  // シフト削除ハンドラー
  const handleShiftDelete = (shift: GeneratedShift) => {
    setGeneratedShifts(prev => prev.filter(s => s.id !== shift.id))
    setEditModalOpen(false)
    setEditingShift(null)
    toast.success('シフトを削除しました')
  }

  // シフトコピーハンドラー
  const handleShiftCopy = (shift: GeneratedShift) => {
    const newShift: GeneratedShift = {
      ...shift,
      id: `copy-${Date.now()}`,
      date: shift.date, // 同じ日付にコピー
      reasoning: `${shift.reasoning} (コピー)`
    }
    setGeneratedShifts(prev => [...prev, newShift])
    toast.success('シフトをコピーしました')
  }

  // 勤務時間計算関数
  const calculateWorkHours = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    
    if (end < start) {
      end.setDate(end.getDate() + 1) // 日をまたぐ場合
    }
    
    const diffMs = end.getTime() - start.getTime()
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100
  }

  const handleSaveDraft = () => {
    toast.success('下書きを保存しました')
  }

  const handleFinalizeShifts = () => {
    toast.success('シフトを確定しました！')
  }

  const getSubmissionRate = () => {
    const totalDays = 28
    const submittedDays = Object.values(shiftPreferences).filter(prefs => 
      prefs.some(pref => pref.available !== undefined)
    ).length
    return Math.round((submittedDays / totalDays) * 100)
  }

  const getDateRange = () => {
    if (!shiftPeriod) return []
    const start = new Date(shiftPeriod.start_date)
    const end = new Date(shiftPeriod.end_date)
    const dates = []
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0])
    }
    return dates
  }

  // シフト確定ハンドラー
  const handleConfirmShifts = () => {
    if (generatedShifts.length === 0) {
      toast.error('確定するシフトがありません')
      return
    }

    if (!confirmationComment.trim()) {
      toast.error('確定コメントを入力してください')
      return
    }

    // シフト確定処理
    setIsShiftsConfirmed(true)
    toast.success('シフトを確定しました！従業員に通知されます。')
    
    // 確定後の処理（実際の実装ではAPI呼び出し）
    console.log('シフト確定:', {
      shifts: generatedShifts,
      comment: confirmationComment,
      confirmedAt: new Date().toISOString()
    })
  }

  // シフト確定解除ハンドラー
  const handleUnconfirmShifts = () => {
    setIsShiftsConfirmed(false)
    setConfirmationComment('')
    toast.success('シフト確定を解除しました。編集可能になります。')
  }

  // 確定後のシフト保護チェック
  const isShiftEditable = (shift: GeneratedShift) => {
    return !isShiftsConfirmed
  }

  if (currentStep === -1) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">シフト作成</h1>
          <Button onClick={() => setCurrentStep(0)}>今月のシフトを作成</Button>
        </div>

        {/* 下書きパネル */}
        <Card>
          <CardHeader>
            <CardTitle>下書き</CardTitle>
            <CardDescription>保存された下書きがある場合は再開できます</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">2025年2月-通常期-ホール</p>
                <p className="text-sm text-gray-500">保存: 1/28 14:30</p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">再開</Button>
                <Button variant="destructive" size="sm">削除</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ポジション選択 */}
        <Card>
          <CardHeader>
            <CardTitle>対象ポジション</CardTitle>
            <CardDescription>シフト作成対象のポジションを選択してください</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedPositions.length === 0 ? "default" : "outline"}
                onClick={() => setSelectedPositions([])}
              >
                全ポジション
              </Button>
              {positions.map(position => (
                <Button
                  key={position}
                  variant={selectedPositions.includes(position) ? "default" : "outline"}
                  onClick={() => handlePositionToggle(position)}
                >
                  {position}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ルールセット選択 */}
        <Card>
          <CardHeader>
            <CardTitle>ルールセット選択</CardTitle>
            <CardDescription>シフト作成に適用するルールを選択してください</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ruleSets.map(ruleSet => (
                <Card key={ruleSet.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className={`w-4 h-4 rounded-full ${ruleSet.color} mb-3`}></div>
                    <h3 className="font-semibold text-lg mb-2">{ruleSet.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{ruleSet.description}</p>
                    <Button 
                      className="w-full"
                      onClick={() => handleRuleSetSelect(ruleSet.id)}
                    >
                      選択
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === 0) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">シフト希望確認</h1>
            <p className="text-gray-600">従業員のシフト希望提出状況を確認してください</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setCurrentStep(-1)}>戻る</Button>
            <Button onClick={() => setCurrentStep(1)}>次へ</Button>
          </div>
        </div>

        {/* 提出状況サマリー */}
        <Card>
          <CardHeader>
            <CardTitle>提出状況サマリー</CardTitle>
            <CardDescription>対象期間: {shiftPeriod?.start_date} 〜 {shiftPeriod?.end_date}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-2xl font-bold">{getSubmissionRate()}%</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getSubmissionRate()}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
                <div className="text-sm text-gray-600">対象従業員</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{getSubmissionRate()}%</div>
                <div className="text-sm text-gray-600">提出率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">28日</div>
                <div className="text-sm text-gray-600">対象期間</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{selectedPositions.length || '全'}</div>
                <div className="text-sm text-gray-600">対象ポジション</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 従業員×日付マトリクス */}
        <Card>
          <CardHeader>
            <CardTitle>従業員別希望提出状況</CardTitle>
            <CardDescription>各従業員の日別希望を確認できます</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-50 sticky left-0 z-10">従業員</th>
                    {getDateRange().map(date => (
                      <th key={date} className="border p-2 bg-gray-50 text-xs">
                        {new Date(date).getDate()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    <tr key={employee.id}>
                      <td className="border p-2 bg-gray-50 sticky left-0 z-10 font-medium">
                        {employee.name}
                      </td>
                      {getDateRange().map(date => {
                        const preference = shiftPreferences[date]?.find(p => p.date === date)
                        const isAvailable = preference?.available
                        const hasPreference = preference !== undefined
                        
                        return (
                          <td key={date} className="border p-2 text-center">
                            {hasPreference ? (
                              <div className={`w-4 h-4 mx-auto rounded-full ${
                                isAvailable ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                            ) : (
                              <div className="w-4 h-4 mx-auto rounded-full bg-gray-300"></div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2"></span>勤務可能
                <span className="inline-block w-4 h-4 bg-red-500 rounded-full mx-4 mr-2"></span>勤務不可
                <span className="inline-block w-4 h-4 bg-gray-300 rounded-full mx-4 mr-2"></span>未提出
              </div>
              <Button variant="outline">CSV出力</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === 1) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AIシフト生成</h1>
            <p className="text-gray-600">従業員の希望と店舗の要件を考慮してシフトを生成します</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setCurrentStep(0)}>戻る</Button>
          </div>
        </div>

        {/* 生成設定サマリー */}
        <Card>
          <CardHeader>
            <CardTitle>生成設定</CardTitle>
            <CardDescription>以下の設定でシフトを生成します</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">基本設定</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>対象期間:</span>
                    <span>{shiftPeriod?.start_date} 〜 {shiftPeriod?.end_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>対象ポジション:</span>
                    <span>{selectedPositions.length > 0 ? selectedPositions.join(', ') : '全ポジション'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ルールセット:</span>
                    <span>{ruleSets.find(r => r.id === selectedRuleSet)?.name}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">従業員状況</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>対象従業員:</span>
                    <span>{employees.length}名</span>
                  </div>
                  <div className="flex justify-between">
                    <span>希望提出率:</span>
                    <span>{getSubmissionRate()}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>平均希望時間:</span>
                    <span>8時間</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 生成ボタン */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">シフトを生成しますか？</h3>
              <p className="text-gray-600">従業員の希望、ポジション別必要人数、労働時間制限を考慮して最適なシフトを生成します</p>
            </div>
            <Button 
              size="lg" 
              onClick={handleGenerateShifts}
              disabled={isGenerating}
              className="px-8"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  生成中...
                </>
              ) : (
                'シフトを生成'
              )}
            </Button>
            {isGenerating && (
              <p className="text-sm text-gray-500 mt-2">通常1-3分程度かかります</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === 2) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">シフト調整・確定</h1>
            <p className="text-gray-600">生成されたシフトを確認・調整して確定してください</p>
          </div>
          
          {/* シフト確定状態表示 */}
          {isShiftsConfirmed && (
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-600">
                ✅ 確定済み
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUnconfirmShifts}
              >
                確定解除
              </Button>
            </div>
          )}
        </div>

        {/* 確定状態の警告 */}
        {isShiftsConfirmed && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-orange-800">
                <span className="text-lg">⚠️</span>
                <div>
                  <p className="font-medium">シフトが確定されています</p>
                  <p className="text-sm">編集する場合は先に確定解除を行ってください</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI生成結果サマリー */}
        {aiGenerationResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                シフト調整・確定
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    AI信頼度: {aiGenerationResult.summary.averageConfidence}%
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>
                生成されたシフトを調整し、確定してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI生成結果サマリー */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-green-600">
                      {aiGenerationResult.summary.totalShifts}
                    </div>
                    <div className="text-sm text-muted-foreground">生成シフト数</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {aiGenerationResult.summary.preferenceSatisfaction}%
                    </div>
                    <div className="text-sm text-muted-foreground">従業員満足度</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {aiGenerationResult.summary.ruleCompliance}%
                    </div>
                    <div className="text-sm text-muted-foreground">ルール準拠率</div>
                  </CardContent>
                </Card>
              </div>

              {/* 警告・提案 */}
              <div className="space-y-3">
                {aiGenerationResult.warnings.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">⚠️ 注意事項</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {aiGenerationResult.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiGenerationResult.suggestions.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">💡 改善提案</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {aiGenerationResult.suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ビュータブ */}
        <Card>
          <CardHeader>
            <CardTitle>シフト表示</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="shifts" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="shifts">シフト表</TabsTrigger>
                <TabsTrigger value="staffing">人員配置</TabsTrigger>
                <TabsTrigger value="summary">サマリー</TabsTrigger>
                <TabsTrigger value="calendar">カレンダー</TabsTrigger>
              </TabsList>

              <TabsContent value="shifts" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 p-2 text-left">従業員</th>
                        {Array.from({ length: 28 }, (_, i) => (
                          <th key={i + 1} className="border border-gray-200 p-2 text-center">
                            {i + 1}日
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp.id}>
                          <td className="border border-gray-200 p-2 font-medium">
                            {emp.name}
                          </td>
                          {Array.from({ length: 28 }, (_, i) => {
                            const shift = generatedShifts.find(
                              s => s.employeeId === emp.id && s.date === `2025-02-${String(i + 1).padStart(2, '0')}`
                            )
                            return (
                              <td 
                                key={i + 1} 
                                className={`border border-gray-200 p-2 text-center cursor-pointer hover:bg-gray-50 ${
                                  shift ? 'bg-blue-50' : ''
                                } ${shift && !isShiftEditable(shift) ? 'opacity-50' : ''}`}
                                onClick={() => shift && isShiftEditable(shift) && handleShiftEdit(shift)}
                              >
                                {shift ? (
                                  <div className="text-xs">
                                    <div className="font-medium">{shift.startTime}</div>
                                    <div className="text-gray-500">{shift.endTime}</div>
                                    <div className="text-gray-400">{shift.positionName}</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="staffing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {positions.map((position) => (
                    <Card key={position}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full bg-blue-500"
                          ></div>
                          <span>{position}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Array.from({ length: 28 }, (_, i) => {
                            const dayShifts = generatedShifts.filter(
                              s => s.date === `2025-02-${String(i + 1).padStart(2, '0')}` && 
                                   s.positionName === position
                            )
                            const requiredCount = 2 // モックデータ
                            return (
                              <div key={i + 1} className="flex justify-between text-sm">
                                <span>{i + 1}日</span>
                                <span className={`font-medium ${
                                  dayShifts.length >= requiredCount ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {dayShifts.length}/{requiredCount}名
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">従業員別勤務時間</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {employees.map((emp) => {
                          const empShifts = generatedShifts.filter(s => s.employeeId === emp.id)
                          const totalHours = empShifts.reduce((total, shift) => {
                            const start = new Date(`2000-01-01T${shift.startTime}:00`)
                            const end = new Date(`2000-01-01T${shift.endTime}:00`)
                            if (end < start) end.setDate(end.getDate() + 1)
                            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                            return total + hours - (shift.breakMinutes / 60)
                          }, 0)
                          
                          return (
                            <div key={emp.id} className="flex justify-between">
                              <span>{emp.name}</span>
                              <span className="font-medium">{totalHours.toFixed(1)}時間</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">日別必要人数</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Array.from({ length: 28 }, (_, i) => {
                          const day = i + 1
                          const totalRequired = positions.length * 2 // 各ポジション2名必要
                          const totalAssigned = generatedShifts.filter(
                            s => s.date === `2025-02-${String(i + 1).padStart(2, '0')}`
                          ).length
                          
                          return (
                            <div key={day} className="flex justify-between">
                              <span>{day}日</span>
                              <span className={`font-medium ${
                                totalAssigned >= totalRequired ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {totalAssigned}/{totalRequired}名
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4">
                <ShiftCalendar
                  shifts={generatedShifts}
                  onShiftClick={(shift) => {
                    if (isShiftEditable(shift)) {
                      handleShiftEdit(shift)
                    }
                  }}
                  onDateClick={(date) => {
                    setSelectedDate(date)
                  }}
                  isEditable={!isShiftsConfirmed}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 確定コメント入力 */}
        <Card>
          <CardHeader>
            <CardTitle>シフト確定</CardTitle>
            <CardDescription>
              シフトを確定する前にコメントを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirmation-comment">確定コメント</Label>
              <Textarea
                id="confirmation-comment"
                placeholder="シフト確定時のコメントを入力してください（例：2月シフト確定、従業員希望を最大限考慮）"
                value={confirmationComment}
                onChange={(e) => setConfirmationComment(e.target.value)}
                disabled={isShiftsConfirmed}
              />
            </div>

            {/* アクションボタン */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  disabled={isShiftsConfirmed}
                >
                  戻る
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerateShifts}
                  disabled={isShiftsConfirmed}
                >
                  再生成
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // 下書き保存処理
                    toast.success('下書きを保存しました')
                  }}
                  disabled={isShiftsConfirmed}
                >
                  下書き保存
                </Button>
                
                {!isShiftsConfirmed ? (
                  <Button
                    onClick={handleConfirmShifts}
                    disabled={!confirmationComment.trim() || generatedShifts.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    🎯 シフト確定
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleUnconfirmShifts}
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    🔓 確定解除
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* シフト編集モーダル */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                シフト編集 - {editingShift?.employeeName}
              </DialogTitle>
              <DialogDescription>
                {editingShift?.date} | AI信頼度: {editingShift?.confidence}%
              </DialogDescription>
            </DialogHeader>
            
            {editingShift && (
              <div className="grid grid-cols-3 gap-4">
                {/* 基本情報 */}
                <div className="space-y-4">
                  <div>
                    <Label>従業員</Label>
                    <Select 
                      value={editingShift.employeeId} 
                      onValueChange={(value) => setEditingShift({
                        ...editingShift,
                        employeeId: value,
                        employeeName: employees.find(emp => emp.id === value)?.name || ''
                      })}
                      disabled={!isShiftEditable(editingShift)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>ポジション</Label>
                    <Select 
                      value={editingShift.positionName} 
                      onValueChange={(value) => setEditingShift({
                        ...editingShift,
                        positionName: value
                      })}
                      disabled={!isShiftEditable(editingShift)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>開始時間</Label>
                    <Input
                      type="time"
                      value={editingShift.startTime}
                      onChange={(e) => setEditingShift({
                        ...editingShift,
                        startTime: e.target.value
                      })}
                      disabled={!isShiftEditable(editingShift)}
                    />
                  </div>
                  
                  <div>
                    <Label>終了時間</Label>
                    <Input
                      type="time"
                      value={editingShift.endTime}
                      onChange={(e) => setEditingShift({
                        ...editingShift,
                        endTime: e.target.value
                      })}
                      disabled={!isShiftEditable(editingShift)}
                    />
                  </div>
                  
                  <div>
                    <Label>休憩時間（分）</Label>
                    <Input
                      type="number"
                      min="0"
                      max="120"
                      value={editingShift.breakMinutes}
                      onChange={(e) => setEditingShift({
                        ...editingShift,
                        breakMinutes: parseInt(e.target.value) || 0
                      })}
                      disabled={!isShiftEditable(editingShift)}
                    />
                  </div>
                </div>

                {/* 勤務時間計算 */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">勤務時間計算</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>総勤務時間</span>
                      <span className="font-medium">
                        {calculateWorkHours(editingShift.startTime, editingShift.endTime)}時間
                      </span>
                    </div>
                    
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                      <span>実働時間</span>
                      <span className="font-medium">
                        {calculateWorkHours(editingShift.startTime, editingShift.endTime) - (editingShift.breakMinutes / 60)}時間
                      </span>
                    </div>
                    
                    <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                      <span>残業時間</span>
                      <span className="font-medium">
                        {Math.max(0, calculateWorkHours(editingShift.startTime, editingShift.endTime) - (editingShift.breakMinutes / 60) - 8)}時間
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium mb-2">AI生成理由</h4>
                    <Textarea
                      value={editingShift.reasoning}
                      onChange={(e) => setEditingShift({
                        ...editingShift,
                        reasoning: e.target.value
                      })}
                      disabled={!isShiftEditable(editingShift)}
                      placeholder="AIがこのシフトを生成した理由..."
                    />
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">アクション</h3>
                  
                  <div className="space-y-2">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleShiftDelete(editingShift)}
                      disabled={!isShiftEditable(editingShift)}
                    >
                      🗑️ 削除
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleShiftCopy(editingShift)}
                      disabled={!isShiftEditable(editingShift)}
                    >
                      📋 コピー
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setEditModalOpen(false)}
                    >
                      ❌ キャンセル
                    </Button>
                    
                    <Button
                      className="w-full"
                      onClick={() => handleShiftSave(editingShift)}
                      disabled={!isShiftEditable(editingShift)}
                    >
                      💾 保存
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return null
}
