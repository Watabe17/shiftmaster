import React, { useState, useEffect } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, Clock, CheckCircle,
  AlertCircle, Save, Send, Copy, Trash2, Info, X,
  Sun, Moon, CloudSun, Home, LogOut, Menu,
  User, CalendarDays, Edit3, Check, FileText, Download
} from 'lucide-react';

const ShiftSubmitPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentMonth, setCurrentMonth] = useState('2025-02');
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [showBulkEditPanel, setShowBulkEditPanel] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('draft');
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');
  const [isMobile, setIsMobile] = useState(false);
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

  // シフト希望データ
  const [shiftRequests, setShiftRequests] = useState({
    '2025-02-03': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-04': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-05': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-07': { availability: 'ok', start: '14:00', end: '22:00', note: '午前中は授業' },
    '2025-02-10': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-11': { availability: 'ng', note: '私用のため' },
    '2025-02-12': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-14': { availability: 'ok', start: '12:00', end: '20:00', note: '' },
    '2025-02-17': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-18': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-19': { availability: 'ok', start: '16:00', end: '22:00', note: '試験勉強のため' },
    '2025-02-21': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-24': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-25': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-26': { availability: 'ok', start: '09:00', end: '17:00', note: '' },
    '2025-02-28': { availability: 'ok', start: '11:00', end: '19:00', note: '' }
  });

  const [quickPatterns] = useState([
    { id: 'allday', name: '終日可', icon: CheckCircle, start: '09:00', end: '22:00', color: 'green' },
    { id: 'morning', name: '早番', icon: Sun, start: '07:00', end: '15:00', color: 'yellow' },
    { id: 'day', name: '日勤', icon: CloudSun, start: '09:00', end: '17:00', color: 'blue' },
    { id: 'evening', name: '遅番', icon: Moon, start: '14:00', end: '22:00', color: 'purple' }
  ]);

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

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'ok': return 'bg-green-50 text-green-700 border-green-200';
      case 'ng': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-400 border-gray-200';
    }
  };

  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case 'ok': return <Check className="w-3 h-3" />;
      case 'ng': return <X className="w-3 h-3" />;
      default: return null;
    }
  };

  const getSubmissionRate = () => {
    const totalDays = getDaysInMonth(currentMonth);
    const submittedDays = Object.keys(shiftRequests).filter(date => 
      date.startsWith(currentMonth)
    ).length;
    return Math.round((submittedDays / totalDays) * 100);
  };

  // 月を変更
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

  // イベントハンドラー
  const handleDateClick = (date, event) => {
    if (isDragging) return;
    
    if (event && event.shiftKey && !isMobile) {
      const newSelected = new Set(selectedDates);
      if (newSelected.has(date)) {
        newSelected.delete(date);
      } else {
        newSelected.add(date);
      }
      setSelectedDates(newSelected);
    } else {
      setSelectedDates(new Set([date]));
      setShowBulkEditPanel(true);
    }
  };

  const handleMouseDown = (date) => {
    if (isMobile) return;
    setIsDragging(true);
    setDragStart(date);
    setSelectedDates(new Set([date]));
  };

  const handleMouseEnter = (date) => {
    if (isMobile || !isDragging || !dragStart) return;
    
    const [startYear, startMonth, startDay] = dragStart.split('-').map(Number);
    const [endYear, endMonth, endDay] = date.split('-').map(Number);
    
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    
    const newSelected = new Set();
    const current = new Date(Math.min(startDate, endDate));
    const end = new Date(Math.max(startDate, endDate));
    
    while (current <= end) {
      const dateStr = formatDate(current.getFullYear(), current.getMonth() + 1, current.getDate());
      newSelected.add(dateStr);
      current.setDate(current.getDate() + 1);
    }
    
    setSelectedDates(newSelected);
  };

  const handleMouseUp = () => {
    if (isDragging && selectedDates.size > 0) {
      setShowBulkEditPanel(true);
    }
    setIsDragging(false);
    setDragStart(null);
  };

  // タッチ操作（モバイル用）
  const handleTouchStart = (date, event) => {
    event.preventDefault();
    setIsDragging(true);
    setDragStart(date);
    setSelectedDates(new Set([date]));
  };

  const handleTouchMove = (event) => {
    if (!isDragging) return;
    
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.dataset && element.dataset.date) {
      const date = element.dataset.date;
      if (dragStart && date) {
        const [startYear, startMonth, startDay] = dragStart.split('-').map(Number);
        const [endYear, endMonth, endDay] = date.split('-').map(Number);
        
        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);
        
        const newSelected = new Set();
        const current = new Date(Math.min(startDate, endDate));
        const end = new Date(Math.max(startDate, endDate));
        
        while (current <= end) {
          const dateStr = formatDate(current.getFullYear(), current.getMonth() + 1, current.getDate());
          newSelected.add(dateStr);
          current.setDate(current.getDate() + 1);
        }
        
        setSelectedDates(newSelected);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDragging && selectedDates.size > 0) {
      setShowBulkEditPanel(true);
    }
    setIsDragging(false);
    setDragStart(null);
  };

  const handleBulkUpdate = (availability, start, end, note) => {
    const updatedRequests = { ...shiftRequests };
    selectedDates.forEach(date => {
      updatedRequests[date] = { availability, start, end, note };
    });
    setShiftRequests(updatedRequests);
    setSelectedDates(new Set());
    setShowBulkEditPanel(false);
  };

  const handleQuickPattern = (pattern) => {
    handleBulkUpdate('ok', pattern.start, pattern.end, '');
  };

  const handleSubmit = () => {
    setSubmitStatus('submitted');
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const handleSaveDraft = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  // 一括編集パネル（モバイル最適化）
  const BulkEditPanel = () => {
    const [availability, setAvailability] = useState('ok');
    const [start, setStart] = useState('09:00');
    const [end, setEnd] = useState('17:00');
    const [note, setNote] = useState('');

    // モバイル版
    if (isMobile) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl" style={{ maxHeight: '90vh' }}>
            {/* ヘッダー（固定） */}
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedDates.size}日分を編集
                </h3>
                <button
                  onClick={() => {
                    setShowBulkEditPanel(false);
                    setSelectedDates(new Set());
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {Array.from(selectedDates).slice(0, 5).map(date => {
                  const [year, month, day] = date.split('-');
                  return (
                    <span key={date} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                      {parseInt(month)}/{parseInt(day)}
                    </span>
                  );
                })}
                {selectedDates.size > 5 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    他{selectedDates.size - 5}日
                  </span>
                )}
              </div>
            </div>

            {/* スクロール可能なコンテンツ */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              <div className="p-5">
                <div className="mb-6">
                  <h4 className="text-base font-medium text-gray-700 mb-3">クイック設定</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quickPatterns.map(pattern => {
                      const Icon = pattern.icon;
                      return (
                        <button
                          key={pattern.id}
                          onClick={() => handleQuickPattern(pattern)}
                          className={`p-4 border-2 rounded-xl hover:border-orange-300 transition-all text-left ${
                            pattern.color === 'green' ? 'border-green-200 bg-green-50' :
                            pattern.color === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
                            pattern.color === 'blue' ? 'border-blue-200 bg-blue-50' :
                            'border-purple-200 bg-purple-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-5 h-5 ${
                              pattern.color === 'green' ? 'text-green-600' :
                              pattern.color === 'yellow' ? 'text-yellow-600' :
                              pattern.color === 'blue' ? 'text-blue-600' :
                              'text-purple-600'
                            }`} />
                            <span className="text-base font-medium text-gray-900">{pattern.name}</span>
                          </div>
                          <span className="text-sm text-gray-600">{pattern.start}-{pattern.end}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">
                      勤務可否
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setAvailability('ok')}
                        className={`px-4 py-4 rounded-xl border-2 transition-all ${
                          availability === 'ok'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Check className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-base">勤務可</span>
                      </button>
                      <button
                        onClick={() => setAvailability('ng')}
                        className={`px-4 py-4 rounded-xl border-2 transition-all ${
                          availability === 'ng'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <X className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-base">不可</span>
                      </button>
                    </div>
                  </div>

                  {availability !== 'ng' && (
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        希望時間
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">開始</label>
                          <input
                            type="time"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="w-full px-3 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">終了</label>
                          <input
                            type="time"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="w-full px-3 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      備考・理由
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="任意"
                      className="w-full px-3 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3 pb-4">
                  <button
                    onClick={() => handleBulkUpdate(availability, start, end, note)}
                    className="w-full px-4 py-4 text-base bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                  >
                    適用する
                  </button>
                  <button
                    onClick={() => {
                      const updatedRequests = { ...shiftRequests };
                      selectedDates.forEach(date => {
                        delete updatedRequests[date];
                      });
                      setShiftRequests(updatedRequests);
                      setSelectedDates(new Set());
                      setShowBulkEditPanel(false);
                    }}
                    className="w-full px-4 py-3 text-base border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    選択した日を削除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // PC版
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
        <div className="h-full w-96 max-h-screen bg-white shadow-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDates.size}日分を編集
              </h3>
              <button
                onClick={() => {
                  setShowBulkEditPanel(false);
                  setSelectedDates(new Set());
                }}
                className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {Array.from(selectedDates).slice(0, 5).map(date => {
                const [year, month, day] = date.split('-');
                return (
                  <span key={date} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                    {parseInt(month)}/{parseInt(day)}
                  </span>
                );
              })}
              {selectedDates.size > 5 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  他{selectedDates.size - 5}日
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">クイック設定</h4>
                <button
                  onClick={() => {
                    setShowBulkEditPanel(false);
                    setSelectedDates(new Set());
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  閉じる
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickPatterns.map(pattern => {
                  const Icon = pattern.icon;
                  return (
                    <button
                      key={pattern.id}
                      onClick={() => handleQuickPattern(pattern)}
                      className={`p-3 border-2 rounded-xl hover:border-orange-300 transition-all text-left ${
                        pattern.color === 'green' ? 'border-green-200 bg-green-50' :
                        pattern.color === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
                        pattern.color === 'blue' ? 'border-blue-200 bg-blue-50' :
                        'border-purple-200 bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${
                          pattern.color === 'green' ? 'text-green-600' :
                          pattern.color === 'yellow' ? 'text-yellow-600' :
                          pattern.color === 'blue' ? 'text-blue-600' :
                          'text-purple-600'
                        }`} />
                        <span className="text-sm font-medium text-gray-900">{pattern.name}</span>
                      </div>
                      <span className="text-xs text-gray-600">{pattern.start}-{pattern.end}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  勤務可否
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAvailability('ok')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      availability === 'ok'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Check className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">勤務可</span>
                  </button>
                  <button
                    onClick={() => setAvailability('ng')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      availability === 'ng'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <X className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">不可</span>
                  </button>
                </div>
              </div>

              {availability !== 'ng' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    希望時間
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">開始</label>
                      <input
                        type="time"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">終了</label>
                      <input
                        type="time"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  備考・理由
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="任意"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleBulkUpdate(availability, start, end, note)}
                className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
              >
                適用する
              </button>
              <button
                onClick={() => {
                  const updatedRequests = { ...shiftRequests };
                  selectedDates.forEach(date => {
                    delete updatedRequests[date];
                  });
                  setShiftRequests(updatedRequests);
                  setSelectedDates(new Set());
                  setShowBulkEditPanel(false);
                }}
                className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                選択した日を削除
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
                    item.id === 'shift'
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
                        item.id === 'shift'
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
      <main 
        className="flex-1 overflow-y-auto bg-gray-50" 
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
      >
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
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>シフト希望提出</h1>
                {!isMobile && (
                  <p className="text-sm text-gray-600 mt-1">
                    {currentMonth.split('-')[0]}年{parseInt(currentMonth.split('-')[1])}月分
                    {submitStatus === 'submitted' && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                        提出済み
                      </span>
                    )}
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
                  onClick={handleSaveDraft}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  下書き保存
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitStatus === 'submitted'}
                  className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors shadow-sm ${
                    submitStatus === 'submitted'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {submitStatus === 'submitted' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      提出済み
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      提出する
                    </>
                  )}
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
                {submitStatus === 'submitted' && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                    提出済み
                  </span>
                )}
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
          {/* 進捗バー（モバイル最適化） */}
          {isMobile && (
            <div className="px-4 py-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">入力進捗</span>
                  <span className="text-lg font-bold text-orange-600">{getSubmissionRate()}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                    style={{ width: `${getSubmissionRate()}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  期限: {parseInt(currentMonth.split('-')[1]) - 1}月25日まで
                </div>
              </div>
            </div>
          )}

          {/* タブ（モバイル最適化） */}
          <div className={`${isMobile ? 'px-4 mb-4' : 'mb-6'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex-1 ${isMobile ? 'py-3.5' : 'py-3'} px-4 text-sm font-medium transition-all duration-200 rounded-xl flex items-center justify-center gap-2 ${
                    activeTab === 'calendar' 
                      ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className={isMobile ? 'text-sm' : ''}>カレンダー</span>
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`flex-1 ${isMobile ? 'py-3.5' : 'py-3'} px-4 text-sm font-medium transition-all duration-200 rounded-xl flex items-center justify-center gap-2 ${
                    activeTab === 'list' 
                      ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <FileText className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className={isMobile ? 'text-sm' : ''}>リスト</span>
                </button>
              </div>
            </div>
          </div>

          {/* カレンダー（モバイル最適化） */}
          {activeTab === 'calendar' && (
            <div className={`${isMobile ? 'px-4' : ''}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
                <div className={`grid grid-cols-7 ${isMobile ? 'gap-0.5' : 'gap-1'}`}>
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
                        <div key={`empty-${i}`} className={`${isMobile ? 'h-16' : 'h-24'}`} />
                      );
                    }

                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = formatDate(year, month, day);
                      const request = shiftRequests[date];
                      const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                      const isSelected = selectedDates.has(date);

                      cells.push(
                        <div
                          key={date}
                          data-date={date}
                          className={`${isMobile ? 'h-16' : 'h-24'} border-2 ${isMobile ? 'rounded-lg p-0.5' : 'rounded-xl p-2'} cursor-pointer transition-all select-none ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50'
                              : request
                              ? getAvailabilityColor(request.availability)
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          } ${isWeekend ? 'bg-opacity-50' : ''}`}
                          onClick={(e) => handleDateClick(date, e)}
                          onMouseDown={() => handleMouseDown(date)}
                          onMouseEnter={() => handleMouseEnter(date)}
                          onTouchStart={(e) => handleTouchStart(date, e)}
                          onTouchMove={handleTouchMove}
                        >
                          <div className="h-full flex flex-col">
                            <div className="flex items-start justify-between">
                              <span className={`${isMobile ? 'text-[10px]' : 'text-sm'} font-bold ${
                                dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-800'
                              }`}>
                                {day}
                              </span>
                              {request && isMobile && (
                                <span className={`text-[10px] ${
                                  request.availability === 'ok' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {request.availability === 'ok' ? '◯' : '✕'}
                                </span>
                              )}
                            </div>
                            {request && request.availability !== 'ng' && (
                              <div className="flex-1 flex items-center justify-center">
                                <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-700 font-medium text-center`}>
                                  {request.start.slice(0, 5)}
                                  {isMobile && <br />}
                                  {isMobile ? '|' : '-'}
                                  {isMobile && <br />}
                                  {request.end.slice(0, 5)}
                                </div>
                              </div>
                            )}
                          </div>
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
          {activeTab === 'list' && (
            <div className={`${isMobile ? 'px-4' : ''}`}>
              <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${isMobile ? 'p-3' : 'p-6'}`}>
                <div className={`space-y-${isMobile ? '2' : '3'}`}>
                  {Object.entries(shiftRequests)
                    .filter(([date]) => date.startsWith(currentMonth))
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, request]) => {
                      const [year, month, day] = date.split('-').map(Number);
                      const dayOfWeek = new Date(year, month - 1, day).getDay();
                      
                      return (
                        <div
                          key={date}
                          className={`flex items-center gap-${isMobile ? '3' : '4'} ${isMobile ? 'p-3' : 'p-4'} border border-gray-200 rounded-xl hover:bg-gray-50`}
                        >
                          <div className={`${isMobile ? 'min-w-[60px]' : 'w-20'}`}>
                            <p className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : ''}`}>
                              {month}/{day}
                            </p>
                            <p className={`${isMobile ? 'text-xs' : 'text-sm'} ${
                              dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-600'
                            }`}>
                              {getDayLabel(dayOfWeek)}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-sm'} font-medium ${
                            request.availability === 'ok' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {request.availability === 'ok' ? '勤務可' : '不可'}
                          </div>
                          {request.availability !== 'ng' && (
                            <div className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-700`}>
                              {request.start}-{request.end}
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setSelectedDates(new Set([date]));
                              setShowBulkEditPanel(true);
                            }}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors ml-auto"
                          >
                            <Edit3 className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} text-gray-500`} />
                          </button>
                        </div>
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
                <button className="flex flex-col items-center gap-1 py-2 px-4 text-orange-600">
                  <Calendar className="w-6 h-6" />
                  <span className="text-xs font-medium">シフト提出</span>
                </button>
                <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600">
                  <CalendarDays className="w-6 h-6" />
                  <span className="text-xs">確定シフト</span>
                </button>
                <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600">
                  <Clock className="w-6 h-6" />
                  <span className="text-xs">出退勤</span>
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={submitStatus === 'submitted'}
                  className={`flex flex-col items-center gap-1 py-2 px-4 ${
                    submitStatus === 'submitted' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <Send className="w-6 h-6" />
                  <span className="text-xs">提出</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* モバイルメニュー */}
      {isMobile && <MobileMenu />}

      {/* 一括編集パネル */}
      {showBulkEditPanel && <BulkEditPanel />}
    </div>
  );
};

export default ShiftSubmitPage;