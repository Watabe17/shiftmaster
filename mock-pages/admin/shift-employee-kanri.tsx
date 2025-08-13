import React, { useState } from 'react';
import {
  Calendar, Users, ChevronLeft, Menu, LogOut, Settings, Clock, Home,
  Search, Plus, Edit2, Trash2, UserPlus, FileText, Download, Upload,
  Filter, X, Check, AlertCircle, ChevronDown, MoreVertical,
  Mail, Phone, Shield, Building, CalendarDays, Info, AlertTriangle,
  FileCheck, CreditCard, UserCheck, Briefcase, User
} from 'lucide-react';

const EmployeeManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('employees');
  const [selectedStore] = useState({ id: 'store-1', name: 'カフェ Sunny 渋谷店' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmploymentType, setFilterEmploymentType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null);
  const [inviteLinks, setInviteLinks] = useState<Record<string, { url: string; expiresAt: string }>>({});
  const [qrModalEmployee, setQrModalEmployee] = useState<string | null>(null);

  // 雇用形態
  const employmentTypes = [
    { id: 'full_time', name: '正社員', short: '正' },
    { id: 'part_time', name: 'パート', short: 'パ' },
    { id: 'contract', name: '契約', short: '契' }
  ];

  // ポジション
  const positions = [
    { id: 'kitchen', name: 'キッチン', color: 'bg-orange-100 text-orange-700' },
    { id: 'hall', name: 'ホール', color: 'bg-blue-100 text-blue-700' },
    { id: 'cashier', name: 'レジ', color: 'bg-green-100 text-green-700' },
    { id: 'manager', name: 'マネージャー', color: 'bg-purple-100 text-purple-700' }
  ];

  // サンプル従業員データ（簡略化）
  const [employees, setEmployees] = useState([
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
      monthly_current: 145, // 今月の労働時間
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
      maxOffRequests: 8,
      monthly_current: 98,
      address: '東京都新宿区〇〇3-4-5'
    },
    {
      id: 'e4',
      employeeCode: 'EMP004',
      name: '山田 次郎',
      kana: 'ヤマダ ジロウ',
      employment_type: 'contract',
      positions: ['kitchen', 'hall'],
      role: 'employee',
      authStatus: 'disabled',
      hire_date: '2024-06-01',
      contract_end: '2025-05-31',
      is_active: false,
      email: 'yamada@example.com',
      phone: '090-4567-8901',
      paid_leave: { total: 10, used: 3, remaining: 7 },
      social_insurance: { health: true, pension: true, employment: true },
      monthly_limit: 160,
      maxOffRequests: 0,
      monthly_current: 0,
      address: '東京都渋谷区〇〇4-5-6'
    },
    {
      id: 'e5',
      employeeCode: 'EMP005',
      name: '高橋 美咲',
      kana: 'タカハシ ミサキ',
      employment_type: 'part_time',
      positions: ['cashier', 'hall'],
      role: 'employee',
      authStatus: 'active',
      hire_date: '2024-09-01',
      contract_end: null,
      is_active: true,
      email: 'takahashi@example.com',
      phone: '090-5678-9012',
      paid_leave: { total: 3, used: 0, remaining: 3 },
      social_insurance: { health: false, pension: false, employment: true },
      monthly_limit: 80,
      maxOffRequests: 6,
      monthly_current: 65,
      address: '東京都目黒区〇〇5-6-7'
    },
    {
      id: 'e6',
      employeeCode: 'EMP006',
      name: '伊藤 健太',
      kana: 'イトウ ケンタ',
      employment_type: 'full_time',
      positions: ['manager'],
      role: 'admin',
      authStatus: 'active',
      hire_date: '2021-04-01',
      contract_end: null,
      is_active: true,
      email: 'ito@example.com',
      phone: '090-6789-0123',
      paid_leave: { total: 24, used: 10, remaining: 14 },
      social_insurance: { health: true, pension: true, employment: true },
      monthly_limit: 180,
      maxOffRequests: 2,
      monthly_current: 168,
      address: '東京都品川区〇〇6-7-8'
    }
  ]);

  const menuItems = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'shift', label: 'シフト作成', icon: Calendar },
    { id: 'employees', label: '従業員管理', icon: Users },
    { id: 'attendance', label: '勤怠管理', icon: Clock },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  // フィルタリング処理
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.includes(searchQuery) || 
                         employee.kana.includes(searchQuery) ||
                         employee.email.includes(searchQuery) ||
                         employee.employeeCode.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && employee.is_active) ||
                         (filterStatus === 'inactive' && !employee.is_active);
    const matchesEmploymentType = filterEmploymentType === 'all' || employee.employment_type === filterEmploymentType;
    
    return matchesSearch && matchesStatus && matchesEmploymentType;
  });

  const handleToggleActive = (employeeId) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId ? { ...emp, is_active: !emp.is_active } : emp
    ));
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredEmployees.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredEmployees.map(e => e.id));
    }
  };

  const handleSelectRow = (employeeId) => {
    if (selectedRows.includes(employeeId)) {
      setSelectedRows(selectedRows.filter(id => id !== employeeId));
    } else {
      setSelectedRows([...selectedRows, employeeId]);
    }
  };

  const handleToggleMenu = (employeeId: string) => {
    setOpenMenuRow((prev) => (prev === employeeId ? null : employeeId));
  };

  const generateExpiry = (hours: number) => {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    return d.toISOString().slice(0, 16).replace('T', ' ');
  };

  const handleGenerateInviteLink = (employeeId: string, hours = 72) => {
    const token = Math.random().toString(36).slice(2, 10);
    const url = `${window.location.origin}/onboard?token=${token}&u=${employeeId}`;
    setInviteLinks((prev) => ({ ...prev, [employeeId]: { url, expiresAt: generateExpiry(hours) } }));
    setEmployees((prev) => prev.map(emp => emp.id === employeeId ? { ...emp, authStatus: 'invited' } : emp));
    setOpenMenuRow(null);
    alert('招待リンクを生成しました');
  };

  const handleCopyInviteLink = async (employeeId: string) => {
    const link = inviteLinks[employeeId]?.url;
    if (!link) return alert('先に招待リンクを生成してください');
    try { await navigator.clipboard.writeText(link); alert('リンクをコピーしました'); } catch { alert('コピーできませんでした'); }
    setOpenMenuRow(null);
  };

  const handleRevokeInviteLink = (employeeId: string) => {
    setInviteLinks((prev) => { const { [employeeId]: _, ...rest } = prev; return rest; });
    setOpenMenuRow(null);
    alert('招待リンクを失効しました');
  };

  const handleShowQR = (employeeId: string) => {
    if (!inviteLinks[employeeId]?.url) {
      alert('先に招待リンクを生成してください');
      return;
    }
    setQrModalEmployee(employeeId);
    setOpenMenuRow(null);
  };

  // モーダルコンポーネント
  const AddEditModal = ({ isEdit = false, employee = null, onClose }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState(
      employee || {
        employeeCode: '',
        name: '',
        kana: '',
        email: '',
        phone: '',
        role: 'employee',
        positions: [],
        employment_type: 'part_time',
        hire_date: '',
        contract_end: '',
        monthly_limit: 120,
        social_insurance: { health: false, pension: false, employment: true },
        paid_leave: { total: 0, used: 0, remaining: 0 },
        address: '',
        authStatus: 'invited'
      }
    );
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              {isEdit ? '従業員情報編集' : '新規従業員登録'}
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* タブ */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-6">
              {[
                { id: 'basic', label: '基本情報', icon: User },
                { id: 'employment', label: '雇用情報', icon: Briefcase },
                { id: 'insurance', label: '社会保険・有給', icon: Shield },
                { id: 'account', label: 'アカウント', icon: UserCheck }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 border-b-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === tab.id 
                      ? 'border-orange-500 text-orange-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      従業員コード <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.employeeCode}
                      onChange={(e) => setFormData({...formData, employeeCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="EMP001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      権限 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    >
                      <option value="employee">従業員</option>
                      <option value="admin">管理者</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      氏名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="山田 太郎"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カナ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.kana}
                      onChange={(e) => setFormData({...formData, kana: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="ヤマダ タロウ"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="090-1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    住所
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="東京都渋谷区〇〇1-2-3"
                  />
                </div>
              </div>
            )}

            {activeTab === 'employment' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      雇用形態 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.employment_type}
                      onChange={(e) => setFormData({...formData, employment_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    >
                      {employmentTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      月間労働時間上限
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.monthly_limit}
                        onChange={(e) => setFormData({...formData, monthly_limit: e.target.value})}
                        className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="160"
                      />
                      <span className="absolute right-3 top-2.5 text-gray-500 text-sm">時間</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      休み希望上限（日/月）
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.maxOffRequests ?? ''}
                        onChange={(e) => setFormData({...formData, maxOffRequests: e.target.value === '' ? undefined : Number(e.target.value)})}
                        className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="（未設定）"
                        min={0}
                      />
                      <span className="absolute right-3 top-2.5 text-gray-500 text-sm">日</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">空欄=未設定（雇用形態の既定を適用）</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      入社日 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      契約期限
                      {formData.employment_type === 'contract' && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      type="date"
                      value={formData.contract_end}
                      onChange={(e) => setFormData({...formData, contract_end: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      disabled={formData.employment_type !== 'contract'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    対応可能ポジション <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {positions.map(position => (
                      <button
                        key={position.id}
                        type="button"
                        onClick={() => {
                          const newPositions = formData.positions.includes(position.id)
                            ? formData.positions.filter(p => p !== position.id)
                            : [...formData.positions, position.id];
                          setFormData({...formData, positions: newPositions});
                        }}
                        className={`px-3 py-1.5 rounded-lg border transition-all ${
                          formData.positions.includes(position.id)
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {position.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Info className="w-4 h-4 inline mr-1" />
                    月間労働時間上限はシフト作成時に自動的に考慮されます
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'insurance' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    社会保険加入状況
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.social_insurance.health}
                        onChange={(e) => setFormData({
                          ...formData,
                          social_insurance: {...formData.social_insurance, health: e.target.checked}
                        })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">健康保険</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.social_insurance.pension}
                        onChange={(e) => setFormData({
                          ...formData,
                          social_insurance: {...formData.social_insurance, pension: e.target.checked}
                        })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">厚生年金</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.social_insurance.employment}
                        onChange={(e) => setFormData({
                          ...formData,
                          social_insurance: {...formData.social_insurance, employment: e.target.checked}
                        })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">雇用保険</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      有給付与日数
                    </label>
                    <input
                      type="number"
                      value={formData.paid_leave.total}
                      onChange={(e) => setFormData({
                        ...formData,
                        paid_leave: {...formData.paid_leave, total: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      消化日数
                    </label>
                    <input
                      type="number"
                      value={formData.paid_leave.used}
                      onChange={(e) => setFormData({
                        ...formData,
                        paid_leave: {...formData.paid_leave, used: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      残日数
                    </label>
                    <input
                      type="number"
                      value={formData.paid_leave.total - formData.paid_leave.used}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      アカウント状態
                    </label>
                    <select
                      value={formData.authStatus}
                      onChange={(e) => setFormData({...formData, authStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    >
                      <option value="invited">招待済</option>
                      <option value="active">有効</option>
                      <option value="disabled">無効</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">保存時に認証基盤と同期されます（招待/無効化）。</p>
                  </div>
                </div>

                {/* 招待リンク/QR（メール不要 運用） */}
                {employee ? (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">招待リンク（72h）</label>
                      <div className="text-xs text-gray-600 break-all bg-gray-50 border border-gray-200 rounded p-2">
                        {inviteLinks[employee.id]?.url || '未生成（「招待リンクを生成」を押してください）'}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">有効期限: {inviteLinks[employee.id]?.expiresAt || '-'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleGenerateInviteLink(employee.id, 72)} className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">招待リンクを生成</button>
                      <button onClick={() => handleCopyInviteLink(employee.id)} className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">リンクをコピー</button>
                      <button onClick={() => handleShowQR(employee.id)} className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">QRを表示</button>
                      <button onClick={() => handleRevokeInviteLink(employee.id)} className="px-3 py-1.5 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50">既存リンクを失効</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    従業員を登録後に招待リンク/QRを生成できます。
                  </div>
                )}

                {/* メール運用する場合のみ（任意） */}
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">招待メール再送</button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">パスワードリセットメール</button>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
              キャンセル
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm">
              {isEdit ? '更新' : '登録'}
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
                <h1 className="text-xl font-bold text-gray-900">従業員管理</h1>
                <span className="text-sm text-gray-500">全{employees.length}名（稼働中{employees.filter(e => e.is_active).length}名）</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  CSV取込
                </button>
                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  エクスポート
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  新規登録
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* フィルター */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="名前、カナ、メール、従業員コードで検索"
                    className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
              </div>
              <select
                value={filterEmploymentType}
                onChange={(e) => setFilterEmploymentType(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
              >
                <option value="all">全雇用形態</option>
                {employmentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
              >
                <option value="all">全ステータス</option>
                <option value="active">稼働中</option>
                <option value="inactive">休止中</option>
              </select>
            </div>
          </div>

          {/* データテーブル */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-8 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredEmployees.length && filteredEmployees.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">従業員</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">雇用形態</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">ポジション</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-700">有給残</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-700">社会保険</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-700">月間上限</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-700">今月実績</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-700">ステータス</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-700">アカウント</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => {
                    const limitRatio = employee.monthly_current / employee.monthly_limit;
                    return (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(employee.id)}
                            onChange={() => handleSelectRow(employee.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{employee.employeeCode}</span>
                            <button 
                              onClick={() => {setSelectedEmployee(employee); setShowEditModal(true);}}
                              className="text-gray-900 hover:text-orange-600 font-medium"
                            >
                              {employee.name}
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-0.5 text-xs rounded ${
                            employee.employment_type === 'full_time' ? 'bg-blue-100 text-blue-700' :
                            employee.employment_type === 'part_time' ? 'bg-green-100 text-green-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {employmentTypes.find(t => t.id === employee.employment_type)?.name}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {employee.positions.map(posId => {
                              const pos = positions.find(p => p.id === posId);
                              return (
                                <span key={posId} className={`text-xs px-2 py-0.5 rounded ${pos?.color}`}>
                                  {pos?.name}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`text-sm ${employee.paid_leave.remaining < 5 ? 'text-orange-600 font-medium' : 'text-gray-700'}`}>
                            {employee.paid_leave.remaining}日
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {employee.social_insurance.health && employee.social_insurance.pension ? (
                            <span className="text-green-600 text-lg">●</span>
                          ) : employee.social_insurance.employment ? (
                            <span className="text-yellow-600 text-lg">▲</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center text-sm text-gray-700">{employee.monthly_limit}h</td>
                        <td className="px-3 py-2 text-center text-sm">
                          <span className={limitRatio > 0.9 ? 'text-red-600 font-medium' : limitRatio > 0.8 ? 'text-orange-600' : 'text-gray-700'}>
                            {employee.monthly_current}h
                          </span>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                              className={`h-1 rounded-full transition-all ${
                                limitRatio > 0.9 ? 'bg-red-500' : 
                                limitRatio > 0.8 ? 'bg-orange-500' : 
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(limitRatio * 100, 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleToggleActive(employee.id)}
                            className={`text-xs px-3 py-1 rounded ${
                              employee.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {employee.is_active ? '稼働中' : '休止中'}
                          </button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => handleToggleMenu(employee.id)}
                              className="px-2 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-50"
                            >
                              {employee.authStatus === 'active' ? '有効' : employee.authStatus === 'invited' ? '招待済' : '無効'}
                            </button>
                            {openMenuRow === employee.id && (
                              <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded shadow-md z-10">
                                <div className="px-3 py-2 text-xs text-gray-500 border-b">招待リンク/QR（メール不要）</div>
                                <button onClick={() => handleGenerateInviteLink(employee.id, 72)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">招待リンクを生成（72h）</button>
                                <button onClick={() => handleCopyInviteLink(employee.id)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">リンクをコピー</button>
                                <button onClick={() => handleShowQR(employee.id)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">QRを表示</button>
                                <button onClick={() => handleRevokeInviteLink(employee.id)} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">既存リンクを失効</button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button 
                            onClick={() => {setSelectedEmployee(employee); setShowEditModal(true);}}
                            className="p-1 hover:bg-gray-100 rounded text-orange-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ページネーション */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedRows.length > 0 && (
                  <span>{selectedRows.length}件選択中</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                  前へ
                </button>
                <span className="text-sm text-gray-600">1 / 1</span>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                  次へ
                </button>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
            <div className="text-xs text-amber-800">
              <p className="font-medium mb-1">労務管理の注意点</p>
              <ul className="space-y-0.5">
                <li>• 有給残日数が5日未満の従業員は早めに消化を促してください（年5日取得義務）</li>
                <li>• 月間労働時間が上限の90%を超えると赤色、80%を超えるとオレンジ色で表示されます</li>
                <li>• 社会保険の加入状況を定期的に確認し、適切な手続きを行ってください</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* モーダル */}
      {qrModalEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setQrModalEmployee(null)}>
          <div className="bg-white rounded-lg p-6 w-[380px]" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">招待QRコード</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-700 break-all">
                {inviteLinks[qrModalEmployee]?.url || 'リンク未生成'}
              </p>
              <div className="flex items-center justify-center">
                <div className="w-56 h-56 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                  QR PREVIEW
                </div>
              </div>
              <p className="text-xs text-gray-500">有効期限: {inviteLinks[qrModalEmployee]?.expiresAt || '-'}</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded text-sm" onClick={() => setQrModalEmployee(null)}>閉じる</button>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <AddEditModal isEdit={false} onClose={() => setShowAddModal(false)} />
      )}
      {showEditModal && selectedEmployee && (
        <AddEditModal isEdit={true} employee={selectedEmployee} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default EmployeeManagementPage;