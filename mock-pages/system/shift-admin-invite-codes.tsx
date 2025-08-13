import React, { useState } from 'react';
import {
  Shield, Store, Menu, ChevronLeft, LogOut, Database, FileText,
  Tag, Plus, Copy
} from 'lucide-react';

const AdminInviteCodes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [codes, setCodes] = useState([
    {
      id: 'c1',
      code: 'SPONSOR2024',
      expiresAt: '2024-12-31',
      maxUses: 100,
      usedCount: 5,
      note: '2024年スポンサー企業向け',
      isActive: true
    },
    {
      id: 'c2',
      code: 'EARLY2024',
      expiresAt: '2024-06-30',
      maxUses: 50,
      usedCount: 50,
      note: 'アーリーアダプター向け',
      isActive: false
    },
    {
      id: 'c3',
      code: 'TEST2024',
      expiresAt: '2024-03-31',
      maxUses: null,
      usedCount: 3,
      note: 'テスト用（無制限）',
      isActive: true
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState({
    code: '',
    expiresAt: '',
    maxUses: '',
    note: ''
  });

  const menuItems = [
    { id: 'stores', label: '店舗管理', icon: Store },
    { id: 'invite-codes', label: '招待コード', icon: Tag },
    { id: 'database', label: 'データベース', icon: Database },
    { id: 'logs', label: 'システムログ', icon: FileText }
  ];

  const handleCreateCode = () => {
    const code = {
      id: `c${Date.now()}`,
      code: newCode.code.toUpperCase(),
      expiresAt: newCode.expiresAt,
      maxUses: newCode.maxUses ? parseInt(newCode.maxUses) : null,
      usedCount: 0,
      note: newCode.note,
      isActive: true
    };
    setCodes([...codes, code]);
    setShowCreateModal(false);
    setNewCode({ code: '', expiresAt: '', maxUses: '', note: '' });
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`コード "${code}" をコピーしました`);
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
                      item.id === 'invite-codes'
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
                <h1 className="text-2xl font-bold text-gray-900">招待コード管理</h1>
                <p className="text-sm text-gray-600 mt-1">決済スキップ用の招待コード</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                新規発行
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    コード
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    有効期限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    使用状況
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    メモ
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
                {codes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {code.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(code.code)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{code.expiresAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {code.usedCount} / {code.maxUses || '無制限'}
                      </div>
                      {code.maxUses && (
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-orange-500 h-1.5 rounded-full" 
                            style={{ width: `${(code.usedCount / code.maxUses) * 100}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{code.note}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {code.isActive ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          有効
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          無効
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          const updated = codes.map(c => 
                            c.id === code.id ? {...c, isActive: !c.isActive} : c
                          );
                          setCodes(updated);
                        }}
                        className="text-sm text-orange-600 hover:text-orange-900"
                      >
                        {code.isActive ? '無効化' : '有効化'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 新規作成モーダル */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">招待コード新規発行</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    コード <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCode.code}
                    onChange={(e) => setNewCode({...newCode, code: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="SPONSOR2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    有効期限
                  </label>
                  <input
                    type="date"
                    value={newCode.expiresAt}
                    onChange={(e) => setNewCode({...newCode, expiresAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    使用上限（空欄で無制限）
                  </label>
                  <input
                    type="number"
                    value={newCode.maxUses}
                    onChange={(e) => setNewCode({...newCode, maxUses: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メモ
                  </label>
                  <textarea
                    value={newCode.note}
                    onChange={(e) => setNewCode({...newCode, note: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    rows="2"
                    placeholder="用途や対象者など"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleCreateCode}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  発行
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminInviteCodes;