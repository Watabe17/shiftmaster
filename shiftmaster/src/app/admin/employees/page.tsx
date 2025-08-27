'use client'

import React, { useState } from 'react'
import {
  Calendar, Users, ChevronLeft, Menu, LogOut, Settings, Clock, Home,
  Search, Plus, Edit2, Trash2, UserPlus, FileText, Download, Upload,
  Filter, X, Check, AlertCircle, ChevronDown, MoreVertical,
  Mail, Phone, Shield, Building, CalendarDays, Info, AlertTriangle,
  FileCheck, CreditCard, UserCheck, Briefcase, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

// 従業員の型定義
interface Employee {
  id: string
  employeeCode: string
  name: string
  kana: string
  employment_type: string
  positions: string[]
  role: string
  authStatus: string
  hire_date: string
  contract_end: string | null
  is_active: boolean
  email: string
  phone: string
  paid_leave: { total: number; used: number; remaining: number }
  social_insurance: { health: boolean; pension: boolean; employment: boolean }
  monthly_limit: number
  maxOffRequests: number
  monthly_current: number
  address: string
}

const EmployeeManagementPage = () => {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState('employees')
  const [selectedStore] = useState({ id: 'store-1', name: 'カフェ Sunny 渋谷店' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterEmploymentType, setFilterEmploymentType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedRows, setSelectedRows] = useState([])
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null)
  const [inviteLinks, setInviteLinks] = useState<Record<string, { url: string; expiresAt: string }>>({})
  const [qrModalEmployee, setQrModalEmployee] = useState<string | null>(null)
  
  // 従業員追加・編集用の状態
  const [newEmployeeData, setNewEmployeeData] = useState<Partial<Employee>>({})
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])

  // 雇用形態
  const employmentTypes = [
    { id: 'full_time', name: '正社員', short: '正' },
    { id: 'part_time', name: 'パート', short: 'パ' },
    { id: 'contract', name: '契約', short: '契' }
  ]

  // ポジション
  const positions = [
    { id: 'kitchen', name: 'キッチン', color: 'bg-orange-100 text-orange-700' },
    { id: 'hall', name: 'ホール', color: 'bg-blue-100 text-blue-700' },
    { id: 'cashier', name: 'レジ', color: 'bg-green-100 text-green-700' },
    { id: 'manager', name: 'マネージャー', color: 'bg-purple-100 text-purple-700' }
  ]

  // サンプル従業員データ
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'e1',
      employeeCode: 'EMP001',
      name: '佐藤 太郎',
      kana: 'サトウ タロウ',
      employment_type: 'full_time',
      positions: ['hall', 'cashier'],
      role: 'employee',
      authStatus: 'active',
      hire_date: '2023-04-01',
      contract_end: null,
      is_active: true,
      email: 'sato@example.com',
      phone: '090-1234-5678',
      paid_leave: { total: 20, used: 8, remaining: 12 },
      social_insurance: { health: true, pension: true, employment: true },
      monthly_limit: 160,
      maxOffRequests: 5,
      monthly_current: 145,
      address: '東京都渋谷区〇〇1-2-3'
    },
    {
      id: 'e2',
      employeeCode: 'EMP002',
      name: '鈴木 花子',
      kana: 'スズキ ハナコ',
      employment_type: 'full_time',
      positions: ['kitchen', 'manager'],
      role: 'admin',
      authStatus: 'active',
      hire_date: '2022-10-15',
      contract_end: null,
      is_active: true,
      email: 'suzuki@example.com',
      phone: '090-2345-6789',
      paid_leave: { total: 22, used: 5, remaining: 17 },
      social_insurance: { health: true, pension: true, employment: true },
      monthly_limit: 160,
      maxOffRequests: 3,
      monthly_current: 152,
      address: '東京都世田谷区〇〇2-3-4'
    },
    {
      id: 'e3',
      employeeCode: 'EMP003',
      name: '田中 一郎',
      kana: 'タナカ イチロウ',
      employment_type: 'part_time',
      positions: ['hall'],
      role: 'employee',
      authStatus: 'invited',
      hire_date: '2024-01-20',
      contract_end: null,
      is_active: true,
      email: 'tanaka@example.com',
      phone: '090-3456-7890',
      paid_leave: { total: 5, used: 1, remaining: 4 },
      social_insurance: { health: false, pension: false, employment: true },
      monthly_limit: 120,
      maxOffRequests: 2,
      monthly_current: 98,
      address: '東京都新宿区〇〇3-4-5'
    }
  ])

  // フィルタリングされた従業員リスト
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name?.includes(searchQuery) || 
                         employee.employeeCode?.includes(searchQuery) ||
                         employee.email?.includes(searchQuery)
    const matchesEmploymentType = filterEmploymentType === 'all' || 
                                 employee.employment_type === filterEmploymentType
    const matchesStatus = filterStatus === 'all' || 
                         employee.authStatus === filterStatus
    
    return matchesSearch && matchesEmploymentType && matchesStatus
  })

  // 従業員追加
  const handleAddEmployee = (employeeData: Partial<Employee>) => {
    const newEmployee: Employee = {
      id: `e${employees.length + 1}`,
      employeeCode: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: employeeData.name || '新規従業員',
      kana: employeeData.kana || 'シンキジュウギョウイン',
      employment_type: employeeData.employment_type || 'part_time',
      positions: employeeData.positions || ['hall'],
      role: employeeData.role || 'employee',
      authStatus: 'invited',
      hire_date: employeeData.hire_date || new Date().toISOString().split('T')[0],
      contract_end: null,
      is_active: true,
      email: employeeData.email || `employee${employees.length + 1}@example.com`,
      phone: employeeData.phone || '090-0000-0000',
      paid_leave: { total: 0, used: 0, remaining: 0 },
      social_insurance: { health: false, pension: false, employment: true },
      monthly_limit: 120,
      maxOffRequests: 2,
      monthly_current: 0,
      address: employeeData.address || '住所未設定'
    }
    setEmployees([...employees, newEmployee])
    setShowAddModal(false)
  }

  // 従業員編集
  const handleEditEmployee = (employeeData: Partial<Employee>) => {
    setEmployees(employees.map(emp => 
      emp.id === selectedEmployee?.id ? { ...emp, ...employeeData } : emp
    ))
    setShowEditModal(false)
    setSelectedEmployee(null)
  }

  // 従業員削除
  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId))
  }

  // 招待リンク生成
  const generateInviteLink = (employeeId: string) => {
    const inviteUrl = `${window.location.origin}/auth/register?invite=${employeeId}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    setInviteLinks(prev => ({
      ...prev,
      [employeeId]: { url: inviteUrl, expiresAt }
    }))
  }

  // ポジション選択・解除
  const togglePosition = (positionId: string) => {
    setSelectedPositions(prev => 
      prev.includes(positionId) 
        ? prev.filter(id => id !== positionId)
        : [...prev, positionId]
    )
  }

  // 従業員追加モーダルを開く
  const openAddModal = () => {
    setNewEmployeeData({})
    setSelectedPositions([])
    setShowAddModal(true)
  }

  // 従業員追加モーダルを閉じる
  const closeAddModal = () => {
    setShowAddModal(false)
    setNewEmployeeData({})
    setSelectedPositions([])
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
                onClick={() => router.push('/dashboard')}
                className="mr-4"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                ダッシュボード
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">従業員管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{selectedStore.name}</span>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
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
          {/* ページヘッダー */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">従業員一覧</h2>
                <p className="mt-1 text-sm text-gray-500">
                  全{filteredEmployees.length}名の従業員
                </p>
              </div>
                             <Button onClick={openAddModal}>
                 <UserPlus className="h-4 w-4 mr-2" />
                 従業員を追加
               </Button>
            </div>
          </div>

          {/* 検索・フィルター */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="従業員名・コード・メールで検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
              </div>
                <Select value={filterEmploymentType} onValueChange={setFilterEmploymentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="雇用形態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {employmentTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="active">アクティブ</SelectItem>
                    <SelectItem value="invited">招待中</SelectItem>
                    <SelectItem value="inactive">非アクティブ</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    エクスポート
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    インポート
                  </Button>
              </div>
            </div>
            </CardContent>
          </Card>

          {/* 従業員テーブル */}
          <Card>
            <CardHeader>
              <CardTitle>従業員一覧</CardTitle>
              <CardDescription>
                従業員の詳細情報と管理オプション
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        従業員情報
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        雇用形態
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ポジション
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        勤務時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {employee.employeeCode}
                              </div>
                              <div className="text-sm text-gray-500">
                                {employee.email}
                              </div>
                      </div>
                    </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">
                            {employmentTypes.find(t => t.id === employee.employment_type)?.name}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {employee.positions.map(posId => {
                              const position = positions.find(p => p.id === posId)
                              return position ? (
                                <Badge key={posId} className={position.color}>
                                  {position.name}
                                </Badge>
                              ) : null
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={employee.authStatus === 'active' ? 'default' : 'secondary'}
                          >
                            {employee.authStatus === 'active' ? 'アクティブ' : 
                             employee.authStatus === 'invited' ? '招待中' : '非アクティブ'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {employee.monthly_current}/{employee.monthly_limit}h
                          </div>
                          <div className="text-sm text-gray-500">
                            今月の勤務時間
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                              onClick={() => {
                                setSelectedEmployee(employee)
                                setShowEditModal(true)
                              }}
                          >
                              <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                              onClick={() => generateInviteLink(employee.id)}
                          >
                              <Mail className="h-4 w-4" />
                          </Button>
                        <Button
                          variant="outline"
                          size="sm"
                              onClick={() => setQrModalEmployee(employee.id)}
                        >
                              <FileText className="h-4 w-4" />
                        </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
                </CardContent>
              </Card>
        </div>
      </main>

      {/* 従業員追加モーダル */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>従業員を追加</DialogTitle>
            <DialogDescription>
              新しい従業員の情報を入力してください
            </DialogDescription>
          </DialogHeader>
                     <div className="grid grid-cols-2 gap-4">
             <div>
               <Label htmlFor="name">氏名</Label>
               <Input 
                 id="name" 
                 placeholder="佐藤 太郎"
                 value={newEmployeeData.name || ''}
                 onChange={(e) => setNewEmployeeData(prev => ({ ...prev, name: e.target.value }))}
               />
             </div>
             <div>
               <Label htmlFor="kana">フリガナ</Label>
               <Input 
                 id="kana" 
                 placeholder="サトウ タロウ"
                 value={newEmployeeData.kana || ''}
                 onChange={(e) => setNewEmployeeData(prev => ({ ...prev, kana: e.target.value }))}
               />
             </div>
             <div>
               <Label htmlFor="email">メールアドレス</Label>
               <Input 
                 id="email" 
                 type="email" 
                 placeholder="sato@example.com"
                 value={newEmployeeData.email || ''}
                 onChange={(e) => setNewEmployeeData(prev => ({ ...prev, email: e.target.value }))}
               />
             </div>
             <div>
               <Label htmlFor="phone">電話番号</Label>
               <Input 
                 id="phone" 
                 placeholder="090-1234-5678"
                 value={newEmployeeData.phone || ''}
                 onChange={(e) => setNewEmployeeData(prev => ({ ...prev, phone: e.target.value }))}
               />
             </div>
             <div>
               <Label htmlFor="employment_type">雇用形態</Label>
               <Select 
                 value={newEmployeeData.employment_type || ''} 
                 onValueChange={(value) => setNewEmployeeData(prev => ({ ...prev, employment_type: value }))}
               >
                 <SelectTrigger>
                   <SelectValue placeholder="選択してください" />
                 </SelectTrigger>
                 <SelectContent>
                   {employmentTypes.map(type => (
                     <SelectItem key={type.id} value={type.id}>
                       {type.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             <div>
               <Label htmlFor="hire_date">入社日</Label>
               <Input 
                 id="hire_date" 
                 type="date"
                 value={newEmployeeData.hire_date || ''}
                 onChange={(e) => setNewEmployeeData(prev => ({ ...prev, hire_date: e.target.value }))}
               />
             </div>
             <div className="col-span-2">
               <Label htmlFor="positions">ポジション</Label>
               <div className="flex flex-wrap gap-2 mt-2">
                 {positions.map(pos => (
                   <Badge 
                     key={pos.id} 
                     variant={selectedPositions.includes(pos.id) ? "default" : "outline"}
                     className="cursor-pointer hover:opacity-80"
                     onClick={() => togglePosition(pos.id)}
                   >
                     {pos.name}
                   </Badge>
            ))}
          </div>
               {selectedPositions.length > 0 && (
                 <p className="text-sm text-gray-600 mt-2">
                   選択中: {selectedPositions.map(id => positions.find(p => p.id === id)?.name).join(', ')}
                 </p>
               )}
             </div>
             <div className="col-span-2">
               <Label htmlFor="address">住所</Label>
               <Textarea 
                 id="address" 
                 placeholder="東京都渋谷区..."
                 value={newEmployeeData.address || ''}
                 onChange={(e) => setNewEmployeeData(prev => ({ ...prev, address: e.target.value }))}
               />
             </div>
           </div>
                     <div className="flex justify-end space-x-2 mt-6">
             <Button variant="outline" onClick={closeAddModal}>
               キャンセル
             </Button>
             <Button onClick={() => handleAddEmployee({ ...newEmployeeData, positions: selectedPositions })}>
               追加
             </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* 従業員編集モーダル */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>従業員情報を編集</DialogTitle>
            <DialogDescription>
              従業員の情報を更新してください
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">氏名</Label>
                <Input id="edit-name" defaultValue={selectedEmployee.name} />
              </div>
              <div>
                <Label htmlFor="edit-kana">フリガナ</Label>
                <Input id="edit-kana" defaultValue={selectedEmployee.kana} />
              </div>
              <div>
                <Label htmlFor="edit-email">メールアドレス</Label>
                <Input id="edit-email" type="email" defaultValue={selectedEmployee.email} />
              </div>
              <div>
                <Label htmlFor="edit-phone">電話番号</Label>
                <Input id="edit-phone" defaultValue={selectedEmployee.phone} />
              </div>
              <div>
                <Label htmlFor="edit-employment_type">雇用形態</Label>
                <Select defaultValue={selectedEmployee.employment_type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-hire_date">入社日</Label>
                <Input id="edit-hire_date" type="date" defaultValue={selectedEmployee.hire_date} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-positions">ポジション</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {positions.map(pos => (
                    <Badge 
                      key={pos.id} 
                      variant={selectedEmployee.positions.includes(pos.id) ? "default" : "outline"}
                      className="cursor-pointer"
                    >
                      {pos.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-address">住所</Label>
                <Textarea id="edit-address" defaultValue={selectedEmployee.address} />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              キャンセル
            </Button>
            <Button onClick={() => handleEditEmployee({})}>
              更新
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 招待リンク表示モーダル */}
      {Object.keys(inviteLinks).length > 0 && (
        <Dialog open={true} onOpenChange={() => setInviteLinks({})}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>招待リンク</DialogTitle>
              <DialogDescription>
                従業員に送信する招待リンクです
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {Object.entries(inviteLinks).map(([employeeId, invite]) => {
                const employee = employees.find(emp => emp.id === employeeId)
                return (
                  <div key={employeeId} className="p-4 border rounded-lg">
                    <div className="font-medium mb-2">{employee?.name}</div>
                    <div className="text-sm text-gray-600 mb-2">有効期限: {new Date(invite.expiresAt).toLocaleDateString()}</div>
                    <div className="flex space-x-2">
                      <Input value={invite.url} readOnly />
                      <Button variant="outline" size="sm">
                        コピー
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* QRコードモーダル */}
      <Dialog open={!!qrModalEmployee} onOpenChange={() => setQrModalEmployee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QRコード</DialogTitle>
            <DialogDescription>
              従業員の勤怠記録用QRコード
            </DialogDescription>
          </DialogHeader>
          <div className="text-center">
            <div className="w-64 h-64 bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-500">QRコード表示エリア</span>
            </div>
            <p className="text-sm text-gray-600">
              {employees.find(emp => emp.id === qrModalEmployee)?.name} のQRコード
            </p>
        </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployeeManagementPage

