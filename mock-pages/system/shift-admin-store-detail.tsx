import React, { useState } from 'react';
import {
  Shield, Store, Menu, ChevronLeft, LogOut, Database, FileText,
  Tag, Info, CreditCard, UserPlus, Pause, Play, Copy, Trash2, ExternalLink,
  Edit2
} from 'lucide-react';

const AdminStoreDetail = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [store, setStore] = useState({
    id: 's1',
    name: 'カフェ ShiftMaster 渋谷店',
    address: '東京都渋谷区道玄坂1-2-3',
    ownerEmail: 'owner1@example.com',
    ownerName: '田中 太郎',
    phone: '03-1234-5678',
    plan: 'paid',
    planStatus: 'active',
    stripeCustomerId: 'cus_123456789',
    stripeSubscriptionId: 'sub_987654321',
    isSponsored: false,
    createdAt: '2024-01-15',
    isActive: true,
    employeeCount: 15,
    monthlyRevenue: 98000
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [editData, setEditData] = useState({...store});

  const menuItems = [
    { id: 'stores', label: '店舗管理', icon: Store },
    { id: 'invite-codes', label: '招待コード', icon: Tag },
    { id: 'database', label: 'データベース', icon: Database },
    { id: 'logs', label: 'システムログ', icon: FileText }
  ];

  const handleSaveBasicInfo = () => {
    setStore(editData);
    setIsEditingBasic(false);
    alert('基本情報を更新しました');
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
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-gray-900">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
                  <p className="text-sm text-gray-600 mt-1">店舗ID: {store.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStore({...store, isActive: !store.isActive})}
                  className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${
                    store.isActive 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {store.isActive ? (
                    <>
                      <Pause className="w-4 h-4" />
                      停止
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      再開
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
            <div className="flex border-b border-gray-200">
              {[
                { id: 'overview', label: '概要', icon: Info },
                { id: 'billing', label: '課金情報', icon: CreditCard },
                { id: 'invites', label: '招待管理', icon: UserPlus },
                { id: 'logs', label: 'ログ', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
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

          {/* 概要タブ */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">基本情報</h3>
                  {!isEditingBasic ? (
                    <button
                      onClick={() => setIsEditingBasic(true)}
                      className="text-orange-600 hover:text-orange-700 text-sm flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      編集
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditData({...store});
                          setIsEditingBasic(false);
                        }}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleSaveBasicInfo}
                        className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
                      >
                        保存
                      </button>
                    </div>
                  )}
                </div>
                
                {isEditingBasic ? (
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">店舗名</dt>
                      <dd>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">住所</dt>
                      <dd>
                        <input
                          type="text"
                          value={editData.address}
                          onChange={(e) => setEditData({...editData, address: e.target.value})}
                          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">電話番号</dt>
                      <dd>
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">オーナー名</dt>
                      <dd>
                        <input
                          type="text"
                          value={editData.ownerName}
                          onChange={(e) => setEditData({...editData, ownerName: e.target.value})}
                          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">メールアドレス</dt>
                      <dd>
                        <input
                          type="email"
                          value={editData.ownerEmail}
                          onChange={(e) => setEditData({...editData, ownerEmail: e.target.value})}
                          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">店舗名</dt>
                      <dd className="text-sm font-medium text-gray-900">{store.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">住所</dt>
                      <dd className="text-sm font-medium text-gray-900">{store.address}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">電話番号</dt>
                      <dd className="text-sm font-medium text-gray-900">{store.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">オーナー</dt>
                      <dd className="text-sm font-medium text-gray-900">{store.ownerName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">メールアドレス</dt>
                      <dd className="text-sm font-medium text-gray-900">{store.ownerEmail}</dd>
                    </div>
                  </dl>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">利用状況</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">プラン</dt>
                    <dd className="text-sm font-medium">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        有料プラン
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">ステータス</dt>
                    <dd className="text-sm font-medium">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        正常
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">従業員数</dt>
                    <dd className="text-sm font-medium text-gray-900">{store.employeeCount} 名</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">月額料金</dt>
                    <dd className="text-sm font-medium text-gray-900">¥{store.monthlyRevenue.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">登録日</dt>
                    <dd className="text-sm font-medium text-gray-900">{store.createdAt}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* 課金情報タブ */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Stripe 情報</h3>
              <dl className="space-y-3 mb-6">
                <div>
                  <dt className="text-sm text-gray-500">Customer ID</dt>
                  <dd className="text-sm font-mono text-gray-900 flex items-center gap-2">
                    {store.stripeCustomerId}
                    <button className="text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Subscription ID</dt>
                  <dd className="text-sm font-mono text-gray-900 flex items-center gap-2">
                    {store.stripeSubscriptionId}
                    <button className="text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </dd>
                </div>
              </dl>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Stripe Dashboard で確認
              </button>
            </div>
          )}

          {/* 招待管理タブ */}
          {activeTab === 'invites' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">管理者招待リンク</h3>
                <button className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm">
                  新規生成
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">有効な招待リンク</span>
                    <span className="text-xs text-gray-500">有効期限: 2024-12-31</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="https://shiftmaster.app/onboard?token=abc123..."
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm"
                    />
                    <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-red-300 text-red-600 rounded hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ログタブ */}
          {activeTab === 'logs' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">システムログ</h3>
              <div className="space-y-2">
                {[
                  { time: '2024-03-15 14:23:45', action: 'プラン変更', detail: '無料プラン → 有料プラン' },
                  { time: '2024-03-10 09:15:22', action: '管理者追加', detail: 'admin2@example.com' },
                  { time: '2024-03-01 18:30:00', action: '店舗作成', detail: '初期登録完了' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500 font-mono">{log.time}</span>
                    <span className="text-sm font-medium text-gray-900">{log.action}</span>
                    <span className="text-sm text-gray-600">{log.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminStoreDetail;