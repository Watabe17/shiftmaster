import React, { useState } from 'react';
import {
  Calendar, Users, ChevronLeft, Menu, LogOut, Settings, Clock, Home,
  Search, Download, X, Check, AlertCircle, ChevronDown,
  Edit2, CalendarDays, AlertTriangle, Info, Save,
  MapPin, FileText, User, ChevronRight, Eye, BarChart3
} from 'lucide-react';

const AttendanceManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('attendance');
  const [selectedStore] = useState({ id: 'store-1', name: 'カフェ Sunny 渋谷店' });
  const [selectedMonth, setSelectedMonth] = useState('2025-02');
  const [selectedDate, setSelectedDate] = useState('2025-02-10');
  const [selectedEmployee, setSelectedEmployee] = useState('e1');
  const [viewMode, setViewMode] = useState('daily'); // daily or monthly
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  // 従業員リスト
  const employees = [
    { id: 'e1', name: '佐藤 太郎', code: 'EMP001' },
    { id: 'e2', name: '鈴木 花子', code: 'EMP002' },
    { id: 'e3', name: '田中 一郎', code: 'EMP003' },
    { id: 'e4', name: '高橋 美咲', code: 'EMP005' },
    { id: 'e5', name: '伊藤 健太', code: 'EMP006' }
  ];

  // 日次勤怠データ（特定日の全従業員）
  const dailyAttendanceData = [
    {
      id: 'da1',
      employee_id: 'e1',
      employee_name: '佐藤 太郎',
      employee_code: 'EMP001',
      scheduled: '09:00-18:00',
      clock_in: '08:55',
      clock_out: '18:05',
      break_minutes: 60,
      actual_hours: '8:10',
      overtime_minutes: 10,
      location_ok: true,
      edited: false
    },
    {
      id: 'da2',
      employee_id: 'e2',
      employee_name: '鈴木 花子',
      employee_code: 'EMP002',
      scheduled: '10:00-19:00',
      clock_in: '10:02',
      clock_out: '19:15',
      break_minutes: 60,
      actual_hours: '8:13',
      overtime_minutes: 15,
      location_ok: true,
      edited: false
    },
    {
      id: 'da3',
      employee_id: 'e3',
      employee_name: '田中 一郎',
      employee_code: 'EMP003',
      scheduled: '13:00-22:00',
      clock_in: '13:05',
      clock_out: '22:00',
      break_minutes: 60,
      actual_hours: '7:55',
      overtime_minutes: 0,
      location_ok: true,
      edited: true
    },
    {
      id: 'da4',
      employee_id: 'e4',
      employee_name: '高橋 美咲',
      employee_code: 'EMP005',
      scheduled: '休み',
      clock_in: null,
      clock_out: null,
      break_minutes: 0,
      actual_hours: null,
      overtime_minutes: 0,
      location_ok: false,
      edited: false
    },
    {
      id: 'da5',
      employee_id: 'e5',
      employee_name: '伊藤 健太',
      employee_code: 'EMP006',
      scheduled: '09:00-18:00',
      clock_in: '09:00',
      clock_out: '18:30',
      break_minutes: 60,
      actual_hours: '8:30',
      overtime_minutes: 30,
      location_ok: true,
      edited: false
    }
  ];

  // 月次勤怠データ（特定従業員の1ヶ月分）
  const monthlyAttendanceData = [
    { date: '2025-02-01', day: '土', scheduled: '09:00-18:00', clock_in: '08:55', clock_out: '18:05', actual: '8:10', overtime: 10 },
    { date: '2025-02-02', day: '日', scheduled: '休み', clock_in: null, clock_out: null, actual: null, overtime: 0 },
    { date: '2025-02-03', day: '月', scheduled: '09:00-18:00', clock_in: '09:00', clock_out: '18:00', actual: '8:00', overtime: 0 },
    { date: '2025-02-04', day: '火', scheduled: '09:00-18:00', clock_in: '08:58', clock_out: '18:30', actual: '8:32', overtime: 32 },
    { date: '2025-02-05', day: '水', scheduled: '09:00-18:00', clock_in: '09:05', clock_out: '18:00', actual: '7:55', overtime: 0 },
    { date: '2025-02-06', day: '木', scheduled: '09:00-18:00', clock_in: '09:00', clock_out: '19:00', actual: '9:00', overtime: 60 },
    { date: '2025-02-07', day: '金', scheduled: '09:00-18:00', clock_in: '08:50', clock_out: '18:10', actual: '8:20', overtime: 20 },
    { date: '2025-02-08', day: '土', scheduled: '09:00-18:00', clock_in: '09:00', clock_out: '18:00', actual: '8:00', overtime: 0 },
    { date: '2025-02-09', day: '日', scheduled: '休み', clock_in: null, clock_out: null, actual: null, overtime: 0 },
    { date: '2025-02-10', day: '月', scheduled: '09:00-18:00', clock_in: '08:55', clock_out: '18:05', actual: '8:10', overtime: 10 }
  ];

  const menuItems = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'shift', label: 'シフト作成', icon: Calendar },
    { id: 'employees', label: '従業員管理', icon: Users },
    { id: 'attendance', label: '勤怠管理', icon: Clock },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  // 日付から曜日を取得
  const getDayOfWeek = (dateStr) => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  // 月次データの集計
  const monthlyStats = {
    totalDays: monthlyAttendanceData.filter(d => d.scheduled !== '休み').length,
    actualDays: monthlyAttendanceData.filter(d => d.clock_in).length,
    totalHours: monthlyAttendanceData
      .filter(d => d.actual)
      .reduce((sum, d) => {
        const [hours, minutes] = d.actual.split(':').map(Number);
        return sum + hours * 60 + minutes;
      }, 0),
    totalOvertime: monthlyAttendanceData.reduce((sum, d) => sum + d.overtime, 0)
  };

  // 日次データの集計
  const dailyStats = {
    scheduled: dailyAttendanceData.filter(d => d.scheduled !== '休み').length,
    attended: dailyAttendanceData.filter(d => d.clock_in).length,
    totalOvertime: dailyAttendanceData.reduce((sum, d) => sum + d.overtime_minutes, 0)
  };

  // 編集モーダル
  const EditModal = ({ attendance, onClose }) => {
    const [formData, setFormData] = useState({
      clock_in: attendance?.clock_in || '',
      clock_out: attendance?.clock_out || '',
      break_minutes: attendance?.break_minutes || 60,
      edit_reason: ''
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">勤怠記録編集</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{attendance?.employee_name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedDate} ({getDayOfWeek(selectedDate)})
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  出勤時刻
                </label>
                <input
                  type="time"
                  value={formData.clock_in}
                  onChange={(e) => setFormData({...formData, clock_in: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  退勤時刻
                </label>
                <input
                  type="time"
                  value={formData.clock_out}
                  onChange={(e) => setFormData({...formData, clock_out: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                休憩時間（分）
              </label>
              <input
                type="number"
                value={formData.break_minutes}
                onChange={(e) => setFormData({...formData, break_minutes: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                min="0"
                step="15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                修正理由 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.edit_reason}
                onChange={(e) => setFormData({...formData, edit_reason: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                rows="2"
                placeholder="修正理由を入力してください"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
              キャンセル
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm flex items-center gap-1">
              <Save className="w-4 h-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="font-bold text-lg text-gray-900">ShiftMaster</span>
                  <p className="text-xs text-gray-500">シフト管理システム</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-gray-600" /> : <Menu className="w-4 h-4 text-gray-600" />}
            </button>
          </div>

          {sidebarOpen && (
            <select
              value={selectedStore.id}
              className="mt-4 w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="store-1">カフェ Sunny 渋谷店</option>
              <option value="store-2">カフェ Sunny 新宿店</option>
              <option value="store-3">カフェ Sunny 横浜店</option>
            </select>
          )}
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                      activeMenu === item.id
                        ? 'bg-orange-50 text-orange-600 font-medium border border-orange-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 ${!sidebarOpen && 'justify-center'}`}>
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>ログアウト</span>}
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* ヘッダー */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-900">勤怠管理</h1>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  勤怠表出力
                </button>
                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  CSV出力
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* ビュー切り替えタブ */}
          <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6 inline-flex">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'daily'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarDays className="w-4 h-4 inline mr-1.5" />
              日次ビュー
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'monthly'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1.5" />
              月次ビュー
            </button>
          </div>

          {/* 日次ビュー */}
          {viewMode === 'daily' && (
            <>
              {/* 日付選択とサマリー */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
                    />
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="text-lg font-medium text-gray-900">
                      {selectedDate.split('-')[1]}月{selectedDate.split('-')[2]}日（{getDayOfWeek(selectedDate)}）
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">出勤予定:</span>
                      <span className="font-medium text-gray-900">{dailyStats.scheduled}名</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">出勤済:</span>
                      <span className="font-medium text-green-600">{dailyStats.attended}名</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">残業計:</span>
                      <span className="font-medium text-orange-600">{dailyStats.totalOvertime}分</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 日次勤怠テーブル */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">従業員</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">シフト</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">出勤</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">退勤</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">休憩</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">実働</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">残業</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">位置</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dailyAttendanceData.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{record.employee_code}</span>
                            <span className="text-gray-900 font-medium">{record.employee_name}</span>
                            {record.edited && (
                              <span className="text-orange-600" title="編集済み">
                                <Edit2 className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`${record.scheduled === '休み' ? 'text-gray-400' : 'text-gray-700'}`}>
                            {record.scheduled}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.clock_in ? (
                            <span className="text-gray-900">{record.clock_in}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.clock_out ? (
                            <span className="text-gray-900">{record.clock_out}</span>
                          ) : record.clock_in ? (
                            <span className="text-orange-600 text-xs">未退勤</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700">
                          {record.break_minutes > 0 ? `${record.break_minutes}分` : '-'}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-gray-900">
                          {record.actual_hours || '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.overtime_minutes > 0 ? (
                            <span className="text-orange-600 font-medium">+{record.overtime_minutes}分</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.location_ok && record.clock_in ? (
                            <MapPin className="w-4 h-4 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.scheduled !== '休み' && (
                            <button 
                              onClick={() => {setSelectedAttendance(record); setShowEditModal(true);}}
                              className="p-1.5 hover:bg-gray-100 rounded text-orange-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* 月次ビュー */}
          {viewMode === 'monthly' && (
            <>
              {/* 月・従業員選択とサマリー */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
                    >
                      <option value="2025-01">2025年1月</option>
                      <option value="2025-02">2025年2月</option>
                      <option value="2025-03">2025年3月</option>
                    </select>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm font-medium"
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">出勤日数:</span>
                      <span className="font-medium text-gray-900">{monthlyStats.actualDays}/{monthlyStats.totalDays}日</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">総勤務時間:</span>
                      <span className="font-medium text-gray-900">
                        {Math.floor(monthlyStats.totalHours / 60)}時間{monthlyStats.totalHours % 60}分
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">残業時間:</span>
                      <span className="font-medium text-orange-600">
                        {Math.floor(monthlyStats.totalOvertime / 60)}時間{monthlyStats.totalOvertime % 60}分
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 月次勤怠テーブル */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">日付</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">シフト</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">出勤</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">退勤</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">実働</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">残業</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">備考</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthlyAttendanceData.map((record) => {
                      const isWeekend = record.day === '土' || record.day === '日';
                      const isToday = record.date === selectedDate;
                      
                      return (
                        <tr key={record.date} className={`hover:bg-gray-50 ${isWeekend ? 'bg-orange-50' : ''} ${isToday ? 'ring-2 ring-orange-500 ring-inset' : ''}`}>
                          <td className="px-4 py-3">
                            <span className="text-gray-900">
                              {record.date.slice(5)}
                            </span>
                            <span className={`ml-2 ${isWeekend ? 'text-orange-600' : 'text-gray-500'}`}>
                              ({record.day})
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`${record.scheduled === '休み' ? 'text-gray-400' : 'text-gray-700'}`}>
                              {record.scheduled}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {record.clock_in ? (
                              <span className="text-gray-900">{record.clock_in}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {record.clock_out ? (
                              <span className="text-gray-900">{record.clock_out}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-medium text-gray-900">
                            {record.actual || '-'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {record.overtime > 0 ? (
                              <span className="text-orange-600 font-medium">+{record.overtime}分</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {record.date === '2025-02-04' && (
                              <span className="text-xs text-orange-600">編集済</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {record.scheduled !== '休み' && (
                              <button 
                                onClick={() => setShowEditModal(true)}
                                className="p-1.5 hover:bg-gray-100 rounded text-orange-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr className="font-medium">
                      <td className="px-4 py-3 text-gray-900">合計</td>
                      <td className="px-4 py-3 text-center text-gray-900">{monthlyStats.totalDays}日</td>
                      <td colSpan="2" className="px-4 py-3 text-center text-gray-900">{monthlyStats.actualDays}日出勤</td>
                      <td className="px-4 py-3 text-center text-gray-900">
                        {Math.floor(monthlyStats.totalHours / 60)}:{(monthlyStats.totalHours % 60).toString().padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 text-center text-orange-600">
                        +{Math.floor(monthlyStats.totalOvertime / 60)}:{(monthlyStats.totalOvertime % 60).toString().padStart(2, '0')}
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}

          {/* 注意事項 */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
            <div className="text-xs text-amber-800">
              <p className="font-medium mb-1">勤怠管理の注意点</p>
              <ul className="space-y-0.5">
                <li>• 打刻修正を行った場合は必ず理由を記録してください</li>
                <li>• 日次ビューで当日の全従業員の勤怠を確認できます</li>
                <li>• 月次ビューで各従業員の月間勤怠状況を確認できます</li>
                <li>• 残業時間は自動計算されますが、月末に承認処理が必要です</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* モーダル */}
      {showEditModal && (
        <EditModal attendance={selectedAttendance} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default AttendanceManagementPage;