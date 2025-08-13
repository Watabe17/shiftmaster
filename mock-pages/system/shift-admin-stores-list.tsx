import React, { useState } from 'react';
import {
  Shield, Store, Menu, ChevronLeft, LogOut, Database, FileText,
  Search, Tag
} from 'lucide-react';

const AdminStoresList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stores, setStores] = useState([
    {
      id: 's1',
      name: 'カフェ ShiftMaster 渋谷店',
      ownerEmail: 'owner1@example.com',
      plan: 'paid',
      planStatus: 'active',
      createdAt: '2024-01-15',
      isActive: true
    },
    {
      id: 's2',
      name: 'レストラン ABC 新宿店',
      ownerEmail: 'owner2@example.com',
      plan: 'sponsored',
      planStatus: 'active',
      createdAt: '2024-02-01',
      isActive: true
    },
    {
      id: 's3',
      name: 'ベーカリー XYZ',
      ownerEmail: 'owner3@example.com',
      plan: 'paid',
      planStatus: 'past_due',
      createdAt: '2024-01-20',
      isActive: true
    },
    {
      id: 's4',
      name: 'バー Night',
      ownerEmail: 'owner4@example.com',
      plan: 'free',
      planStatus: 'active',
      createdAt: '2024-03-01',
      isActive: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const menuItems = [
    { id: 'stores', label: '店舗管理', icon: Store },
    { id: 'invite-codes', label: '招待コード', icon: Tag },
    { id: 'database', label: 'データベース', icon: Database },
    { id: 'logs', label: 'システムログ', icon: FileText }
  ];

  const filteredStores = stores.filter(store => {
    if (searchQuery && !store.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !store.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterPlan !== 'all' && store.plan !== filterPlan) return false;
    if (filterStatus !== 'all') {
      if (filterStatus === 'active' && !store.isActive) return false;
      if (filterStatus === 'inactive' && store.isActive) return false;
    }
    return true;
  });

  const getPlanBadge = (plan) => {
    const badges = {
      paid: { bg: 'bg-green-100', text: 'text-green-700', label: '有料' },
      sponsored: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'スポンサー' },
      free: { bg: 'bg-gray-100', text: 'text-gray-700', label: '無料' }
    };
    return badges[plan] || badges.free;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: '正常' },
      past_due: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '支払遅延' },
      canceled: { bg: 'bg-red-100', text: 'text-red-700', label: 'キャンセル' }
    };
    return badges[status] || badges.active;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="font-bold text-lg text-gray-900">System Admin</span>
                  <p className="text-xs text-gray-500">システム管理</p>
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
                      item.id === 'stores'
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
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">店舗管理</h1>
                <p className="text-sm text-gray-600 mt-1">登録店舗の一覧と管理</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {filteredStores.length} 店舗
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* フィルター */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="店舗名・メールアドレスで検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              >
                <option value="all">全プラン</option>
                <option value="paid">有料</option>
                <option value="sponsored">スポンサー</option>
                <option value="free">無料</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              >
                <option value="all">全ステータス</option>
                <option value="active">稼働中</option>
                <option value="inactive">停止中</option>
              </select>
            </div>
          </div>

          {/* 店舗一覧 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    店舗名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    オーナー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    プラン
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    課金状態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作成日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStores.map((store) => {
                  const planBadge = getPlanBadge(store.plan);
                  const statusBadge = getStatusBadge(store.planStatus);
                  
                  return (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{store.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{store.ownerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${planBadge.bg} ${planBadge.text}`}>
                          {planBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{store.createdAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const updated = stores.map(s => 
                              s.id === store.id ? {...s, isActive: !s.isActive} : s
                            );
                            setStores(updated);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            store.isActive ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            store.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-orange-600 hover:text-orange-900">
                          詳細
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminStoresList;