import React, { useState } from 'react';
import {
  Settings, Calendar, ChevronLeft, Menu, LogOut, Home, Users, Clock,
  Save, MapPin, Phone, Mail, Building, Timer, Coffee,
  AlertCircle, CheckCircle, Info, Plus, Trash2, GripVertical,
  ChevronDown, ChevronUp, X, Copy, Shield, Sliders, Target
} from 'lucide-react';

const ShopSettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('settings');
  const [activeTab, setActiveTab] = useState('basic');
  const [saveStatus, setSaveStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 基本情報
  const [basicInfo, setBasicInfo] = useState({
    name: 'カフェ Sunny 渋谷店',
    address: '東京都渋谷区道玄坂1-2-3 ABCビル1F',
    phone: '03-1234-5678',
    email: 'shibuya@cafe-sunny.jp',
    latitude: 35.658034,
    longitude: 139.701636,
    clockRadius: 50
  });

  // 営業時間
  const [businessHours, setBusinessHours] = useState([
    { day: '月', open: '07:00', close: '22:00', isClosed: false, crossMidnight: false },
    { day: '火', open: '07:00', close: '22:00', isClosed: false, crossMidnight: false },
    { day: '水', open: '07:00', close: '22:00', isClosed: false, crossMidnight: false },
    { day: '木', open: '07:00', close: '22:00', isClosed: false, crossMidnight: false },
    { day: '金', open: '07:00', close: '23:00', isClosed: false, crossMidnight: false },
    { day: '土', open: '08:00', close: '23:00', isClosed: false, crossMidnight: false },
    { day: '日', open: '08:00', close: '21:00', isClosed: false, crossMidnight: false }
  ]);

  // 打刻・計上ルール
  const [attendanceRules, setAttendanceRules] = useState({
    allowOutsideHours: true,
    earlyStartMinutes: 15,
    lateEndMinutes: 30,
    clockInRoundUnit: 5,
    clockInRoundMode: 'floor',
    clockOutRoundUnit: 5,
    clockOutRoundMode: 'ceil',
    overtimeRoundUnit: 15,
    overtimeRoundMode: 'floor',
    graceLateMinutes: 5,
    graceEarlyLeaveMinutes: 5
  });

  // 休憩ルール
  const [breakRules, setBreakRules] = useState([
    { id: 1, minWorkMinutes: 360, breakMinutes: 45, autoInsert: true, paid: false },
    { id: 2, minWorkMinutes: 480, breakMinutes: 60, autoInsert: true, paid: false }
  ]);

  // ポジション
  const [positions, setPositions] = useState([
    { id: 'p1', code: 'KIT', name: 'キッチン', color: 'orange', order: 1, active: true },
    { id: 'p2', code: 'HAL', name: 'ホール', color: 'blue', order: 2, active: true },
    { id: 'p3', code: 'REG', name: 'レジ', color: 'green', order: 3, active: true },
    { id: 'p4', code: 'MGR', name: 'マネージャー', color: 'purple', order: 4, active: true }
  ]);

  // 高度な設定
  const [advancedSettings, setAdvancedSettings] = useState({
    dayBoundaryHour: 5,
    defaultMaxOffRequests: 5
  });

  const menuItems = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'shift', label: 'シフト作成', icon: Calendar },
    { id: 'employees', label: '従業員管理', icon: Users },
    { id: 'attendance', label: '勤怠管理', icon: Clock },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  const tabs = [
    { id: 'basic', label: '基本情報', icon: Building },
    { id: 'hours', label: '営業時間・定休日', icon: Clock },
    { id: 'attendance', label: '打刻・計上ルール', icon: Timer },
    { id: 'break', label: '休憩ルール', icon: Coffee },
    { id: 'positions', label: 'ポジション管理', icon: Users },
    { id: 'advanced', label: '高度な設定', icon: Sliders }
  ];

  const positionColors = [
    { value: 'orange', label: 'オレンジ', class: 'bg-orange-100 text-orange-700' },
    { value: 'blue', label: 'ブルー', class: 'bg-blue-100 text-blue-700' },
    { value: 'green', label: 'グリーン', class: 'bg-green-100 text-green-700' },
    { value: 'purple', label: 'パープル', class: 'bg-purple-100 text-purple-700' },
    { value: 'red', label: 'レッド', class: 'bg-red-100 text-red-700' }
  ];

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const addBreakRule = () => {
    setBreakRules([...breakRules, {
      id: Date.now(),
      minWorkMinutes: 240,
      breakMinutes: 30,
      autoInsert: true,
      paid: false
    }]);
    setHasUnsavedChanges(true);
  };

  const deleteBreakRule = (id) => {
    setBreakRules(breakRules.filter(rule => rule.id !== id));
    setHasUnsavedChanges(true);
  };

  const addPosition = () => {
    const newPosition = {
      id: `p${Date.now()}`,
      code: '',
      name: '',
      color: 'blue',
      order: positions.length + 1,
      active: true
    };
    setPositions([...positions, newPosition]);
    setHasUnsavedChanges(true);
  };

  const deletePosition = (id) => {
    setPositions(positions.filter(pos => pos.id !== id));
    setHasUnsavedChanges(true);
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
                <h1 className="text-2xl font-bold text-gray-900">店舗設定</h1>
                <p className="text-sm text-gray-600 mt-1">シフト作成・勤怠管理の基本設定</p>
              </div>
              <div className="flex items-center gap-3">
                {hasUnsavedChanges && (
                  <span className="text-sm text-orange-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    未保存の変更があります
                  </span>
                )}
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
                      変更を保存
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* タブメニュー */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${
                      activeTab === tab.id ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 基本情報タブ */}
          {activeTab === 'basic' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">基本情報</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      店舗名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={basicInfo.name}
                      onChange={(e) => {
                        setBasicInfo({...basicInfo, name: e.target.value});
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      value={basicInfo.phone}
                      onChange={(e) => {
                        setBasicInfo({...basicInfo, phone: e.target.value});
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    住所 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={basicInfo.address}
                    onChange={(e) => {
                      setBasicInfo({...basicInfo, address: e.target.value});
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    通知メールアドレス
                  </label>
                  <input
                    type="email"
                    value={basicInfo.email}
                    onChange={(e) => {
                      setBasicInfo({...basicInfo, email: e.target.value});
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">シフト確定通知などが送信されます</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    打刻位置設定
                  </h3>
                  
                  {/* 簡単設定方法の案内 */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                      📍 かんたん設定方法
                    </p>
                    <ol className="text-xs text-blue-700 space-y-1 ml-4">
                      <li>1. Googleマップで店舗を検索</li>
                      <li>2. 地図上で右クリック → 座標が表示されます</li>
                      <li>3. 座標をコピーして下記に貼り付け</li>
                    </ol>
                    <button
                      onClick={() => window.open('https://maps.google.com', '_blank')}
                      className="mt-2 px-3 py-1 bg-white text-blue-600 border border-blue-300 rounded text-xs hover:bg-blue-50"
                    >
                      Googleマップを開く
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* 座標貼り付け用の入力欄 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        座標を貼り付け（例: 35.658034, 139.701636）
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Googleマップからコピーした座標を貼り付け"
                          onChange={(e) => {
                            const coords = e.target.value.split(',').map(s => s.trim());
                            if (coords.length === 2) {
                              const lat = parseFloat(coords[0]);
                              const lng = parseFloat(coords[1]);
                              if (!isNaN(lat) && !isNaN(lng)) {
                                setBasicInfo({...basicInfo, latitude: lat, longitude: lng});
                                setHasUnsavedChanges(true);
                              }
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                        <button
                          onClick={() => {
                            // 将来的にここで住所から座標を自動取得
                            alert('住所からの自動取得機能は準備中です。\nGoogleマップから座標をコピーしてください。');
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                          住所から取得
                        </button>
                      </div>
                    </div>

                    {/* 座標の個別入力（詳細設定） */}
                    <details className="border border-gray-200 rounded-lg">
                      <summary className="px-3 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-50">
                        詳細設定（座標を個別に調整）
                      </summary>
                      <div className="p-3 grid grid-cols-3 gap-3 border-t">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            緯度
                          </label>
                          <input
                            type="number"
                            step="0.000001"
                            value={basicInfo.latitude}
                            onChange={(e) => {
                              setBasicInfo({...basicInfo, latitude: parseFloat(e.target.value)});
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            経度
                          </label>
                          <input
                            type="number"
                            step="0.000001"
                            value={basicInfo.longitude}
                            onChange={(e) => {
                              setBasicInfo({...basicInfo, longitude: parseFloat(e.target.value)});
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            打刻半径（m）
                          </label>
                          <input
                            type="number"
                            value={basicInfo.clockRadius}
                            onChange={(e) => {
                              setBasicInfo({...basicInfo, clockRadius: parseInt(e.target.value)});
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </details>

                    {/* 現在の設定確認 */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">現在の設定</span>
                        <button
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  const distance = Math.round(
                                    Math.sqrt(
                                      Math.pow((position.coords.latitude - basicInfo.latitude) * 111000, 2) +
                                      Math.pow((position.coords.longitude - basicInfo.longitude) * 111000, 2)
                                    )
                                  );
                                  alert(`現在地から店舗まで約${distance}mです。\n${distance <= basicInfo.clockRadius ? '✅ 打刻可能範囲内' : '❌ 打刻可能範囲外'}`);
                                },
                                () => alert('位置情報の取得に失敗しました')
                              );
                            }
                          }}
                          className="px-3 py-1 text-xs bg-orange-100 text-orange-600 rounded hover:bg-orange-200"
                        >
                          現在地でテスト
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">緯度:</span>
                          <span className="ml-1 font-mono">{basicInfo.latitude.toFixed(6)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">経度:</span>
                          <span className="ml-1 font-mono">{basicInfo.longitude.toFixed(6)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">打刻可能半径:</span>
                          <span className="ml-1 font-medium">{basicInfo.clockRadius}m</span>
                        </div>
                        <div>
                          <a
                            href={`https://www.google.com/maps?q=${basicInfo.latitude},${basicInfo.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            地図で確認 →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    <Info className="w-3 h-3 inline mr-1" />
                    従業員の打刻は設定した座標から半径{basicInfo.clockRadius}m以内でのみ可能になります。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 営業時間・定休日タブ */}
          {activeTab === 'hours' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">営業時間・定休日</h2>
                <button
                  onClick={() => {
                    // 月曜日の設定を全曜日にコピー
                    const mondaySettings = businessHours[0];
                    if (mondaySettings.isClosed) {
                      if (!confirm('月曜日は定休日に設定されています。全曜日を定休日にしますか？')) {
                        return;
                      }
                    }
                    setBusinessHours(prev => prev.map(hour => ({
                      ...mondaySettings,
                      day: hour.day // 曜日名は維持
                    })));
                    setHasUnsavedChanges(true);
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  title="月曜日の営業時間を全ての曜日に適用します"
                >
                  <Copy className="w-3.5 h-3.5" />
                  全曜日を月曜日と同じ時間にする
                </button>
              </div>

              <div className="space-y-3">
                {businessHours.map((hour, index) => (
                  <div key={hour.day} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                    <span className="w-12 font-medium text-gray-900">{hour.day}</span>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hour.isClosed}
                        onChange={(e) => {
                          const updated = [...businessHours];
                          updated[index].isClosed = e.target.checked;
                          setBusinessHours(updated);
                          setHasUnsavedChanges(true);
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">定休日</span>
                    </label>

                    {!hour.isClosed && (
                      <>
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={hour.open}
                            onChange={(e) => {
                              const updated = [...businessHours];
                              updated[index].open = e.target.value;
                              setBusinessHours(updated);
                              setHasUnsavedChanges(true);
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span className="text-gray-500">〜</span>
                          <input
                            type="time"
                            value={hour.close}
                            onChange={(e) => {
                              const updated = [...businessHours];
                              updated[index].close = e.target.value;
                              setBusinessHours(updated);
                              setHasUnsavedChanges(true);
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        
                        <label className="flex items-center gap-2 ml-auto">
                          <input
                            type="checkbox"
                            checked={hour.crossMidnight}
                            onChange={(e) => {
                              const updated = [...businessHours];
                              updated[index].crossMidnight = e.target.checked;
                              setBusinessHours(updated);
                              setHasUnsavedChanges(true);
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">翌日跨ぎ</span>
                        </label>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Info className="w-4 h-4 inline mr-1" />
                  営業時間は勤怠計算の基準となります。翌日跨ぎをONにすると、閉店時刻が翌日の時刻として扱われます。
                </p>
              </div>
            </div>
          )}

          {/* 打刻・計上ルールタブ */}
          {activeTab === 'attendance' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">打刻・計上ルール</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">基本設定</h3>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={attendanceRules.allowOutsideHours}
                      onChange={(e) => {
                        setAttendanceRules({...attendanceRules, allowOutsideHours: e.target.checked});
                        setHasUnsavedChanges(true);
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">営業時間外の勤務を許可する</span>
                  </label>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">早出・残業の許容</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        早出許容時間（分）
                      </label>
                      <input
                        type="number"
                        value={attendanceRules.earlyStartMinutes}
                        onChange={(e) => {
                          setAttendanceRules({...attendanceRules, earlyStartMinutes: parseInt(e.target.value)});
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        残業許容時間（分）
                      </label>
                      <input
                        type="number"
                        value={attendanceRules.lateEndMinutes}
                        onChange={(e) => {
                          setAttendanceRules({...attendanceRules, lateEndMinutes: parseInt(e.target.value)});
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">時刻の丸め設定</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'clockIn', label: '出勤時刻' },
                      { key: 'clockOut', label: '退勤時刻' },
                      { key: 'overtime', label: '残業時間' }
                    ].map(item => (
                      <div key={item.key} className="grid grid-cols-3 gap-3 items-center">
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <select
                          value={attendanceRules[`${item.key}RoundUnit`]}
                          onChange={(e) => {
                            setAttendanceRules({...attendanceRules, [`${item.key}RoundUnit`]: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        >
                          <option value="1">1分単位</option>
                          <option value="5">5分単位</option>
                          <option value="10">10分単位</option>
                          <option value="15">15分単位</option>
                          <option value="30">30分単位</option>
                        </select>
                        <select
                          value={attendanceRules[`${item.key}RoundMode`]}
                          onChange={(e) => {
                            setAttendanceRules({...attendanceRules, [`${item.key}RoundMode`]: e.target.value});
                            setHasUnsavedChanges(true);
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        >
                          <option value="floor">切り捨て</option>
                          <option value="ceil">切り上げ</option>
                          <option value="round">四捨五入</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">遅刻・早退の猶予</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        遅刻猶予時間（分）
                      </label>
                      <input
                        type="number"
                        value={attendanceRules.graceLateMinutes}
                        onChange={(e) => {
                          setAttendanceRules({...attendanceRules, graceLateMinutes: parseInt(e.target.value)});
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">この時間以内の遅刻は遅刻としてカウントしません</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        早退猶予時間（分）
                      </label>
                      <input
                        type="number"
                        value={attendanceRules.graceEarlyLeaveMinutes}
                        onChange={(e) => {
                          setAttendanceRules({...attendanceRules, graceEarlyLeaveMinutes: parseInt(e.target.value)});
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">この時間以内の早退は早退としてカウントしません</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 休憩ルールタブ */}
          {activeTab === 'break' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">休憩ルール</h2>
                <button
                  onClick={addBreakRule}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  ルール追加
                </button>
              </div>

              <div className="space-y-3">
                {breakRules.map((rule, index) => (
                  <div key={rule.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">休憩ルール {index + 1}</h4>
                      {breakRules.length > 1 && (
                        <button
                          onClick={() => deleteBreakRule(rule.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          連続労働時間（分）
                        </label>
                        <input
                          type="number"
                          value={rule.minWorkMinutes}
                          onChange={(e) => {
                            const updated = [...breakRules];
                            updated[index].minWorkMinutes = parseInt(e.target.value);
                            setBreakRules(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          休憩時間（分）
                        </label>
                        <input
                          type="number"
                          value={rule.breakMinutes}
                          onChange={(e) => {
                            const updated = [...breakRules];
                            updated[index].breakMinutes = parseInt(e.target.value);
                            setBreakRules(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rule.autoInsert}
                          onChange={(e) => {
                            const updated = [...breakRules];
                            updated[index].autoInsert = e.target.checked;
                            setBreakRules(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">自動挿入</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rule.paid}
                          onChange={(e) => {
                            const updated = [...breakRules];
                            updated[index].paid = e.target.checked;
                            setBreakRules(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">有給休憩</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Info className="w-4 h-4 inline mr-1" />
                  労働基準法に基づき、6時間超で45分、8時間超で60分の休憩が必要です。
                  自動挿入をONにすると、勤怠計算時に自動的に休憩時間が差し引かれます。
                </p>
              </div>
            </div>
          )}

          {/* ポジション管理タブ */}
          {activeTab === 'positions' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">ポジション管理</h2>
                <button
                  onClick={addPosition}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  ポジション追加
                </button>
              </div>

              <div className="space-y-3">
                {positions.map((position, index) => (
                  <div key={position.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    
                    <input
                      type="text"
                      value={position.code}
                      onChange={(e) => {
                        const updated = [...positions];
                        updated[index].code = e.target.value;
                        setPositions(updated);
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="コード"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    
                    <input
                      type="text"
                      value={position.name}
                      onChange={(e) => {
                        const updated = [...positions];
                        updated[index].name = e.target.value;
                        setPositions(updated);
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="ポジション名"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    
                    <select
                      value={position.color}
                      onChange={(e) => {
                        const updated = [...positions];
                        updated[index].color = e.target.value;
                        setPositions(updated);
                        setHasUnsavedChanges(true);
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {positionColors.map(color => (
                        <option key={color.value} value={color.value}>{color.label}</option>
                      ))}
                    </select>
                    
                    <span className={`px-3 py-1 rounded text-sm ${
                      positionColors.find(c => c.value === position.color)?.class
                    }`}>
                      プレビュー
                    </span>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={position.active}
                        onChange={(e) => {
                          const updated = [...positions];
                          updated[index].active = e.target.checked;
                          setPositions(updated);
                          setHasUnsavedChanges(true);
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">有効</span>
                    </label>
                    
                    <button
                      onClick={() => deletePosition(position.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Info className="w-4 h-4 inline mr-1" />
                  ポジションはシフト作成時の役割分担に使用されます。ドラッグ&ドロップで並び順を変更できます。
                </p>
              </div>
            </div>
          )}

          {/* 高度な設定タブ */}
          {activeTab === 'advanced' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">高度な設定</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    日付境界時刻
                  </label>
                  <select
                    value={advancedSettings.dayBoundaryHour}
                    onChange={(e) => {
                      setAdvancedSettings({...advancedSettings, dayBoundaryHour: parseInt(e.target.value)});
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(hour => (
                      <option key={hour} value={hour}>
                        {hour}:00（{hour}時より前を前日として扱う）
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    深夜営業の場合、この時刻より前の勤務を前日の勤務として計算します
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    既定の休み希望上限（日/月）
                  </label>
                  <input
                    type="number"
                    value={advancedSettings.defaultMaxOffRequests}
                    onChange={(e) => {
                      setAdvancedSettings({...advancedSettings, defaultMaxOffRequests: parseInt(e.target.value)});
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    従業員個別に設定されていない場合、この値が適用されます
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    これらの設定は勤怠計算に大きく影響します。変更する際は十分にご注意ください。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShopSettingsPage;