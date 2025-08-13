import React, { useMemo, useState } from 'react';

type SubmissionStatus = {
  userId: string;
  userName: string;
  submitted: boolean;
  lastUpdated?: string;
};

type QuickAction = {
  id: string;
  label: string;
  description: string;
  color: 'orange' | 'blue' | 'green';
};

const CircleIcon: React.FC<{ label?: string; colorClass?: string }> = ({ label, colorClass }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${colorClass ?? 'bg-gray-400'}`}>
    {label ?? ''}
  </div>
);

const StatCard: React.FC<{ title: string; value: string | number; hint?: string; tone?: 'orange' | 'blue' | 'green' }>
  = ({ title, value, hint, tone = 'orange' }) => {
  const toneBg: Record<string, string> = {
    orange: 'bg-orange-50 border-orange-100',
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
  };
  const toneBar: Record<string, string> = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };
  return (
    <div className={`rounded-lg p-4 border ${toneBg[tone]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <div className={`p-1.5 rounded ${toneBg[tone].split(' ')[0]}`}>
          <div className={`w-4 h-4 rounded ${toneBar[tone]}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
};

const SectionCard: React.FC<{ title: string; right?: React.ReactNode; children: React.ReactNode }>
  = ({ title, right, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-6 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {right}
      </div>
    </div>
    {children}
  </div>
);

const AdminHomeDemo: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'home' | 'shift' | 'employees' | 'attendance' | 'settings'>('home');
  const [selectedStore] = useState<{ id: string; name: string }>({ id: 'store-1', name: 'カフェ Sunny 渋谷店' });

  // 対象月（初期値: 翌月）
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
  const [targetMonth, setTargetMonth] = useState<string>(computeNextMonth());
  const monthOptions = useMemo(() => [computeCurrentMonth(), computeNextMonth()], []);
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  const monthCandidates = useMemo(() => {
    const list: string[] = [];
    const base = new Date();
    base.setDate(1);
    for (let i = -2; i <= 3; i += 1) {
      const d = new Date(base);
      d.setMonth(base.getMonth() + i);
      const ym = `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}`;
      list.push(ym);
    }
    return list;
  }, []);
  const monthLabel = (m: string) => (m === computeCurrentMonth() ? '当月' : '翌月');

  const weeklyStats = {
    submittedRequests: 12,
    pendingRequests: 5,
  };

  const quickActions: QuickAction[] = [
    { id: 'shift-create', label: 'シフト作成', description: '', color: 'orange' },
    { id: 'employees', label: '従業員管理', description: '', color: 'blue' },
    { id: 'attendance', label: '勤怠管理', description: '', color: 'green' },
  ];

  const submissionStatuses: SubmissionStatus[] = [
    { userId: 'u1', userName: '佐藤 太郎', submitted: true, lastUpdated: '2025-01-25 20:11' },
    { userId: 'u2', userName: '鈴木 花子', submitted: false },
    { userId: 'u3', userName: '田中 一郎', submitted: true, lastUpdated: '2025-01-26 09:02' },
    { userId: 'u4', userName: '山田 次郎', submitted: false },
  ];

  const submissionRate = Math.round(
    (submissionStatuses.filter(s => s.submitted).length / submissionStatuses.length) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`} role="navigation" aria-label="サイドバー">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <div className="w-6 h-6 bg-white rounded" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="font-bold text-lg text-gray-900 tracking-tight">シフト管理</span>
                  <p className="text-xs text-gray-500">管理コンソール</p>
                </div>
              )}
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300" aria-label="サイドバーを折りたたむ">
              <span className="block w-4 h-4 bg-white rounded border border-gray-300" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {[
              { id: 'home', label: 'ホーム' },
              { id: 'shift', label: 'シフト作成' },
              { id: 'employees', label: '従業員' },
              { id: 'attendance', label: '勤怠' },
              { id: 'settings', label: '設定' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                    activeMenu === (item.id as any)
                      ? 'bg-orange-50 text-orange-600 font-medium border border-orange-200 shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  } ${!sidebarOpen && 'justify-center'}`}
                >
                  <span className={`w-5 h-5 rounded border ${
                    activeMenu === (item.id as any) ? 'border-orange-300 bg-orange-50' : 'border-gray-300 bg-white'
                  }`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* メイン */}
      <main className="flex-1 overflow-y-auto bg-gray-50" role="main">
        {/* ヘッダー */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">管理者ホーム</h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-gray-300 rounded" />
                  {selectedStore.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative inline-flex items-center gap-1 p-1 bg-gray-100 border border-gray-200 rounded-lg" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setShowMonthMenu(false); }}>
                  {monthOptions.map((m) => (
                    <button
                      key={m}
                      onClick={() => setTargetMonth(m)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                        targetMonth === m ? 'bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      aria-pressed={targetMonth === m}
                    >
                      {monthLabel(m)} {m}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowMonthMenu(v => !v)}
                    className="px-2 py-1.5 text-sm rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                    aria-expanded={showMonthMenu}
                    aria-haspopup="listbox"
                    title="他の月を選択"
                    onKeyDown={(e) => { if (e.key === 'Escape') setShowMonthMenu(false); }}
                  >
                    ▼
                  </button>
                  {showMonthMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <ul className="max-h-60 overflow-auto py-1" role="listbox">
                        {monthCandidates.map((m) => (
                          <li key={m}>
                            <button
                              onClick={() => {
                                setTargetMonth(m);
                                setShowMonthMenu(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                                targetMonth === m ? 'text-orange-600 font-medium' : 'text-gray-700'
                              }`}
                              role="option"
                              aria-selected={targetMonth === m}
                            >
                              {m}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">
                  対象月のシフトを作成
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* コンテンツ */}
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
          {/* クイックアクション（最上部） */}
          <SectionCard title="クイックアクション">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((qa) => (
                  <button key={qa.id} className="p-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-md ring-1 ring-inset ${qa.color === 'orange' ? 'bg-orange-50 ring-orange-200 group-hover:bg-orange-100' : qa.color === 'blue' ? 'bg-blue-50 ring-blue-200 group-hover:bg-blue-100' : 'bg-green-50 ring-green-200 group-hover:bg-green-100'} transition-colors`}>
                        <div className={`w-5 h-5 rounded-sm ${qa.color === 'orange' ? 'bg-orange-500' : qa.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 tracking-tight">{qa.label}</p>
                        {qa.description && <p className="text-sm text-gray-600 mt-1">{qa.description}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* 概要 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">概要（対象月: {targetMonth}）</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4 border bg-orange-50 border-orange-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-800">シフト希望の提出</p>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-white ring-1 ring-orange-200">
                    <span className="block w-3 h-3 rounded bg-orange-500" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{weeklyStats.submittedRequests}件</p>
                <p className="text-xs text-gray-500 mt-1">過去7日間</p>
              </div>
              <div className="rounded-xl p-4 border bg-blue-50 border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-800">未提出者</p>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-white ring-1 ring-blue-200">
                    <span className="block w-3 h-3 rounded bg-blue-500" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{weeklyStats.pendingRequests}名</p>
                <p className="text-xs text-gray-500 mt-1">提出依頼を検討</p>
              </div>
            </div>
          </div>

          {/* 提出状況 */}
          <SectionCard
            title="シフト希望 提出状況"
            right={<span className="text-sm text-gray-500">提出率 {submissionRate}%</span>}
          >
            <div className="p-6">
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-orange-500/90 rounded-full transition-all" style={{ width: `${submissionRate}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>対象月: {targetMonth}</span>
                  <span>提出率 {submissionRate}%</span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {submissionStatuses.map((s) => (
                  <div key={s.userId} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <CircleIcon label={s.userName.charAt(0)} colorClass={s.submitted ? 'bg-green-500' : 'bg-gray-400'} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{s.userName}</p>
                        <p className="text-xs text-gray-500">{s.submitted ? (s.lastUpdated ? `${s.lastUpdated} 更新` : '提出済み') : '未提出'}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${s.submitted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {s.submitted ? '提出済み' : '未提出'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
};

export default AdminHomeDemo;


