import React, { useState, useEffect } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, Clock, 
  X, Download, Grid3x3,
  Sun, Moon, CloudSun, LogOut, Menu,
  User, CalendarDays, List,
  Printer
} from 'lucide-react';

const ShiftConfirmPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentMonth, setCurrentMonth] = useState('2025-02');
  const [viewMode, setViewMode] = useState('calendar'); // calendar | list | week
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [showShiftDetail, setShowShiftDetail] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // 確定シフトデータ
  const [confirmedShifts] = useState({
    '2025-02-01': { start: '09:00', end: '17:00' },
    '2025-02-02': { start: '09:00', end: '17:00' },
    '2025-02-03': { start: '14:00', end: '22:00' },
    '2025-02-05': { start: '09:00', end: '17:00' },
    '2025-02-06': { start: '07:00', end: '15:00' },
    '2025-02-07': { start: '14:00', end: '22:00' },
    '2025-02-08': { start: '09:00', end: '17:00' },
    '2025-02-09': { start: '12:00', end: '20:00' },
    '2025-02-10': { start: '09:00', end: '17:00' },
    '2025-02-12': { start: '07:00', end: '15:00' },
    '2025-02-13': { start: '09:00', end: '17:00' },
    '2025-02-14': { start: '12:00', end: '20:00' },
    '2025-02-15': { start: '09:00', end: '17:00' },
    '2025-02-16': { start: '14:00', end: '22:00' },
    '2025-02-17': { start: '09:00', end: '17:00' },
    '2025-02-19': { start: '09:00', end: '17:00' },
    '2025-02-20': { start: '16:00', end: '22:00' },
    '2025-02-21': { start: '09:00', end: '17:00' },
    '2025-02-22': { start: '09:00', end: '17:00' },
    '2025-02-23': { start: '11:00', end: '19:00' },
    '2025-02-24': { start: '09:00', end: '17:00' },
    '2025-02-26': { start: '09:00', end: '17:00' },
    '2025-02-28': { start: '11:00', end: '19:00' }
  });

  const shiftPatterns = [
    { id: 'early', name: '早番', icon: Sun, time: '07:00-15:00' },
    { id: 'day', name: '日勤', icon: CloudSun, time: '09:00-17:00' },
    { id: 'late', name: '遅番', icon: Moon, time: '14:00-22:00' }
  ];

  const menuItems = [
    { id: 'shift', label: 'シフト提出', icon: Calendar },
    { id: 'confirmed', label: '確定シフト', icon: CalendarDays },
    { id: 'attendance', label: '出退勤', icon: Clock },
    { id: 'profile', label: 'マイページ', icon: User }
  ];

  const getDaysInMonth = (yearMonth) => {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfWeek = (yearMonth) => {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDayLabel = (dayOfWeek) => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[dayOfWeek];
  };

  const getShiftPattern = (start) => {
    const hour = parseInt(start.split(':')[0]);
    if (hour < 10) return shiftPatterns[0]; // 早番
    if (hour < 14) return shiftPatterns[1]; // 日勤
    return shiftPatterns[2]; // 遅番
  };

  const calculateWorkHours = (start, end) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes, total: totalMinutes };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert('シフトデータをダウンロードします');
  };

  // 月を変更（スワイプ対応）
  const changeMonth = (direction) => {
    const [year, month] = currentMonth.split('-').map(Number);
    if (direction === 'prev') {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      setCurrentMonth(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);
    } else {
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      setCurrentMonth(`${nextYear}-${String(nextMonth).padStart(2, '0')}`);
    }
  };

  // シフト詳細モーダル（モバイル最適化）
  const ShiftDetailModal = () => {
    if (!selectedDate || !confirmedShifts[selectedDate]) return null;
    
    const shift = confirmedShifts[selectedDate];
    const pattern = getShiftPattern(shift.start);
    const { hours, minutes } = calculateWorkHours(shift.start, shift.end);
    const [year, month, day] = selectedDate.split('-').map(Number);
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    
    const PatternIcon = pattern.icon;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center md:p-4">
        <div className={`bg-white ${isMobile ? 'w-full rounded-t-3xl' : 'rounded-2xl max-w-md w-full'} shadow-xl`}>
          <div className={`${isMobile ? 'p-6 pb-8' : 'p-6'}`}>
            <div className={`flex items-center justify-between ${isMobile ? 'mb-6' : 'mb-6'}`}>
              <h3 className={`${isMobile ? 'text-2xl' : 'text-xl'} font-bold text-gray-900`}>
                シフト詳細
              </h3>
              <button
                onClick={() => {
                  setShowShiftDetail(false);
                  setSelectedDate(null);
                }}
                className={`${isMobile ? 'p-3' : 'p-2'} hover:bg-gray-100 rounded-xl transition-colors`}
              >
                <X className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-gray-500`} />
              </button>
            </div>

            <div className={`space-y-${isMobile ? '6' : '5'}`}>
              <div className="flex items-center gap-4">
                <div className={`${isMobile ? 'w-14 h-14' : 'w-12 h-12'} bg-orange-100 rounded-xl flex items-center justify-center`}>
                  <CalendarDays className={`${isMobile ? 'w-7 h-7' : 'w-6 h-6'} text-orange-600`} />
                </div>
                <div>
                  <p className={`${isMobile ? 'text-base' : 'text-sm'} text-gray-500`}>日付</p>
                  <p className={`${isMobile ? 'text-xl' : 'text-lg'} font-semibold text-gray-900`}>
                    {month}月{day}日（{getDayLabel(dayOfWeek)}）
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`${isMobile ? 'w-14 h-14' : 'w-12 h-12'} bg-blue-100 rounded-xl flex items-center justify-center`}>
                  <Clock className={`${isMobile ? 'w-7 h-7' : 'w-6 h-6'} text-blue-600`} />
                </div>
                <div>
                  <p className={`${isMobile ? 'text-base' : 'text-sm'} text-gray-500`}>勤務時間</p>
                  <p className={`${isMobile ? 'text-xl' : 'text-lg'} font-semibold text-gray-900`}>
                    {shift.start} - {shift.end}
                  </p>
                  <p className={`${isMobile ? 'text-base' : 'text-sm'} text-gray-600`}>
                    {hours}時間{minutes > 0 ? `${minutes}分` : ''}勤務
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`${isMobile ? 'w-14 h-14' : 'w-12 h-12'} bg-purple-100 rounded-xl flex items-center justify-center`}>
                  <PatternIcon className={`${isMobile ? 'w-7 h-7' : 'w-6 h-6'} text-purple-600`} />
                </div>
                <div>
                  <p className={`${isMobile ? 'text-base' : 'text-sm'} text-gray-500`}>シフト区分</p>
                  <p className={`${isMobile ? 'text-xl' : 'text-lg'} font-semibold text-gray-900`}>
                    {pattern.name}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${isMobile ? 'mt-8' : 'mt-8'} pt-6 border-t border-gray-100`}>
              <button
                onClick={() => {
                  setShowShiftDetail(false);
                  setSelectedDate(null);
                }}
                className={`w-full px-4 ${isMobile ? 'py-4 text-lg' : 'py-3'} bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium`}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // モバイルメニュー
  const MobileMenu = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-xl text-gray-900">ShiftMaster</p>
                <p className="text-sm text-gray-500">従業員ポータル</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-base ${
                    item.id === 'confirmed'
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">田中 太郎</p>
                <p className="text-sm text-gray-500">スタッフ</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
              <LogOut className="w-5 h-5" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* デスクトップサイドバー */}
      {!isMobile && (
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                        item.id === 'confirmed'
                          ? 'bg-orange-50 text-orange-600 font-medium'
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
            <div className={`flex items-center gap-3 mb-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm font-medium text-gray-900">田中 太郎</p>
                </div>
              )}
            </div>
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200 ${!sidebarOpen && 'justify-center'}`}>
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>ログアウト</span>}
            </button>
          </div>
        </aside>
      )}

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* ヘッダー */}
        <header className={`bg-white border-b border-gray-200 sticky top-0 z-10 ${isMobile ? 'px-4 py-3' : 'px-8 py-6'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button 
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2.5 hover:bg-gray-100 rounded-xl"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
              )}
              <div>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>確定シフト</h1>
                {!isMobile && (
                  <p className="text-sm text-gray-600 mt-1">
                    {currentMonth.split('-')[0]}年{parseInt(currentMonth.split('-')[1])}月のシフトスケジュール
                  </p>
                )}
              </div>
            </div>

            {!isMobile && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => changeMonth('prev')}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="text-sm font-semibold text-gray-900 min-w-[100px] text-center">
                    {currentMonth.split('-')[0]}年{parseInt(currentMonth.split('-')[1])}月
                  </span>
                  <button
                    onClick={() => changeMonth('next')}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  印刷
                </button>

                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  ダウンロード
                </button>
              </div>
            )}
          </div>
        </header>

        {/* モバイル用月選択 */}
        {isMobile && (
          <div className="px-4 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => changeMonth('prev')}
                className="p-3 hover:bg-gray-100 rounded-xl active:scale-95 transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {currentMonth.split('-')[0]}年{parseInt(currentMonth.split('-')[1])}月
                </p>
              </div>
              <button
                onClick={() => changeMonth('next')}
                className="p-3 hover:bg-gray-100 rounded-xl active:scale-95 transition-all"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        <div className={isMobile ? 'pb-20' : 'p-8'}>
          {/* ビュー切り替えタブ */}
          <div className={`${isMobile ? 'px-4 mb-4 pt-4' : 'mb-6'}`}>
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-1`}>
              <div className="flex">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex-1 ${isMobile ? 'py-3.5' : 'py-3'} px-4 text-sm font-medium transition-all duration-200 rounded-xl flex items-center justify-center gap-2 ${
                    viewMode === 'calendar' 
                      ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Grid3x3 className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className={isMobile ? 'text-sm' : ''}>カレンダー</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 ${isMobile ? 'py-3.5' : 'py-3'} px-4 text-sm font-medium transition-all duration-200 rounded-xl flex items-center justify-center gap-2 ${
                    viewMode === 'list' 
                      ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <List className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className={isMobile ? 'text-sm' : ''}>リスト</span>
                </button>
              </div>
            </div>
          </div>

          {/* カレンダービュー（モバイル最適化） */}
          {viewMode === 'calendar' && (
            <div className={`${isMobile ? 'px-4' : ''}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
                <div className={`grid grid-cols-7 ${isMobile ? 'gap-0.5' : 'gap-2'}`}>
                  {['日', '月', '火', '水', '木', '金', '土'].map((day, idx) => (
                    <div
                      key={day}
                      className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'} font-semibold ${
                        idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                  ))}

                  {(() => {
                    const [year, month] = currentMonth.split('-').map(Number);
                    const daysInMonth = getDaysInMonth(currentMonth);
                    const firstDayOfWeek = getFirstDayOfWeek(currentMonth);
                    const cells = [];

                    for (let i = 0; i < firstDayOfWeek; i++) {
                      cells.push(
                        <div key={`empty-${i}`} className={`${isMobile ? 'h-16' : 'h-28'}`} />
                      );
                    }

                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = formatDate(year, month, day);
                      const shift = confirmedShifts[date];
                      const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                      const isToday = new Date().toISOString().split('T')[0] === date;

                      cells.push(
                        <div
                          key={date}
                          onClick={() => {
                            if (shift) {
                              setSelectedDate(date);
                              setShowShiftDetail(true);
                            }
                          }}
                          className={`${isMobile ? 'h-16' : 'h-28'} relative ${isMobile ? 'rounded-lg' : 'rounded-xl'} transition-all ${
                            shift 
                              ? 'cursor-pointer hover:shadow-lg hover:scale-105 transform active:scale-95' 
                              : ''
                          } ${isToday ? 'ring-2 ring-orange-400' : ''}`}
                        >
                          {shift ? (
                            <div className={`h-full ${isMobile ? 'rounded-lg' : 'rounded-xl'} bg-gray-50 border border-gray-200 ${isMobile ? 'p-0.5' : 'p-2'}`}>
                              <div className="h-full flex flex-col">
                                <div className={`${isMobile ? 'text-[10px] px-0.5' : 'text-sm'} font-bold ${
                                  dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-800'
                                } ${isMobile ? 'mb-0' : 'mb-1'}`}>
                                  {day}
                                </div>
                                <div className="flex-1 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className={`${isMobile ? 'text-[11px]' : 'text-sm'} font-semibold text-gray-700`}>
                                      {shift.start.slice(0, 5)}
                                    </div>
                                    <div className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-gray-400 ${isMobile ? 'my-0' : 'my-0.5'}`}>〜</div>
                                    <div className={`${isMobile ? 'text-[11px]' : 'text-sm'} font-semibold text-gray-700`}>
                                      {shift.end.slice(0, 5)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className={`h-full ${isMobile ? 'rounded-lg' : 'rounded-xl'} border ${
                              isWeekend ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                            }`}>
                              <div className={`${isMobile ? 'p-1' : 'p-2'}`}>
                                <span className={`${isMobile ? 'text-[10px]' : 'text-sm'} font-semibold ${
                                  dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-700'
                                }`}>
                                  {day}
                                </span>
                                {!isMobile && (
                                  <div className="flex items-center justify-center h-12 md:h-16">
                                    <span className="text-xs text-gray-400">休み</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return cells;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* リストビュー（モバイル最適化） */}
          {viewMode === 'list' && (
            <div className={`${isMobile ? 'px-4' : ''}`}>
              <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${isMobile ? 'p-3' : 'p-6'}`}>
                <div className={`space-y-${isMobile ? '2' : '3'}`}>
                  {Object.entries(confirmedShifts)
                    .filter(([date]) => date.startsWith(currentMonth))
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, shift]) => {
                      const [year, month, day] = date.split('-').map(Number);
                      const dayOfWeek = new Date(year, month - 1, day).getDay();
                      const { hours, minutes } = calculateWorkHours(shift.start, shift.end);
                      const pattern = getShiftPattern(shift.start);
                      const PatternIcon = pattern.icon;
                      
                      return (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDate(date);
                            setShowShiftDetail(true);
                          }}
                          className={`w-full flex items-center gap-${isMobile ? '3' : '4'} ${isMobile ? 'p-3' : 'p-4'} border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left`}
                        >
                          <div className={`${isMobile ? 'min-w-[60px]' : 'w-20'}`}>
                            <p className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
                              {month}/{day}
                            </p>
                            <p className={`${isMobile ? 'text-xs' : 'text-sm'} ${
                              dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-600'
                            }`}>
                              {getDayLabel(dayOfWeek)}
                            </p>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Clock className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gray-400`} />
                              <span className={`font-medium text-gray-900 ${isMobile ? 'text-sm' : ''}`}>
                                {shift.start} - {shift.end}
                              </span>
                            </div>
                            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-1`}>
                              {hours}時間{minutes > 0 ? `${minutes}分` : ''}勤務
                            </p>
                          </div>
                          {!isMobile && (
                            <div className="flex items-center gap-2">
                              <PatternIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {pattern.name}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* モバイル用固定ボトムナビ */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-40">
              <div className="flex justify-around">
                <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600">
                  <Calendar className="w-6 h-6" />
                  <span className="text-xs">シフト提出</span>
                </button>
                <button className="flex flex-col items-center gap-1 py-2 px-4 text-orange-600">
                  <CalendarDays className="w-6 h-6" />
                  <span className="text-xs font-medium">確定シフト</span>
                </button>
                <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600">
                  <Clock className="w-6 h-6" />
                  <span className="text-xs">出退勤</span>
                </button>
                <button 
                  onClick={handleExport}
                  className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600"
                >
                  <Download className="w-6 h-6" />
                  <span className="text-xs">保存</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* モバイルメニュー */}
      {isMobile && <MobileMenu />}

      {/* シフト詳細モーダル */}
      {showShiftDetail && <ShiftDetailModal />}
    </div>
  );
};

export default ShiftConfirmPage;