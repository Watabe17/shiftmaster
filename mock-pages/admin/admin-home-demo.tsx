import React, { useState } from 'react';

// 管理者ホーム（デモ）
// トンマナは `review365-app (2).tsx` を踏襲（白背景カード/角丸/淡い枠線/オレンジ系アクセント）
// 外部依存（アイコン等）は使わず、簡易的な丸アイコンで表現

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
  const [selectedStore] = useState<{ id: string; name: string }>({ id: 'store-1', name: 'カフェ Sunny 渋谷店' });

  // ダミーデータ
  const weeklyStats = {
    submittedRequests: 12,
    pendingRequests: 5,
    attendanceCorrections: 3,
  };

  const quickActions: QuickAction[] = [
    { id: 'shift-create', label: 'シフトを自動作成', description: '希望とルールからAIで生成', color: 'orange' },
    { id: 'employees', label: '従業員を管理', description: '登録・編集・ポジション設定', color: 'blue' },
    { id: 'attendance', label: '勤怠を確認/修正', description: '打刻や修正申請の確認', color: 'green' },
  ];

  const submissionStatuses: SubmissionStatus[] = [
    { userId: 'u1', userName: '佐藤 太郎', submitted: true, lastUpdated: '2025-01-25 20:11' },
    { userId: 'u2', userName: '鈴木 花子', submitted: false },
    { userId: 'u3', userName: '田中 一郎', submitted: true, lastUpdated: '2025-01-26 09:02' },
    { userId: 'u4', userName: '山田 次郎', submitted: false },
  ];

  const recentActivities = [
    { id: 1, type: 'shift', text: '2月の仮シフトを保存しました', time: '10分前' },
    { id: 2, type: 'request', text: '鈴木 花子 さんが2月の希望を提出しました', time: '1時間前' },
    { id: 3, type: 'attendance', text: '退勤時刻の修正申請が1件あります', time: '2時間前' },
  ];

  const submissionRate = Math.round(
    (submissionStatuses.filter(s => s.submitted).length / submissionStatuses.length) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">管理者ホーム</h1>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-gray-300 rounded" />
                {selectedStore.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium text-sm">
                今月のシフトを作成
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* コンテンツ */}
      <main className="px-8 py-8">
        {/* 概況 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">今週の状況</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="シフト希望の提出" value={`${weeklyStats.submittedRequests}件`} hint="過去7日間" tone="orange" />
            <StatCard title="未提出者" value={`${weeklyStats.pendingRequests}名`} hint="提出依頼を検討" tone="blue" />
            <StatCard title="勤怠修正申請" value={`${weeklyStats.attendanceCorrections}件`} hint="承認待ち" tone="green" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 左: 提出状況 */}
          <div className="xl:col-span-2 space-y-6">
            <SectionCard
              title="シフト希望 提出状況"
              right={<span className="text-sm text-gray-500">提出率 {submissionRate}%</span>}
            >
              <div className="p-6">
                <div className="mb-4">
                  <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-orange-500 rounded-full"
                      style={{ width: `${submissionRate}%` }}
                    />
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

            <SectionCard title="クイックアクション">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((qa) => (
                    <button key={qa.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all text-left group">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${qa.color === 'orange' ? 'bg-orange-100 group-hover:bg-orange-200' : qa.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' : 'bg-green-100 group-hover:bg-green-200'} transition-colors`}>
                          <div className={`w-5 h-5 rounded ${qa.color === 'orange' ? 'bg-orange-600' : qa.color === 'blue' ? 'bg-blue-600' : 'bg-green-600'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{qa.label}</p>
                          <p className="text-sm text-gray-600 mt-1">{qa.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* 右: 最近の更新 */}
          <div className="space-y-6">
            <SectionCard title="最近の更新" right={<button className="text-sm text-orange-600 hover:text-orange-700 font-medium">すべて見る</button>}>
              <div className="p-6 divide-y divide-gray-200">
                {recentActivities.map((a) => (
                  <div key={a.id} className="py-3 flex items-start gap-3">
                    <div className="pt-0.5">
                      <div className={`w-3 h-3 rounded-full ${a.type === 'shift' ? 'bg-orange-500' : a.type === 'request' ? 'bg-blue-500' : 'bg-green-500'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{a.text}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="運用メモ">
              <div className="p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>ヒント：</strong>シフト作成前に、提出締め切りを設定してリマインドを送りましょう。
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHomeDemo;


