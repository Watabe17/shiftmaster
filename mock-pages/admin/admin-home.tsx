import React, { useMemo, useState } from 'react';
import { 
  Home, Calendar, Users, Clock, Settings, ChevronLeft, Menu,
  LogOut, ChevronDown, UserCheck, CheckCircle,
  ArrowRight, Activity, PlusCircle
} from 'lucide-react';

type SubmissionStatus = {
  userId: string;
  userName: string;
  submitted: boolean;
  lastUpdated?: string;
  department?: string;
};

const AdminHomeDemo: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedStore] = useState({ id: 'store-1', name: 'カフェ Sunny 渋谷店' });

  // 対象月の管理
  const computeNextMonth = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    return `${year}-${month}`;
  };
  
  const computeCurrentMonth = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    return `${year}-${month}`;
  };
  
  const [targetMonth, setTargetMonth] = useState(computeNextMonth());
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  
  const monthCandidates = useMemo(() => {
    const list: string[] = [];
    const base = new Date();
    base.setDate(1);
    for (let i = -2; i <= 3; i += 1) {
      const d = new Date(base);
      d.setMonth(base.getMonth() + i);
      const ym = `${d.getFullYear()}年${d.getMonth() + 1}月`;
      list.push(ym);
    }
    return list;
  }, []);

  const menuItems = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'shift', label: 'シフト作成', icon: Calendar },
    { id: 'employees', label: '従業員管理', icon: Users },
    { id: 'attendance', label: '勤怠管理', icon: Clock },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  const submissionStatuses: SubmissionStatus[] = [
    { userId: 'u1', userName: '佐藤 太郎', submitted: true, lastUpdated: '2025-01-25 20:11', department: 'ホール' },
    { userId: 'u2', userName: '鈴木 花子', submitted: false, department: 'キッチン' },
    { userId: 'u3', userName: '田中 一郎', submitted: true, lastUpdated: '2025-01-26 09:02', department: 'ホール' },
    { userId: 'u4', userName: '山田 次郎', submitted: false, department: 'キッチン' },
    { userId: 'u5', userName: '高橋 美咲', submitted: true, lastUpdated: '2025-01-27 14:30', department: 'ホール' },
    { userId: 'u6', userName: '伊藤 健太', submitted: true, lastUpdated: '2025-01-27 16:45', department: 'キッチン' },
    { userId: 'u7', userName: '渡辺 真一', submitted: false, department: 'ホール' },
    { userId: 'u8', userName: '小林 由美', submitted: true, lastUpdated: '2025-01-28 10:15', department: 'キッチン' }
  ];

  const submissionRate = Math.round(
    (submissionStatuses.filter(s => s.submitted).length / submissionStatuses.length) * 100
  );

  const pendingCount = submissionStatuses.filter(s => !s.submitted).length;
  const submittedCount = submissionStatuses.filter(s => s.submitted).length;



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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {selectedStore.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowMonthMenu(!showMonthMenu)}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-300 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Calendar className="w-4 h-4 text-orange-500" />
                    対象月: {targetMonth.split('年')[0]}年{targetMonth.split('年')[1]}
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {showMonthMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <ul className="max-h-60 overflow-auto py-1">
                        {monthCandidates.map((month) => (
                          <li key={month}>
                            <button
                              onClick={() => {
                                setTargetMonth(month);
                                setShowMonthMenu(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-orange-50 ${
                                targetMonth === month ? 'text-orange-600 font-medium bg-orange-50' : 'text-gray-700'
                              }`}
                            >
                              {month}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm font-medium text-sm flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  シフト作成
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* コンテンツ */}
        <div className="p-8 space-y-6">
          {/* クイックアクション（最上部） */}
          <div className="grid grid-cols-3 gap-4">
            <button className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-4 hover:border-orange-300 hover:shadow-md transition-all group">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <p className="font-bold text-gray-900">シフト管理</p>
              </div>
            </button>

            <button className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-bold text-gray-900">従業員管理</p>
              </div>
            </button>

            <button className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-4 hover:border-green-300 hover:shadow-md transition-all group">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-bold text-gray-900">勤怠管理</p>
              </div>
            </button>
          </div>

          {/* シフト希望提出状況 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">シフト希望 提出状況</h2>
                  <p className="text-sm text-gray-600 mt-1">{targetMonth.split('年')[0]}年{targetMonth.split('年')[1]}の提出状況</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{submittedCount}</p>
                    <p className="text-xs text-gray-600">提出済み</p>
                  </div>
                  <div className="w-px h-10 bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                    <p className="text-xs text-gray-600">未提出</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">提出進捗</span>
                  <span className="text-sm font-bold text-orange-600">{submissionRate}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                    style={{ width: `${submissionRate}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {submissionStatuses.map((status) => (
                  <div 
                    key={status.userId}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        status.submitted ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-400'
                      }`}>
                        {status.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{status.userName}</p>
                        <p className="text-xs text-gray-500">
                          {status.department} • {status.submitted ? `${status.lastUpdated} 更新` : '未提出'}
                        </p>
                      </div>
                    </div>
                    <div>
                      {status.submitted ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          提出済み
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          未提出
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                全員の状況を見る
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminHomeDemo;