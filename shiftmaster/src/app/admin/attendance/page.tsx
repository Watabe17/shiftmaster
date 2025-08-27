'use client'

import React, { useState } from 'react'
import {
  Calendar, Clock, MapPin, Search, Filter, Download, Upload,
  Plus, Edit2, Trash2, Check, X, AlertCircle, Info,
  User, Building, CalendarDays, FileText, Download as DownloadIcon
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

// 勤怠記録の型定義
interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  employeeCode: string
  date: string
  clockIn: string | null
  clockOut: string | null
  breakStart: string | null
  breakEnd: string | null
  totalWorkHours: number
  totalBreakHours: number
  status: 'present' | 'absent' | 'late' | 'early_leave' | 'half_day'
  location: {
    latitude: number
    longitude: number
    address: string
  }
  notes: string
  isApproved: boolean
  approvedBy: string | null
  approvedAt: string | null
}

// 従業員の型定義
interface Employee {
  id: string
  name: string
  employeeCode: string
  positions: string[]
}

const AttendanceManagementPage = () => {
  const router = useRouter()
  const [selectedStore] = useState({ id: 'store-1', name: 'カフェ Sunny 渋谷店' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterEmployee, setFilterEmployee] = useState('all')
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  // ステータスオプション
  const statusOptions = [
    { id: 'present', name: '出勤', color: 'bg-green-100 text-green-700' },
    { id: 'absent', name: '欠勤', color: 'bg-red-100 text-red-700' },
    { id: 'late', name: '遅刻', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'early_leave', name: '早退', color: 'bg-orange-100 text-orange-700' },
    { id: 'half_day', name: '半休', color: 'bg-blue-100 text-blue-700' }
  ]

  // サンプル従業員データ
  const employees: Employee[] = [
    { id: 'e1', name: '佐藤 太郎', employeeCode: 'EMP001', positions: ['hall', 'cashier'] },
    { id: 'e2', name: '鈴木 花子', employeeCode: 'EMP002', positions: ['kitchen', 'manager'] },
    { id: 'e3', name: '田中 一郎', employeeCode: 'EMP003', positions: ['hall'] }
  ]

  // サンプル勤怠データ
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 'att1',
      employeeId: 'e1',
      employeeName: '佐藤 太郎',
      employeeCode: 'EMP001',
      date: '2024-01-15',
      clockIn: '09:00',
      clockOut: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalWorkHours: 8,
      totalBreakHours: 1,
      status: 'present',
      location: {
        latitude: 35.6581,
        longitude: 139.7016,
        address: '東京都渋谷区渋谷2-24-12'
      },
      notes: '',
      isApproved: true,
      approvedBy: '鈴木 花子',
      approvedAt: '2024-01-15T18:30:00Z'
    },
    {
      id: 'att2',
      employeeId: 'e2',
      employeeName: '鈴木 花子',
      employeeCode: 'EMP002',
      date: '2024-01-15',
      clockIn: '08:30',
      clockOut: '17:30',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalWorkHours: 8,
      totalBreakHours: 1,
      status: 'present',
      location: {
        latitude: 35.6581,
        longitude: 139.7016,
        address: '東京都渋谷区渋谷2-24-12'
      },
      notes: '',
      isApproved: true,
      approvedBy: '鈴木 花子',
      approvedAt: '2024-01-15T17:30:00Z'
    },
    {
      id: 'att3',
      employeeId: 'e3',
      employeeName: '田中 一郎',
      employeeCode: 'EMP003',
      date: '2024-01-15',
      clockIn: '09:15',
      clockOut: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalWorkHours: 7.75,
      totalBreakHours: 1,
      status: 'late',
      location: {
        latitude: 35.6581,
        longitude: 139.7016,
        address: '東京都渋谷区渋谷2-24-12'
      },
      notes: '電車遅延のため遅刻',
      isApproved: false,
      approvedBy: null,
      approvedAt: null
    }
  ])

  // フィルタリングされた勤怠記録
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.employeeName?.includes(searchQuery) || 
                         record.employeeCode?.includes(searchQuery)
    const matchesDate = !filterDate || record.date === filterDate
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    const matchesEmployee = filterEmployee === 'all' || record.employeeId === filterEmployee
    
    return matchesSearch && matchesDate && matchesStatus && matchesEmployee
  })

  // 現在位置を取得
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error)
        }
      )
    }
  }

  // 勤怠記録追加
  const handleAddRecord = (recordData: Partial<AttendanceRecord>) => {
    const newRecord: AttendanceRecord = {
      id: `att${attendanceRecords.length + 1}`,
      employeeId: recordData.employeeId || 'e1',
      employeeName: employees.find(emp => emp.id === recordData.employeeId)?.name || '新規従業員',
      employeeCode: employees.find(emp => emp.id === recordData.employeeId)?.employeeCode || 'EMP000',
      date: recordData.date || new Date().toISOString().split('T')[0],
      clockIn: recordData.clockIn || null,
      clockOut: recordData.clockOut || null,
      breakStart: recordData.breakStart || null,
      breakEnd: recordData.breakEnd || null,
      totalWorkHours: recordData.totalWorkHours || 0,
      totalBreakHours: recordData.totalBreakHours || 0,
      status: recordData.status || 'present',
      location: currentLocation ? {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        address: '現在位置から取得'
      } : {
        latitude: 0,
        longitude: 0,
        address: '位置情報なし'
      },
      notes: recordData.notes || '',
      isApproved: false,
      approvedBy: null,
      approvedAt: null
    }
    setAttendanceRecords([...attendanceRecords, newRecord])
    setShowAddModal(false)
  }

  // 勤怠記録編集
  const handleEditRecord = (recordData: Partial<AttendanceRecord>) => {
    setAttendanceRecords(records => 
      records.map(record => 
        record.id === selectedRecord?.id ? { ...record, ...recordData } : record
      )
    )
    setShowEditModal(false)
    setSelectedRecord(null)
  }

  // 勤怠記録削除
  const handleDeleteRecord = (recordId: string) => {
    setAttendanceRecords(records => records.filter(record => record.id !== recordId))
  }

  // 勤怠承認
  const handleApproveRecord = (recordId: string) => {
    setAttendanceRecords(records => 
      records.map(record => 
        record.id === recordId ? {
          ...record,
          isApproved: true,
          approvedBy: '管理者',
          approvedAt: new Date().toISOString()
        } : record
      )
    )
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
                ← ダッシュボード
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">勤怠管理</h1>
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
                <h2 className="text-2xl font-bold text-gray-900">勤怠記録一覧</h2>
                <p className="mt-1 text-sm text-gray-500">
                  全{filteredRecords.length}件の勤怠記録
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={getCurrentLocation}>
                  <MapPin className="h-4 w-4 mr-2" />
                  現在位置取得
                </Button>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  勤怠記録追加
                </Button>
              </div>
            </div>
          </div>

          {/* 検索・フィルター */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="従業員名・コードで検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    placeholder="日付"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {statusOptions.map(status => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="従業員" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <DownloadIcon className="h-4 w-4 mr-2" />
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

          {/* 勤怠記録テーブル */}
          <Card>
            <CardHeader>
              <CardTitle>勤怠記録</CardTitle>
              <CardDescription>
                従業員の勤怠記録と管理オプション
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
                        日付
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        出退勤時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        勤務時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        位置情報
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        承認状態
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {record.employeeName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {record.employeeCode}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString('ja-JP')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>出勤: {record.clockIn || '未記録'}</div>
                            <div>退勤: {record.clockOut || '未記録'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>勤務: {record.totalWorkHours}h</div>
                            <div>休憩: {record.totalBreakHours}h</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={statusOptions.find(s => s.id === record.status)?.color}>
                            {statusOptions.find(s => s.id === record.status)?.name}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {record.location.address}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={record.isApproved ? "default" : "secondary"}>
                            {record.isApproved ? '承認済み' : '未承認'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRecord(record)
                                setShowEditModal(true)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {!record.isApproved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveRecord(record.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteRecord(record.id)}
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

      {/* 勤怠記録追加モーダル */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>勤怠記録を追加</DialogTitle>
            <DialogDescription>
              新しい勤怠記録の情報を入力してください
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employee">従業員</Label>
              <Select onValueChange={(value) => {}}>
                <SelectTrigger>
                  <SelectValue placeholder="従業員を選択" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.employeeCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">日付</Label>
              <Input 
                id="date" 
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="clockIn">出勤時間</Label>
              <Input id="clockIn" type="time" />
            </div>
            <div>
              <Label htmlFor="clockOut">退勤時間</Label>
              <Input id="clockOut" type="time" />
            </div>
            <div>
              <Label htmlFor="breakStart">休憩開始</Label>
              <Input id="breakStart" type="time" />
            </div>
            <div>
              <Label htmlFor="breakEnd">休憩終了</Label>
              <Input id="breakEnd" type="time" />
            </div>
            <div>
              <Label htmlFor="status">ステータス</Label>
              <Select onValueChange={(value) => {}}>
                <SelectTrigger>
                  <SelectValue placeholder="ステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="notes">備考</Label>
              <Textarea id="notes" placeholder="特記事項があれば入力してください" />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              キャンセル
            </Button>
            <Button onClick={() => handleAddRecord({})}>
              追加
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 勤怠記録編集モーダル */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>勤怠記録を編集</DialogTitle>
            <DialogDescription>
              勤怠記録の情報を更新してください
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-employee">従業員</Label>
                <Input 
                  id="edit-employee" 
                  value={selectedRecord.employeeName}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="edit-date">日付</Label>
                <Input 
                  id="edit-date" 
                  type="date"
                  defaultValue={selectedRecord.date}
                />
              </div>
              <div>
                <Label htmlFor="edit-clockIn">出勤時間</Label>
                <Input 
                  id="edit-clockIn" 
                  type="time"
                  defaultValue={selectedRecord.clockIn || ''}
                />
              </div>
              <div>
                <Label htmlFor="edit-clockOut">退勤時間</Label>
                <Input 
                  id="edit-clockOut" 
                  type="time"
                  defaultValue={selectedRecord.clockOut || ''}
                />
              </div>
              <div>
                <Label htmlFor="edit-breakStart">休憩開始</Label>
                <Input 
                  id="edit-breakStart" 
                  type="time"
                  defaultValue={selectedRecord.breakStart || ''}
                />
              </div>
              <div>
                <Label htmlFor="edit-breakEnd">休憩終了</Label>
                <Input 
                  id="edit-breakEnd" 
                  type="time"
                  defaultValue={selectedRecord.breakEnd || ''}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">ステータス</Label>
                <Select defaultValue={selectedRecord.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-notes">備考</Label>
                <Textarea 
                  id="edit-notes" 
                  defaultValue={selectedRecord.notes}
                  placeholder="特記事項があれば入力してください"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              キャンセル
            </Button>
            <Button onClick={() => handleEditRecord({})}>
              更新
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AttendanceManagementPage


