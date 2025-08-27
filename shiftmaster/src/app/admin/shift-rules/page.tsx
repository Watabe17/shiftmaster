'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Settings, Users, Clock, Target, Brain, Save, Plus, Trash2 } from 'lucide-react'

// 型定義
interface RuleSet {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface PositionRule {
  id: string
  ruleSetId: string
  positionId: string
  positionName: string
  minEmployees: number
  maxEmployees: number
  preferredStartTime: string
  preferredEndTime: string
  breakMinutes: number
  color: string
}

interface AIRule {
  id: string
  ruleSetId: string
  maxConsecutiveDays: number
  minRestHours: number
  preferredShiftPattern: 'morning' | 'afternoon' | 'evening' | 'mixed'
  avoidOvertime: boolean
  balanceWorkload: boolean
  considerPreferences: boolean
  aiModel: 'gemini-pro' | 'gemini-flash'
  temperature: number
}

export default function ShiftRulesPage() {
  const [activeTab, setActiveTab] = useState('rulesets')
  const [ruleSets, setRuleSets] = useState<RuleSet[]>([])
  const [positionRules, setPositionRules] = useState<PositionRule[]>([])
  const [aiRules, setAiRules] = useState<AIRule[]>([])
  const [selectedRuleSet, setSelectedRuleSet] = useState<RuleSet | null>(null)
  const [isCreatingRuleSet, setIsCreatingRuleSet] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<RuleSet>>({})
  const [isSaving, setIsSaving] = useState(false)

  // モックデータ
  useEffect(() => {
    setRuleSets([
      {
        id: '1',
        name: '標準ルールセット',
        description: '一般的な店舗運営に適したルールセット',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        name: '繁忙期ルールセット',
        description: '繁忙期の効率的な運営のためのルールセット',
        isActive: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10'
      }
    ])

    setPositionRules([
      {
        id: '1',
        ruleSetId: '1',
        positionId: '1',
        positionName: '店員',
        minEmployees: 2,
        maxEmployees: 5,
        preferredStartTime: '09:00',
        preferredEndTime: '17:00',
        breakMinutes: 60,
        color: '#3B82F6'
      },
      {
        id: '2',
        ruleSetId: '1',
        positionId: '2',
        positionName: 'レジ担当',
        minEmployees: 1,
        maxEmployees: 2,
        preferredStartTime: '08:00',
        preferredEndTime: '18:00',
        breakMinutes: 60,
        color: '#10B981'
      }
    ])

    setAiRules([
      {
        id: '1',
        ruleSetId: '1',
        maxConsecutiveDays: 6,
        minRestHours: 11,
        preferredShiftPattern: 'mixed',
        avoidOvertime: true,
        balanceWorkload: true,
        considerPreferences: true,
        aiModel: 'gemini-pro',
        temperature: 0.7
      }
    ])
  }, [])

  const handleCreateRuleSet = () => {
    setIsCreatingRuleSet(true)
    setEditForm({
      name: '',
      description: '',
      isActive: true
    })
  }

  const handleEditRuleSet = (ruleSet: RuleSet) => {
    setSelectedRuleSet(ruleSet)
    setEditForm({
      name: ruleSet.name,
      description: ruleSet.description,
      isActive: ruleSet.isActive
    })
    setIsEditing(true)
  }

  const handleSaveRuleSet = async () => {
    setIsSaving(true)
    
    // 保存処理のシミュレーション
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isCreatingRuleSet) {
      const newRuleSet: RuleSet = {
        id: Date.now().toString(),
        name: editForm.name || '',
        description: editForm.description || '',
        isActive: editForm.isActive || false,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      setRuleSets(prev => [...prev, newRuleSet])
      setIsCreatingRuleSet(false)
    } else if (selectedRuleSet) {
      setRuleSets(prev => prev.map(rs => 
        rs.id === selectedRuleSet.id 
          ? { ...rs, ...editForm, updatedAt: new Date().toISOString().split('T')[0] }
          : rs
      ))
      setIsEditing(false)
    }
    
    setEditForm({})
    setIsSaving(false)
  }

  const handleCancel = () => {
    setIsCreatingRuleSet(false)
    setIsEditing(false)
    setEditForm({})
    setSelectedRuleSet(null)
  }

  const handleDeleteRuleSet = (ruleSetId: string) => {
    if (confirm('このルールセットを削除しますか？')) {
      setRuleSets(prev => prev.filter(rs => rs.id !== ruleSetId))
      setPositionRules(prev => prev.filter(pr => pr.ruleSetId !== ruleSetId))
      setAiRules(prev => prev.filter(ar => ar.ruleSetId !== ruleSetId))
    }
  }

  const toggleRuleSetStatus = (ruleSetId: string) => {
    setRuleSets(prev => prev.map(rs => 
      rs.id === ruleSetId 
        ? { ...rs, isActive: !rs.isActive, updatedAt: new Date().toISOString().split('T')[0] }
        : rs
    ))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">シフトルール設定</h1>
          <p className="text-gray-600">AIシフト生成のためのルールとパラメータを管理</p>
        </div>
        <Button onClick={handleCreateRuleSet} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新規ルールセット
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rulesets" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            ルールセット
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            ポジション別ルール
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI設定
          </TabsTrigger>
        </TabsList>

        {/* ルールセットタブ */}
        <TabsContent value="rulesets" className="space-y-6">
          {/* ルールセット一覧 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                ルールセット一覧
              </CardTitle>
              <CardDescription>
                シフト生成に使用するルールセットを管理できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ruleSets.map(ruleSet => (
                  <div
                    key={ruleSet.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{ruleSet.name}</h3>
                          <Badge variant={ruleSet.isActive ? 'default' : 'secondary'}>
                            {ruleSet.isActive ? '有効' : '無効'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{ruleSet.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          更新日: {ruleSet.updatedAt}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={ruleSet.isActive}
                        onCheckedChange={() => toggleRuleSetStatus(ruleSet.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRuleSet(ruleSet)}
                      >
                        編集
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRuleSet(ruleSet.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ルールセット作成・編集モーダル */}
          {(isCreatingRuleSet || isEditing) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-2xl mx-4">
                <CardHeader>
                  <CardTitle>
                    {isCreatingRuleSet ? '新規ルールセット作成' : 'ルールセット編集'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">ルールセット名</Label>
                    <Input
                      id="name"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="例: 標準ルールセット"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">説明</Label>
                    <Textarea
                      id="description"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="このルールセットの用途や特徴を説明してください"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={editForm.isActive || false}
                      onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">有効にする</Label>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveRuleSet} disabled={isSaving}>
                      {isSaving ? '保存中...' : '保存'}
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      キャンセル
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ポジション別ルールタブ */}
        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                ポジション別ルール
              </CardTitle>
              <CardDescription>
                各ポジションの必要人数、勤務時間、休憩時間を設定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positionRules.map(rule => (
                  <div
                    key={rule.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">ポジション</Label>
                        <p className="font-medium">{rule.positionName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">必要人数</Label>
                        <p className="font-medium">{rule.minEmployees} - {rule.maxEmployees}名</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">推奨時間</Label>
                        <p className="font-medium">{rule.preferredStartTime} - {rule.preferredEndTime}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">休憩時間</Label>
                        <p className="font-medium">{rule.breakMinutes}分</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI設定タブ */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AIシフト生成設定
              </CardTitle>
              <CardDescription>
                Google Gemini APIを使用したシフト生成のパラメータを設定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aiRules.map(rule => (
                  <div key={rule.id} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">最大連続勤務日数</Label>
                        <Input
                          type="number"
                          value={rule.maxConsecutiveDays}
                          onChange={(e) => {
                            setAiRules(prev => prev.map(ar => 
                              ar.id === rule.id 
                                ? { ...ar, maxConsecutiveDays: parseInt(e.target.value) || 0 }
                                : ar
                            ))
                          }}
                          min="1"
                          max="7"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">最小休息時間</Label>
                        <Input
                          type="number"
                          value={rule.minRestHours}
                          onChange={(e) => {
                            setAiRules(prev => prev.map(ar => 
                              ar.id === rule.id 
                                ? { ...ar, minRestHours: parseInt(e.target.value) || 0 }
                                : ar
                            ))
                          }}
                          min="8"
                          max="24"
                        />
                        <span className="text-xs text-gray-500 ml-2">時間</span>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">推奨シフトパターン</Label>
                        <Select
                          value={rule.preferredShiftPattern}
                          onValueChange={(value: 'morning' | 'afternoon' | 'evening' | 'mixed') => {
                            setAiRules(prev => prev.map(ar => 
                              ar.id === rule.id 
                                ? { ...ar, preferredShiftPattern: value }
                                : ar
                            ))
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">朝シフト重視</SelectItem>
                            <SelectItem value="afternoon">昼シフト重視</SelectItem>
                            <SelectItem value="evening">夜シフト重視</SelectItem>
                            <SelectItem value="mixed">バランス重視</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">AIモデル</Label>
                        <Select
                          value={rule.aiModel}
                          onValueChange={(value: 'gemini-pro' | 'gemini-flash') => {
                            setAiRules(prev => prev.map(ar => 
                              ar.id === rule.id 
                                ? { ...ar, aiModel: value }
                                : ar
                            ))
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gemini-pro">Gemini Pro（高精度）</SelectItem>
                            <SelectItem value="gemini-flash">Gemini Flash（高速）</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">残業回避</Label>
                        <Switch
                          checked={rule.avoidOvertime}
                          onCheckedChange={(checked) => {
                            setAiRules(prev => prev.map(ar => 
                              ar.id === rule.id 
                                ? { ...ar, avoidOvertime: checked }
                                : ar
                            ))
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">ワークロードバランス</Label>
                        <Switch
                          checked={rule.balanceWorkload}
                          onCheckedChange={(checked) => {
                            setAiRules(prev => prev.map(ar => 
                              ar.id === rule.id 
                                ? { ...ar, balanceWorkload: checked }
                                : ar
                            ))
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">従業員希望を考慮</Label>
                        <Switch
                          checked={rule.considerPreferences}
                          onCheckedChange={(checked) => {
                            setAiRules(prev => prev.map(ar => 
                              ar.id === rule.id 
                                ? { ...ar, considerPreferences: checked }
                                : ar
                            ))
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">創造性（Temperature）</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={rule.temperature}
                          onChange={(e) => {
                            setAiRules(prev => prev.map(ar => 
                              ar.id === rule.id 
                                ? { ...ar, temperature: parseFloat(e.target.value) }
                                : ar
                            ))
                          }}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium w-12">{rule.temperature}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        低い値: 一貫性重視、高い値: 創造性重視
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
