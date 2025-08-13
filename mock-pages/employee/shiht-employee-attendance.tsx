import React, { useState, useEffect } from 'react';
import {
  Clock, ChevronLeft, ChevronRight, MapPin, CheckCircle,
  AlertCircle, LogIn, LogOut, Coffee, Info, X,
  Calendar, CalendarDays, User, Menu, Home,
  ArrowLeft, RefreshCw, Shield
} from 'lucide-react';

const AttendancePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentMode, setCurrentMode] = useState('simple'); // 'login' or 'simple'
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('未出勤'); // '未出勤', '勤務中', '退勤済み'
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [workingMinutes, setWorkingMinutes] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(60);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [completionType, setCompletionType] = useState(''); // 'clockIn' or 'clockOut'
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState('checking'); // 'checking', 'allowed', 'denied', 'out_of_range'
  const [distance, setDistance] = useState(null);
  const [todayHistory, setTodayHistory] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // モバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 時刻更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
      
      // 勤務時間の計算
      if (attendanceStatus === '勤務中' && clockInTime) {
        const now = new Date();
        const diffMs = now - clockInTime;
        setWorkingMinutes(Math.floor(diffMs / 1000 / 60));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [attendanceStatus, clockInTime]);

  // 位置情報チェック（デモ用）
  useEffect(() => {
    setTimeout(() => {
      setLocationStatus('allowed');
      setDistance(35);
    }, 1500);
  }, [currentEmployee]);

  const employees = [
    { code: 'E001', name: '田中 太郎' },
    { code: 'E002', name: '佐藤 花子' },
    { code: 'E003', name: '鈴木 一郎' },
    { code: 'E004', name: '高橋 美香' },
    { code: 'E005', name: '渡辺 健太' }
  ];

  const menuItems = [
    { id: 'shift', label: 'シフト提出', icon: Calendar, path: '/shift' },
    { id: 'confirmed', label: '確定シフト', icon: CalendarDays, path: '/confirmed' },
    { id: 'attendance', label: '出退勤', icon: Clock, path: '/attendance' },
    { id: 'profile', label: 'マイページ', icon: User, path: '/profile' }
  ];

  const formatTime = (date) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  const formatWorkingTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins}分`;
  };

  const handleEmployeeSelect = () => {
    const employee = employees.find(e => e.code === selectedEmployeeCode);
    if (employee) {
      setCurrentEmployee(employee);
      setAttendanceStatus('未出勤');
      setClockInTime(null);
      setClockOutTime(null);
      setWorkingMinutes(0);
      setTodayHistory([]);
    } else if (selectedEmployeeCode) {
      alert('従業員コードが見つかりません');
    }
  };

  const handleClockIn = () => {
    if (locationStatus !== 'allowed' || distance > 50) {
      alert('打刻可能エリア内で操作してください');
      return;
    }

    const now = new Date();
    setClockInTime(now);
    setAttendanceStatus('勤務中');
    
    const newHistory = {
      id: Date.now(),
      type: 'clockIn',
      time: now,
      location: { lat: 35.6762, lng: 139.6503 }
    };
    setTodayHistory([newHistory, ...todayHistory]);

    if (currentMode === 'simple') {
      setCompletionMessage(`出勤時刻: ${formatTime(now)}`);
      setCompletionType('clockIn');
      setShowCompletionScreen(true);
      // 出勤も退勤も同じく5秒後に従業員選択画面にリセット
      setTimeout(() => {
        resetForNextEmployee();
      }, 5000);
    }
  };

  const handleClockOut = () => {
    setShowBreakModal(true);
  };

  const confirmClockOut = () => {
    const now = new Date();
    setClockOutTime(now);
    setAttendanceStatus('退勤済み');
    
    const actualWorkingMinutes = workingMinutes - breakMinutes;
    
    const newHistory = {
      id: Date.now(),
      type: 'clockOut',
      time: now,
      breakMinutes: breakMinutes,
      location: { lat: 35.6762, lng: 139.6503 }
    };
    setTodayHistory([newHistory, ...todayHistory]);
    
    setShowBreakModal(false);

    if (currentMode === 'simple') {
      setCompletionMessage(
        `退勤時刻: ${formatTime(now)}\n勤務時間: ${formatWorkingTime(actualWorkingMinutes)}（休憩: ${breakMinutes}分）`
      );
      setCompletionType('clockOut');
      setShowCompletionScreen(true);
      // 退勤も5秒後に従業員選択画面にリセット
      setTimeout(() => {
        resetForNextEmployee();
      }, 5000);
    }
  };

  const resetForNextEmployee = () => {
    setCurrentEmployee(null);
    setSelectedEmployeeCode('');
    setAttendanceStatus('未出勤');
    setClockInTime(null);
    setClockOutTime(null);
    setWorkingMinutes(0);
    setBreakMinutes(60);
    setShowCompletionScreen(false);
    setCompletionMessage('');
    setCompletionType('');
    setTodayHistory([]);
  };

  const switchMode = (mode) => {
    setCurrentMode(mode);
    if (mode === 'login') {
      // ログインモードでは固定ユーザー
      setCurrentEmployee({ code: 'E001', name: '田中 太郎' });
      setSidebarOpen(true);
    } else {
      resetForNextEmployee();
      setSidebarOpen(false);
    }
  };

  // 従業員選択画面（簡易モード）
  if (currentMode === 'simple' && !currentEmployee && !showCompletionScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* 日時ヘッダー */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-4 text-center bg-gray-50 mx-4 my-2 rounded-lg">
            <div className="text-4xl font-bold font-mono text-gray-900">
              {currentDateTime.toLocaleTimeString('ja-JP', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-lg text-gray-600 mt-1">
              {currentDateTime.toLocaleDateString('ja-JP', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">出退勤管理</h1>
              <p className="text-gray-600">従業員を選択してください</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    従業員リストから選択
                  </label>
                  <select
                    value={selectedEmployeeCode}
                    onChange={(e) => {
                      setSelectedEmployeeCode(e.target.value);
                      if (e.target.value) {
                        const employee = employees.find(emp => emp.code === e.target.value);
                        if (employee) {
                          setCurrentEmployee(employee);
                        }
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-gray-900"
                  >
                    <option value="">選択してください</option>
                    {employees.map(emp => (
                      <option key={emp.code} value={emp.code}>
                        {emp.code} - {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500">または</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    従業員コードを入力
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedEmployeeCode}
                      onChange={(e) => setSelectedEmployeeCode(e.target.value.toUpperCase())}
                      placeholder="例: E001"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-gray-900 font-mono"
                      maxLength={10}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleEmployeeSelect();
                        }
                      }}
                    />
                    <button
                      onClick={handleEmployeeSelect}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 font-medium shadow-sm transition-all"
                    >
                      決定
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => switchMode('login')}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto"
                >
                  <Shield className="w-4 h-4" />
                  ログインモードに切り替え
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 完了画面（簡易モード）
  if (showCompletionScreen) {
    return (
      <div className={`min-h-screen flex flex-col ${
        completionType === 'clockIn' 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}>
        {/* 日時ヘッダー */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-4 text-center bg-gray-50 mx-4 my-2 rounded-lg">
            <div className="text-4xl font-bold font-mono text-gray-900">
              {currentDateTime.toLocaleTimeString('ja-JP', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-lg text-gray-600 mt-1">
              {currentDateTime.toLocaleDateString('ja-JP', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
              <div className={`w-20 h-20 ${completionType === 'clockIn' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {completionType === 'clockIn' ? (
                  <LogIn className="w-12 h-12 text-green-600" />
                ) : (
                  <LogOut className="w-12 h-12 text-blue-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {completionType === 'clockIn' ? '出勤完了' : '退勤完了'}
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-lg font-medium text-gray-900 mb-2">{currentEmployee.name}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{completionMessage}</p>
              </div>
              {completionType === 'clockIn' ? (
                <div className="mb-6">
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    本日もよろしく
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    お願いいたします！
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    お疲れ様でした！
                  </p>
                </div>
              )}
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-500">5秒後に自動的に次の画面へ</p>
              </div>
              <button
                onClick={resetForNextEmployee}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                すぐに次の従業員で打刻
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // メイン画面
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      {currentMode === 'login' && !isMobile && (
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
                    <p className="text-xs text-gray-500">従業員ポータル</p>
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        item.id === 'attendance'
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

          {sidebarOpen && (
            <div className="p-3 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentEmployee?.name}</p>
                </div>
              </div>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200">
                <LogOut className="w-5 h-5" />
                <span>ログアウト</span>
              </button>
            </div>
          )}
        </aside>
      )}

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <header className={`bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm`}>
          <div className={`${isMobile ? 'px-4 py-3' : 'px-8 py-4'}`}>
            {/* 日時表示 */}
            <div className="text-center mb-3 bg-gray-50 rounded-lg py-2">
              <div className={`font-bold font-mono text-gray-900 ${isMobile ? 'text-3xl' : 'text-4xl'}`}>
                {currentDateTime.toLocaleTimeString('ja-JP', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className={`text-gray-600 ${isMobile ? 'text-base' : 'text-lg'} mt-1`}>
                {currentDateTime.toLocaleDateString('ja-JP', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentMode === 'simple' && (
                  <button
                    onClick={resetForNextEmployee}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                {isMobile && currentMode === 'login' && (
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Menu className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <div>
                  <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>出退勤管理</h1>
                </div>
              </div>

              {!isMobile && (
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => switchMode('login')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      currentMode === 'login' 
                        ? 'bg-white shadow-sm text-orange-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ログインモード
                  </button>
                  <button
                    onClick={() => switchMode('simple')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      currentMode === 'simple' 
                        ? 'bg-white shadow-sm text-orange-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    簡易モード
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className={isMobile ? 'p-4' : 'p-8 pt-4'}>
          {/* 従業員情報 */}
          {currentEmployee && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">現在の状態</h2>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{currentEmployee.code}</span> - {currentEmployee.name}
                </div>
              </div>
              
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-gray-600 mb-1">ステータス</p>
                  <p className={`text-2xl font-bold text-orange-600 ${
                    attendanceStatus === '勤務中' ? 'animate-pulse' : ''
                  }`}>
                    {attendanceStatus}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">出勤時刻</p>
                  <p className="text-2xl font-bold text-gray-900">{formatTime(clockInTime)}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">勤務時間</p>
                  <p className="text-2xl font-bold text-gray-900">{formatWorkingTime(workingMinutes)}</p>
                </div>
              </div>
            </div>
          )}

          {/* 位置情報アラート */}
          {locationStatus === 'checking' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-yellow-600 mt-0.5 animate-pulse" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">位置情報を確認中...</p>
                  <p>現在地を取得しています。しばらくお待ちください。</p>
                </div>
              </div>
            </div>
          )}

          {locationStatus === 'allowed' && distance > 50 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">打刻可能エリア外です</p>
                  <p>現在地が店舗から{distance}m離れています。50m以内で打刻してください。</p>
                </div>
              </div>
            </div>
          )}

          {/* 打刻ボタン */}
          {currentEmployee && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                <button
                  onClick={handleClockIn}
                  disabled={attendanceStatus !== '未出勤' || locationStatus !== 'allowed' || distance > 50}
                  className={`relative p-8 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl transition-all group ${
                    attendanceStatus === '未出勤' && locationStatus === 'allowed' && distance <= 50
                      ? 'hover:from-green-100 hover:to-green-200 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {attendanceStatus === '未出勤' && locationStatus === 'allowed' && distance <= 50 && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                  <LogIn className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-green-700 mb-1">出勤</p>
                  <p className="text-sm text-green-600">タップして出勤を記録</p>
                </button>
                
                <button
                  onClick={handleClockOut}
                  disabled={attendanceStatus !== '勤務中'}
                  className={`relative p-8 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl transition-all group ${
                    attendanceStatus === '勤務中'
                      ? 'hover:from-red-100 hover:to-red-200 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {attendanceStatus === '勤務中' && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                  <LogOut className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-red-700 mb-1">退勤</p>
                  <p className="text-sm text-red-600">タップして退勤を記録</p>
                </button>
              </div>
            </div>
          )}

          {/* 本日の打刻履歴 */}
          {currentEmployee && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">本日の打刻履歴</h3>
              {todayHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>本日の打刻履歴はまだありません</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayHistory.map((record) => (
                    <div
                      key={record.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        record.type === 'clockIn'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      {record.type === 'clockIn' ? (
                        <LogIn className="w-5 h-5 text-green-600" />
                      ) : (
                        <LogOut className="w-5 h-5 text-red-600" />
                      )}
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">
                          {record.type === 'clockIn' ? '出勤' : '退勤'}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                          {formatTime(record.time)}
                        </span>
                        {record.breakMinutes && (
                          <span className="text-xs text-gray-500 ml-2">
                            休憩: {record.breakMinutes}分
                          </span>
                        )}
                      </div>
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 休憩時間入力モーダル */}
      {showBreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">休憩時間の入力</h3>
              <p className="text-sm text-gray-600 mt-1">本日の休憩時間を入力してください</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {[0, 30, 45, 60].map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => setBreakMinutes(minutes)}
                      className={`px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                        breakMinutes === minutes
                          ? 'border-orange-300 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {minutes === 0 ? 'なし' : `${minutes}分`}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カスタム入力（15分単位）
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={breakMinutes}
                      onChange={(e) => setBreakMinutes(Math.max(0, Math.floor(e.target.value / 15) * 15))}
                      min="0"
                      step="15"
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                    <span className="text-gray-600">分</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowBreakModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={confirmClockOut}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 font-medium transition-colors"
              >
                退勤を確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;