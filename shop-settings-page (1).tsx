import React, { useState } from 'react';
import { 
  Settings, Store, Mail, Lock, Save, AlertCircle,
  Menu, ChevronLeft, Activity, MessageSquare, FileText, LogOut,
  Gift, Dices, Eye, EyeOff, CheckCircle, MapPin, Phone, Clock
} from 'lucide-react';

const ShopSettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('settings');
  const [selectedShop, setSelectedShop] = useState('shop1');
  const [activeTab, setActiveTab] = useState('shop'); // shop, account
  
  // 複数店舗のデータ
  const [shopsData, setShopsData] = useState({
    shop1: {
      name: 'カフェ Sunny 渋谷店',
      businessType: 'カフェ・喫茶店',
      address: '東京都渋谷区道玄坂1-2-3 サンプルビル1F',
      phone: '03-1234-5678',
      businessHours: '10:00-22:00',
      contactEmail: 'shibuya@cafe-sunny.jp'
    },
    shop2: {
      name: 'カフェ Sunny 新宿店',
      businessType: 'カフェ・喫茶店',
      address: '東京都新宿区歌舞伎町1-2-3 サンプルビル2F',
      phone: '03-2345-6789',
      businessHours: '11:00-23:00',
      contactEmail: 'shinjuku@cafe-sunny.jp'
    },
    shop3: {
      name: 'カフェ Sunny 横浜店',
      businessType: 'カフェ・喫茶店',
      address: '神奈川県横浜市西区みなとみらい1-2-3',
      phone: '045-123-4567',
      businessHours: '10:00-21:00',
      contactEmail: 'yokohama@cafe-sunny.jp'
    }
  });

  // 現在選択中の店舗データ
  const currentShopData = shopsData[selectedShop];
  
  // フォームの状態（現在の店舗データで初期化）
  const [shopName, setShopName] = useState(currentShopData.name);
  const [businessType, setBusinessType] = useState(currentShopData.businessType);
  const [address, setAddress] = useState(currentShopData.address);
  const [phone, setPhone] = useState(currentShopData.phone);
  const [businessHours, setBusinessHours] = useState(currentShopData.businessHours);
  const [contactEmail, setContactEmail] = useState(currentShopData.contactEmail);
  
  // アカウント設定
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'

  // 店舗データ（サイドバー用）
  const shops = [
    { id: 'shop1', name: 'カフェ Sunny 渋谷店' },
    { id: 'shop2', name: 'カフェ Sunny 新宿店' },
    { id: 'shop3', name: 'カフェ Sunny 横浜店' }
  ];

  const businessTypes = [
    'レストラン',
    'カフェ・喫茶店',
    '居酒屋・バー',
    'ラーメン・麺類',
    '寿司',
    '焼肉・肉料理',
    'イタリアン',
    'フレンチ',
    '中華料理',
    'エスニック料理',
    'ファストフード',
    'スイーツ・デザート',
    'その他'
  ];

  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: Activity },
    { id: 'surveys', label: 'アンケート管理', icon: FileText },
    { id: 'reviews', label: '口コミ生成履歴', icon: MessageSquare },
    { id: 'coupons', label: 'クーポン管理', icon: Gift, isPreparing: true },
    { id: 'lottery', label: '抽選設定', icon: Dices, isPreparing: true },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  // 店舗切り替え時にフォームデータを更新
  React.useEffect(() => {
    const data = shopsData[selectedShop];
    setShopName(data.name);
    setBusinessType(data.businessType);
    setAddress(data.address);
    setPhone(data.phone);
    setBusinessHours(data.businessHours);
    setContactEmail(data.contactEmail);
  }, [selectedShop, shopsData]);

  const handleSave = () => {
    setSaveStatus('saving');
    
    // 現在の店舗データを更新
    const updatedShopsData = {
      ...shopsData,
      [selectedShop]: {
        name: shopName,
        businessType,
        address,
        phone,
        businessHours,
        contactEmail
      }
    };
    
    setTimeout(() => {
      setShopsData(updatedShopsData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="font-bold text-lg text-gray-900">口コミ365</span>
                  <p className="text-xs text-gray-500">店舗管理システム</p>
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

          {sidebarOpen && shops.length > 1 && (
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="mt-4 w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            >
              {shops.map(shop => (
                <option key={shop.id} value={shop.id}>{shop.name}</option>
              ))}
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
                    disabled={item.isPreparing}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                      item.isPreparing
                        ? 'text-gray-400 cursor-not-allowed'
                        : activeMenu === item.id
                        ? 'bg-orange-50 text-orange-600 font-medium border border-orange-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {sidebarOpen && (
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.isPreparing && (
                          <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">準備中</span>
                        )}
                      </span>
                    )}
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
                <h1 className="text-2xl font-bold text-gray-900">設定</h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  {currentShopData.name}
                </p>
              </div>
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
                    保存する
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* タブナビゲーション */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('shop')}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'shop'
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                店舗情報
                {activeTab === 'shop' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'account'
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                アカウント設定
                {activeTab === 'account' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            </div>
          </div>

          {/* 店舗情報タブ */}
          {activeTab === 'shop' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">店舗基本情報</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    店舗名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    業種 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    住所
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    電話番号
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    営業時間
                  </label>
                  <input
                    type="text"
                    value={businessHours}
                    onChange={(e) => setBusinessHours(e.target.value)}
                    placeholder="例: 10:00-22:00"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    担当者メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">重要なお知らせや通知を受け取るメールアドレス</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>ヒント：</strong>口コミの投稿先URLは、各アンケートの「投稿先設定」で個別に設定できます。
                    同じ店舗でも、アンケートごとに異なるプラットフォーム（Googleマップ、食べログなど）への誘導が可能です。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* アカウント設定タブ */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* ログイン情報 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">ログイン情報</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ログインメールアドレス
                    </label>
                    <input
                      type="email"
                      value="admin@cafe-sunny.jp"
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ログインメールアドレスの変更はシステム管理者にお問い合わせください
                    </p>
                  </div>
                </div>
              </div>

              {/* パスワード変更 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">パスワード変更</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      現在のパスワード
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      新しいパスワード
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">8文字以上で、英数字を含めてください</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      新しいパスワード（確認）
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">パスワードが一致しません</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 通知設定 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">通知設定</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">口コミ生成の通知</p>
                      <p className="text-xs text-gray-500">新しい口コミが生成されたときにメールで通知</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">週次レポート</p>
                      <p className="text-xs text-gray-500">毎週月曜日に先週の統計情報をメールで送信</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">システムメンテナンス通知</p>
                      <p className="text-xs text-gray-500">メンテナンスやアップデート情報を受け取る</p>
                    </div>
                  </label>
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