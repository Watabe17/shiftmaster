'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar, Users, ChevronLeft, Menu, LogOut, Settings, Clock, Home,
  CheckCircle, AlertCircle, ChevronRight, Save, Sparkles, UserCheck,
  FileText, X, Edit2, Plus, ArrowRight, Info, Target,
  AlertTriangle, Sliders, List, Eye, ChevronDown, ChevronUp,
  CalendarDays, UserX, FileUp, Grid3x3, BarChart, Trash2,
  Edit3, Download, RefreshCw, AlertCircle as AlertCircleIcon,
  Check, X as XIcon, Clock as ClockIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// シフト申請の型定義
interface ShiftRequest {
  id: string
  employeeId: string
  employeeName: string
  month: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  preferences: ShiftPreference[]
  notes?: string
  createdAt: string
  updatedAt: string
}

// シフト希望の型定義
interface ShiftPreference {
  id: string
  date: string
  available: boolean
  preferredStartTime?: string
  preferredEndTime?: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  reason?: string
}

const ShiftApprovalPage = () => {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState('shift-approval')
  const [selectedStore] = useState({ id: '24827f88-3b69-4548-aa9c-d26db7bc417c', name: 'カフェ Sunny 渋谷店' })
  const [selectedMonth, setSelectedMonth] = useState('2025-02')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'>('all')
  const [shiftRequests, setShiftRequests] = useState<ShiftRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ShiftRequest | null>(null)
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [approvalNotes, setApprovalNotes] = useState('')

  // シフト申請一覧を取得
  const fetchShiftRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/shift-requests?storeId=${selectedStore.id}&month=${selectedMonth}&status=${selectedStatus}`)
      
      if (!response.ok) {
        throw new Error('シフト申請データの取得に失敗しました')
      }
      
      const result = await response.json()
      if (result.success) {
        setShiftRequests(result.data)
        console.log('✅ シフト申請データ取得成功:', result.data)
      } else {
        setShiftRequests([])
        console.log('シフト申請データが空です')
      }
    } catch (error) {
      console.error('シフト申請データ取得エラー:', error)
      setError('シフト申請データの取得に失敗しました')
      setShiftRequests([])
    } finally {
      setLoading(false)
    }
  }

  // 月またはステータスが変更されたときにデータを再取得
  useEffect(() => {
    fetchShiftRequests()
  }, [selectedMonth, selectedStatus])

  // シフト申請の承認
  const handleApprove = async (requestId: string) => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/shift-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'APPROVED',
          notes: approvalNotes
        }),
      })

      if (!response.ok) {
        throw new Error('シフト申請の承認に失敗しました')
      }

      const result = await response.json()
      if (result.success) {
        toast.success('シフト申請を承認しました')
        setApprovalModalOpen(false)
        setApprovalNotes('')
        setSelectedRequest(null)
        // データを再取得
        await fetchShiftRequests()
      } else {
        throw new Error(result.error || 'シフト申請の承認に失敗しました')
      }

    } catch (error) {
      console.error('シフト申請承認エラー:', error)
      toast.error('シフト申請の承認に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // シフト申請の却下
  const handleReject = async (requestId: string) => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/shift-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'REJECTED',
          notes: approvalNotes
        }),
      })

      if (!response.ok) {
        throw new Error('シフト申請の却下に失敗しました')
      }

      const result = await response.json()
      if (result.success) {
        toast.success('シフト申請を却下しました')
        setApprovalModalOpen(false)
        setApprovalNotes('')
        setSelectedRequest(null)
        // データを再取得
        await fetchShiftRequests()
      } else {
        throw new Error(result.error || 'シフト申請の却下に失敗しました')
      }

    } catch (error) {
      console.error('シフト申請却下エラー:', error)
      toast.error('シフト申請の却下に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 承認・却下モーダルを開く
  const openApprovalModal = (request: ShiftRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request)
    setApprovalModalOpen(true)
  }

  // ステータスに応じたバッジの色を取得
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="secondary">下書き</Badge>
      case 'SUBMITTED':
        return <Badge variant="default">提出済み</Badge>
      case 'APPROVED':
        return <Badge variant="default" className="bg-green-100 text-green-800">承認済み</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">却下</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 優先度に応じたバッジの色を取得
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <Badge variant="destructive">高</Badge>
      case 'MEDIUM':
        return <Badge variant="default">中</Badge>
      case 'LOW':
        return <Badge variant="secondary">低</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
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
              <h1 className="text-xl font-semibold text-gray-900">シフト申請承認</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* フィルター */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>フィルター</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="space-y-2">
                <Label>対象月</Label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>ステータス</Label>
                <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="SUBMITTED">提出済み</SelectItem>
                    <SelectItem value="APPROVED">承認済み</SelectItem>
                    <SelectItem value="REJECTED">却下</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={fetchShiftRequests} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  更新
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* シフト申請一覧 */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-gray-400" />
                  <p className="mt-2 text-gray-500">読み込み中...</p>
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
          ) : shiftRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-gray-500">
                  <FileText className="w-8 h-8 mx-auto" />
                  <p className="mt-2">シフト申請がありません</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            shiftRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{request.employeeName}</span>
                        {getStatusBadge(request.status)}
                      </CardTitle>
                      <CardDescription>
                        {request.month} • {new Date(request.createdAt).toLocaleDateString('ja-JP')}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      {request.status === 'SUBMITTED' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => openApprovalModal(request, 'approve')}
                            disabled={loading}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            承認
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openApprovalModal(request, 'reject')}
                            disabled={loading}
                          >
                            <XIcon className="w-4 h-4 mr-1" />
                            却下
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* シフト希望の詳細 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {request.preferences.map((pref) => (
                        <div
                          key={pref.id}
                          className={`p-3 rounded-lg border ${
                            pref.available ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">
                              {new Date(pref.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                            </span>
                            {getPriorityBadge(pref.priority)}
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>
                                {pref.available ? '勤務可能' : '勤務不可'}
                              </span>
                            </div>
                            {pref.available && pref.preferredStartTime && pref.preferredEndTime && (
                              <div className="text-xs text-gray-600">
                                {pref.preferredStartTime} - {pref.preferredEndTime}
                              </div>
                            )}
                            {pref.reason && (
                              <div className="text-xs text-gray-600">
                                理由: {pref.reason}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 備考 */}
                    {request.notes && (
                      <div className="pt-3 border-t">
                        <Label className="text-sm font-medium">備考</Label>
                        <p className="text-sm text-gray-600 mt-1">{request.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 承認・却下モーダル */}
      <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRequest && (
                <span>
                  {selectedRequest.employeeName} のシフト申請を
                  {approvalNotes.includes('approve') ? '承認' : '却下'}しますか？
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              必要に応じてコメントを追加してください
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>コメント</Label>
              <Textarea
                placeholder="承認・却下の理由や指示事項があれば入力してください"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setApprovalModalOpen(false)}
            >
              キャンセル
            </Button>
            {selectedRequest && (
              <>
                <Button
                  onClick={() => handleApprove(selectedRequest.id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  承認
                </Button>
                <Button
                  onClick={() => handleReject(selectedRequest.id)}
                  disabled={loading}
                  variant="destructive"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  却下
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ShiftApprovalPage

