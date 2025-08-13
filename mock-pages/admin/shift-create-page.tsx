import React, { useState } from 'react';
import {
  Calendar, Users, ChevronLeft, Menu, LogOut, Settings, Clock, Home,
  CheckCircle, AlertCircle, ChevronRight, Save, Sparkles, UserCheck,
  FileText, X, Edit2, Plus, ArrowRight, Info, Target,
  AlertTriangle, Sliders, List, Eye, ChevronDown, ChevronUp,
  CalendarDays, UserX, FileUp, Grid3x3, BarChart, Trash2,
  Edit3, Download
} from 'lucide-react';

const ShiftCreatePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('shift');
  const [selectedStore] = useState({ id: 'store-1', name: 'カフェ Sunny 渋谷店' });
  const [currentStep, setCurrentStep] = useState(-1);
  const [selectedMonth, setSelectedMonth] = useState('2025-02');
  const [selectedRuleSet, setSelectedRuleSet] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [viewMode, setViewMode] = useState('shift');
  const [editingShift, setEditingShift] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [draftShift, setDraftShift] = useState({
    id: 'd1',
    month: '2025-01',
    ruleSet: '通常期',
    position: 'ホール',
    savedAt: '2025-01-28 14:30'
  });

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
  ];

  // ポジション設定（色分けのみで汎用的に）
  const positions = [
    { id: 'kitchen', name: 'キッチン', color: 'orange' },
    { id: 'hall', name: 'ホール', color: 'blue' },
    { id: 'cashier', name: 'レジ', color: 'green' }
  ];

  const employees = [
    { id: 'e1', name: '佐藤 太郎', positions: ['hall', 'cashier'], requestSubmitted: true, maxHours: 40 },
    { id: 'e2', name: '鈴木 花子', positions: ['kitchen'], requestSubmitted: true, maxHours: 35 },
    { id: 'e3', name: '田中 一郎', positions: ['hall'], requestSubmitted: false, maxHours: 40 },
    { id: 'e4', name: '山田 次郎', positions: ['kitchen', 'hall'], requestSubmitted: true, maxHours: 30 },
    { id: 'e5', name: '高橋 美咲', positions: ['cashier', 'hall'], requestSubmitted: true, maxHours: 25 },
    { id: 'e6', name: '伊藤 健太', positions: ['kitchen'], requestSubmitted: false, maxHours: 40 }
  ];

  const generateMonthRequests = (employeeId) => {
    const requests = [];
    const daysInMonth = 28;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `2025-02-${String(day).padStart(2, '0')}`;
      const random = Math.random();
      
      if (random < 0.7) {
        requests.push({
          date,
          availability: 'ok',
          start: '09:00',
          end: '17:00',
          note: ''
        });
      } else if (random < 0.85) {
        const timeOptions = [
          { start: '14:00', end: '22:00', note: '午後のみ可' },
          { start: '09:00', end: '14:00', note: '午前のみ可' },
          { start: '12:00', end: '20:00', note: '昼から可' }
        ];
        const selected = timeOptions[Math.floor(Math.random() * timeOptions.length)];
        requests.push({
          date,
          availability: 'maybe',
          ...selected
        });
      } else {
        const reasons = ['私用', '通院', '授業', '用事あり', '家族の都合'];
        requests.push({
          date,
          availability: 'ng',
          start: null,
          end: null,
          note: reasons[Math.floor(Math.random() * reasons.length)]
        });
      }
    }
    
    return requests;
  };

  const shiftRequests = {
    'e1': generateMonthRequests('e1'),
    'e2': generateMonthRequests('e2'),
    'e3': [],
    'e4': generateMonthRequests('e4'),
    'e5': generateMonthRequests('e5'),
    'e6': []
  };

  // NGの日にはシフトを入れないよう改善
  const generateFullMonthShifts = () => {
    const shifts = {};
    const daysInMonth = 28;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `2025-02-${String(day).padStart(2, '0')}`;
      const dayShifts = [];
      
      employees.forEach(emp => {
        const request = shiftRequests[emp.id]?.find(r => r.date === date);
        
        // NGの場合は絶対にシフトに入れない
        if (request?.availability === 'ng') return;
        
        // 未提出の場合も30%の確率で休み
        if (!request && Math.random() < 0.3) return;
        
        // OKまたはMaybeの場合のみシフトを生成
        if (request?.availability === 'ok' || request?.availability === 'maybe') {
          const position = emp.positions[Math.floor(Math.random() * emp.positions.length)];
          let start = '09:00';
          let end = '17:00';
          
          if (request?.availability === 'maybe') {
            // maybeの場合は希望時間に合わせる
            start = request.start || '14:00';
            end = request.end || '22:00';
          } else if (request?.start && request?.start !== '09:00') {
            // 特定の時間希望がある場合
            start = request.start;
            end = request.end;
          }
          
          dayShifts.push({
            employeeId: emp.id,
            position,
            start,
            end
          });
        } else if (!request) {
          // 未提出でも70%はシフトに入れる
          if (Math.random() < 0.7) {
            const position = emp.positions[Math.floor(Math.random() * emp.positions.length)];
            dayShifts.push({
              employeeId: emp.id,
              position,
              start: '09:00',
              end: '17:00'
            });
          }
        }
      });
      
      shifts[date] = dayShifts;
    }
    
    return shifts;
  };

  const [generatedShifts, setGeneratedShifts] = useState(generateFullMonthShifts());

  const requiredStaff = {
    kitchen: { '09:00': 1, '10:00': 1, '11:00': 2, '12:00': 3, '13:00': 3, '14:00': 2, '15:00': 2, '16:00': 2, '17:00': 2, '18:00': 3, '19:00': 3, '20:00': 2, '21:00': 1 },
    hall: { '09:00': 2, '10:00': 2, '11:00': 2, '12:00': 3, '13:00': 3, '14:00': 2, '15:00': 2, '16:00': 2, '17:00': 3, '18:00': 4, '19:00': 4, '20:00': 3, '21:00': 2 },
    cashier: { '09:00': 1, '10:00': 1, '11:00': 1, '12:00': 2, '13:00': 2, '14:00': 1, '15:00': 1, '16:00': 1, '17:00': 1, '18:00': 2, '19:00': 2, '20:00': 1, '21:00': 1 }
  };

  const menuItems = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'shift', label: 'シフト作成', icon: Calendar },
    { id: 'employees', label: '従業員管理', icon: Users },
    { id: 'attendance', label: '勤怠管理', icon: Clock },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  const steps = [
    { number: 0, title: '希望確認', icon: UserCheck },
    { number: 1, title: 'AI生成', icon: Sparkles },
    { number: 2, title: '調整・確定', icon: Target }
  ];

  const submissionRate = Math.round(
    (employees.filter(e => e.requestSubmitted).length / employees.length) * 100
  );

  const handleSelectRuleSet = (ruleSetId) => {
    setSelectedRuleSet(ruleSetId);
    setCurrentStep(0);
  };

  const handleAIGenerate = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setGeneratedShifts(generateFullMonthShifts());
      setAiGenerating(false);
      setCurrentStep(2);
    }, 2000);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const handleDraftSave = () => {
    const newDraft = {
      id: 'd1',
      month: selectedMonth,
      ruleSet: ruleSets.find(r => r.id === selectedRuleSet)?.name,
      position: selectedPosition === 'all' ? '全ポジション' : positions.find(p => p.id === selectedPosition)?.name,
      savedAt: new Date().toLocaleString('ja-JP')
    };
    setDraftShift(newDraft);
    alert('下書き保存しました');
  };

  const handleLoadDraft = () => {
    setSelectedMonth(draftShift.month);
    setCurrentStep(2);
  };

  const handleDeleteDraft = () => {
    setDraftShift(null);
  };

  const handleEditShift = (date, employeeId) => {
    const shift = generatedShifts[date]?.find(s => s.employeeId === employeeId);
    setEditingShift({
      date,
      employeeId,
      currentShift: shift || null,
      isNew: !shift
    });
    setShowEditModal(true);
  };

  const handleSaveEditShift = (date, employeeId, newShift) => {
    const updatedShifts = { ...generatedShifts };
    
    if (!updatedShifts[date]) {
      updatedShifts[date] = [];
    }
    
    updatedShifts[date] = updatedShifts[date].filter(s => s.employeeId !== employeeId);
    
    if (newShift && !newShift.isOff) {
      updatedShifts[date].push({
        employeeId,
        position: newShift.position,
        start: newShift.start,
        end: newShift.end
      });
    }
    
    setGeneratedShifts(updatedShifts);
    setShowEditModal(false);
    setEditingShift(null);
  };

  const handleExportCSV = () => {
    alert('CSV出力機能を実行します');
  };

  const getDayOfWeek = (dateStr) => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const calculateActualStaff = (date, position, hour) => {
    const shifts = generatedShifts[date] || [];
    let count = 0;
    shifts.forEach(shift => {
      if (shift.position === position) {
        const startHour = parseInt(shift.start.split(':')[0]);
        const endHour = parseInt(shift.end.split(':')[0]);
        if (hour >= startHour && hour < endHour) {
          count++;
        }
      }
    });
    return count;
  };

  const getFilteredEmployees = () => {
    if (selectedPosition === 'all') return employees;
    return employees.filter(emp => emp.positions.includes(selectedPosition));
  };

  // ポジションカラーヘルパー
  const getPositionColors = (positionId) => {
    const pos = positions.find(p => p.id === positionId);
    if (!pos) return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    
    const colorMap = {
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
      green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
      red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' }
    };
    
    return colorMap[pos.color] || colorMap.blue;
  };

  // シフト編集モーダル
  const ShiftEditModal = () => {
    if (!editingShift) return null;
    
    const employee = employees.find(e => e.id === editingShift.employeeId);
    const [isOff, setIsOff] = useState(!editingShift.currentShift);
    const [position, setPosition] = useState(editingShift.currentShift?.position || employee.positions[0]);
    const [start, setStart] = useState(editingShift.currentShift?.start || '09:00');
    const [end, setEnd] = useState(editingShift.currentShift?.end || '17:00');
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-96">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            シフト編集 - {employee.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {editingShift.date} ({getDayOfWeek(editingShift.date)})
          </p>
          
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isOff}
                onChange={(e) => setIsOff(e.target.checked)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">休み</span>
            </label>
            
            {!isOff && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ポジション
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    {employee.positions.map(pos => {
                      const p = positions.find(p => p.id === pos);
                      return (
                        <option key={pos} value={pos}>{p?.name}</option>
                      );
                    })}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      開始時間
                    </label>
                    <input
                      type="time"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      終了時間
                    </label>
                    <input
                      type="time"
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditingShift(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={() => handleSaveEditShift(
                editingShift.date,
                editingShift.employeeId,
                isOff ? { isOff: true } : { position, start, end, isOff: false }
              )}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">シフト作成</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedMonth.split('-')[0]}年{parseInt(selectedMonth.split('-')[1])}月のシフト
                  {selectedRuleSet && ` - ${ruleSets.find(r => r.id === selectedRuleSet)?.name}モード`}
                  {selectedPosition !== 'all' && ` - ${positions.find(p => p.id === selectedPosition)?.name}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-sm"
                >
                  <option value="2025-02">2025年2月</option>
                  <option value="2025-03">2025年3月</option>
                  <option value="2025-04">2025年4月</option>
                </select>
                {currentStep === 2 && (
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        保存中...
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        保存しました
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        シフトを確定
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* ルールセット選択画面 */}
          {currentStep === -1 && (
            <div className="space-y-6">
              {/* 下書き */}
              {draftShift && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">下書き</h2>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {draftShift.month} - {draftShift.ruleSet} - {draftShift.position}
                      </p>
                      <p className="text-xs text-gray-500">保存日時: {draftShift.savedAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleLoadDraft}
                        className="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
                      >
                        再開
                      </button>
                      <button
                        onClick={handleDeleteDraft}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ポジション選択（シンプル版） */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">作成対象ポジション</h2>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => setSelectedPosition('all')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedPosition === 'all'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <p className="font-medium text-gray-900">全ポジション</p>
                    <p className="text-xs text-gray-500 mt-1">一括作成</p>
                  </button>
                  {positions.map(pos => {
                    const colors = getPositionColors(pos.id);
                    return (
                      <button
                        key={pos.id}
                        onClick={() => setSelectedPosition(pos.id)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedPosition === pos.id
                            ? `${colors.border} ${colors.bg}`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <p className="font-medium text-gray-900">{pos.name}</p>
                        <p className="text-xs text-gray-500 mt-1">個別作成</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ルールセット選択 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">シフトルールを選択</h2>
                  <button 
                    onClick={() => window.location.href = '/shift-rules'}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                  >
                    <Settings className="w-4 h-4" />
                    ルール管理
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ruleSets.map(ruleSet => (
                    <div
                      key={ruleSet.id}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:border-orange-300 transition-all cursor-pointer group"
                      onClick={() => handleSelectRuleSet(ruleSet.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${
                          ruleSet.color === 'blue' ? 'bg-blue-100' :
                          ruleSet.color === 'orange' ? 'bg-orange-100' :
                          'bg-green-100'
                        }`}>
                          <Sliders className={`w-5 h-5 ${
                            ruleSet.color === 'blue' ? 'text-blue-600' :
                            ruleSet.color === 'orange' ? 'text-orange-600' :
                            'text-green-600'
                          }`} />
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-1">{ruleSet.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{ruleSet.description}</p>
                      <p className="text-xs text-gray-500">最終使用: {ruleSet.lastUsed}</p>
                      
                      <button className="w-full mt-4 py-2 bg-gray-50 group-hover:bg-orange-50 text-gray-700 group-hover:text-orange-600 rounded-lg transition-colors text-sm font-medium">
                        このルールで作成
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ステップインジケーター */}
          {currentStep >= 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <React.Fragment key={step.number}>
                      <div className="flex items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                            currentStep >= step.number
                              ? 'bg-orange-500 border-orange-500 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          {currentStep > step.number ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${
                            currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            Step {step.number + 1}
                          </p>
                          <p className={`text-xs ${
                            currentStep >= step.number ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {step.title}
                          </p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-4 transition-all ${
                          currentStep > step.number ? 'bg-orange-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 0: 希望確認（シンプル版） */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                      シフト希望 提出状況
                      {selectedPosition !== 'all' && ` - ${positions.find(p => p.id === selectedPosition)?.name}`}
                    </h2>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleExportCSV}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        CSV出力
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">提出率</span>
                        <span className="text-2xl font-bold text-orange-600">{submissionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-2 font-medium text-gray-700 sticky left-0 bg-white min-w-[120px]">従業員</th>
                          {[...Array(28)].map((_, idx) => {
                            const date = `2025-02-${String(idx + 1).padStart(2, '0')}`;
                            const dayOfWeek = getDayOfWeek(date);
                            const isWeekend = dayOfWeek === '土' || dayOfWeek === '日';
                            return (
                              <th key={idx} className={`text-center p-2 font-medium text-gray-700 min-w-[100px] ${isWeekend ? 'bg-orange-50' : ''}`}>
                                <div>{idx + 1}日</div>
                                <div className="text-xs font-normal">{dayOfWeek}</div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredEmployees().map(employee => (
                          <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-2 font-medium sticky left-0 bg-white">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                                  employee.requestSubmitted ? 'bg-green-500' : 'bg-gray-400'
                                }`}>
                                  {employee.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-gray-900">{employee.name}</p>
                                  <div className="flex gap-1">
                                    {employee.positions.map(posId => {
                                      const pos = positions.find(p => p.id === posId);
                                      const colors = getPositionColors(posId);
                                      return (
                                        <span key={posId} className={`text-xs px-1 rounded ${colors.bg} ${colors.text}`}>
                                          {pos?.name.charAt(0)}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </td>
                            {[...Array(28)].map((_, idx) => {
                              const date = `2025-02-${String(idx + 1).padStart(2, '0')}`;
                              const request = shiftRequests[employee.id]?.find(r => r.date === date);
                              const dayOfWeek = getDayOfWeek(date);
                              const isWeekend = dayOfWeek === '土' || dayOfWeek === '日';
                              
                              if (!request) {
                                return (
                                  <td key={idx} className={`p-2 text-center ${isWeekend ? 'bg-orange-50' : ''}`}>
                                    <span className="text-gray-400">未提出</span>
                                  </td>
                                );
                              }
                              
                              return (
                                <td key={idx} className={`p-2 text-center ${isWeekend ? 'bg-orange-50' : ''}`}>
                                  {request.availability === 'ok' ? (
                                    request.start === '09:00' && request.end === '17:00' ? (
                                      <span className="text-green-600 font-medium">◯</span>
                                    ) : (
                                      <span className="text-blue-600 text-xs font-medium">
                                        {request.start?.slice(0, 5)}-{request.end?.slice(0, 5)}
                                      </span>
                                    )
                                  ) : request.availability === 'maybe' ? (
                                    <div>
                                      <span className="text-yellow-600 text-xs font-medium">
                                        {request.start?.slice(0, 5)}-{request.end?.slice(0, 5)}
                                      </span>
                                      <div className="text-xs text-gray-500">{request.note}</div>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="text-red-600 font-medium">不可</span>
                                      <div className="text-xs text-gray-500">{request.note}</div>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={() => setCurrentStep(-1)}
                      className="px-6 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      ルール選択に戻る
                    </button>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      AI生成へ進む
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: AI生成 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">AI自動生成</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">適用ルール</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {ruleSets.find(r => r.id === selectedRuleSet)?.name}
                    </p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">対象ポジション</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {selectedPosition === 'all' ? '全ポジション' : positions.find(p => p.id === selectedPosition)?.name}
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">希望提出率</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{submissionRate}%</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">対象人数</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{getFilteredEmployees().length}名</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-900 font-medium mb-2">
                      AIが最適なシフトを生成します
                    </p>
                    <p className="text-sm text-gray-600 mb-6">
                      従業員の希望とルール設定を考慮して最適化
                    </p>
                    <button
                      onClick={handleAIGenerate}
                      disabled={aiGenerating}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                      {aiGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          シフトを生成
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="px-6 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    戻る
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 調整・確定 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">シフト調整・確定</h2>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setViewMode('shift')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                          viewMode === 'shift' 
                            ? 'bg-orange-100 text-orange-600 font-medium' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Grid3x3 className="w-4 h-4" />
                        シフト表
                      </button>
                      <button
                        onClick={() => setViewMode('staffcount')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                          viewMode === 'staffcount' 
                            ? 'bg-orange-100 text-orange-600 font-medium' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <BarChart className="w-4 h-4" />
                        人員数
                      </button>
                      <button 
                        onClick={handleExportCSV}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        CSV出力
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {viewMode === 'shift' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left p-2 font-medium text-gray-700 sticky left-0 bg-white min-w-[120px]">従業員</th>
                            {[...Array(28)].map((_, idx) => {
                              const date = `2025-02-${String(idx + 1).padStart(2, '0')}`;
                              const dayOfWeek = getDayOfWeek(date);
                              const isWeekend = dayOfWeek === '土' || dayOfWeek === '日';
                              return (
                                <th key={idx} className={`text-center p-2 font-medium text-gray-700 min-w-[100px] ${isWeekend ? 'bg-orange-50' : ''}`}>
                                  <div>{idx + 1}日</div>
                                  <div className="text-xs font-normal">{dayOfWeek}</div>
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredEmployees().map(emp => {
                            return (
                              <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-2 font-medium sticky left-0 bg-white">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                                      {emp.name.charAt(0)}
                                    </div>
                                    <span>{emp.name}</span>
                                  </div>
                                </td>
                                {[...Array(28)].map((_, idx) => {
                                  const date = `2025-02-${String(idx + 1).padStart(2, '0')}`;
                                  const shifts = generatedShifts[date] || [];
                                  const shift = shifts.find(s => s.employeeId === emp.id);
                                  const request = shiftRequests[emp.id]?.find(r => r.date === date);
                                  const dayOfWeek = getDayOfWeek(date);
                                  const isWeekend = dayOfWeek === '土' || dayOfWeek === '日';
                                  const colors = shift ? getPositionColors(shift.position) : null;
                                  
                                  return (
                                    <td 
                                      key={idx} 
                                      className={`p-1 text-center ${isWeekend ? 'bg-orange-50' : ''} relative group cursor-pointer hover:bg-gray-100`}
                                      onClick={() => handleEditShift(date, emp.id)}
                                    >
                                      {shift ? (
                                        <div className="space-y-0.5">
                                          <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                                            {positions.find(p => p.id === shift.position)?.name}
                                          </div>
                                          <div className="text-xs text-gray-700 font-medium">
                                            {shift.start.slice(0, 5)}-{shift.end.slice(0, 5)}
                                          </div>
                                          {request && (
                                            <div className="text-xs text-gray-400 opacity-70">
                                              希望: {
                                                request.availability === 'ok' ? 
                                                  (request.start === '09:00' && request.end === '17:00' ? '◯' : 
                                                   `${request.start.slice(0, 5)}-${request.end.slice(0, 5)}`) :
                                                request.availability === 'maybe' ? '△' : '✕'
                                              }
                                            </div>
                                          )}
                                          <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit3 className="w-3 h-3 text-gray-500" />
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="py-2">
                                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-medium">
                                            休み
                                          </span>
                                          {request && (
                                            <div className="text-xs text-gray-400 mt-0.5 opacity-70">
                                              希望: {
                                                request.availability === 'ok' ? 
                                                  (request.start === '09:00' && request.end === '17:00' ? '◯' : 
                                                   `${request.start.slice(0, 5)}-${request.end.slice(0, 5)}`) :
                                                request.availability === 'maybe' ? '△' : '✕'
                                              }
                                            </div>
                                          )}
                                          <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit3 className="w-3 h-3 text-gray-500" />
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left p-3 font-medium text-gray-700">ポジション</th>
                            <th className="text-left p-3 font-medium text-gray-700">時間</th>
                            {[...Array(13)].map((_, idx) => (
                              <th key={idx} className="text-center p-3 font-medium text-gray-700 min-w-[60px]">
                                {9 + idx}:00
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedPosition === 'all' ? positions : positions.filter(p => p.id === selectedPosition)).map(position => {
                            const colors = getPositionColors(position.id);
                            return (
                              <React.Fragment key={position.id}>
                                <tr className="border-b border-gray-100">
                                  <td rowSpan={2} className="p-3 font-medium">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${colors.bg} ${colors.text}`}>
                                      {position.name}
                                    </div>
                                  </td>
                                  <td className="p-3 text-gray-600">必要</td>
                                  {[...Array(13)].map((_, idx) => {
                                    const hour = 9 + idx;
                                    const required = requiredStaff[position.id][`${hour}:00`] || 0;
                                    return (
                                      <td key={idx} className="p-3 text-center font-medium">
                                        {required}
                                      </td>
                                    );
                                  })}
                                </tr>
                                <tr className="border-b border-gray-200">
                                  <td className="p-3 text-gray-600">実際</td>
                                  {[...Array(13)].map((_, idx) => {
                                    const hour = 9 + idx;
                                    const actual = calculateActualStaff('2025-02-01', position.id, hour);
                                    const required = requiredStaff[position.id][`${hour}:00`] || 0;
                                    const diff = actual - required;
                                    
                                    return (
                                      <td key={idx} className={`p-3 text-center font-medium ${
                                        diff < 0 ? 'bg-red-50 text-red-700' :
                                        diff > 0 ? 'bg-blue-50 text-blue-700' :
                                        'bg-green-50 text-green-700'
                                      }`}>
                                        {actual}
                                        {diff !== 0 && (
                                          <span className="text-xs ml-1">
                                            ({diff > 0 ? '+' : ''}{diff})
                                          </span>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      再生成
                    </button>
                    <div className="flex gap-3">
                      <button 
                        onClick={handleDraftSave}
                        className="px-6 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        下書き保存
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors font-medium text-sm flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        シフトを確定
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showEditModal && <ShiftEditModal />}
    </div>
  );
};

export default ShiftCreatePage;