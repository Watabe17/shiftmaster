import React, { useState } from 'react';
import {
  Calendar, Building, Mail, Tag, Loader2, AlertCircle, CheckCircle, XCircle,
  CreditCard, Zap, Clock, Users, TrendingUp
} from 'lucide-react';

const StoreRegistration = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerEmail: '',
    inviteCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeValid, setCodeValid] = useState(null);

  const handleSubmit = async () => {
    setError('');
    
    if (!formData.storeName || !formData.ownerEmail) {
      setError('必須項目を入力してください');
      return;
    }
    
    if (!formData.ownerEmail.includes('@')) {
      setError('正しいメールアドレスを入力してください');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      if (formData.inviteCode === 'SPONSOR2024') {
        setCodeValid(true);
        alert('招待コードが有効です。決済をスキップして店舗を作成します。');
      } else if (formData.inviteCode) {
        setCodeValid(false);
        setError('無効な招待コードです');
        setIsLoading(false);
      } else {
        alert('Stripe Checkout画面へ遷移します');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col">
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">ShiftMaster</h1>
              <p className="text-xs text-gray-500">シフト管理システム</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">店舗登録</h2>
              <p className="text-white/90 text-sm">シフト管理を始めましょう</p>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  店舗名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="カフェ ShiftMaster 渋谷店"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  管理者メールアドレス <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  招待コード（任意）
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.inviteCode}
                    onChange={(e) => setFormData({...formData, inviteCode: e.target.value.toUpperCase()})}
                    className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      codeValid === true ? 'border-green-500 bg-green-50' : 
                      codeValid === false ? 'border-red-500 bg-red-50' : 
                      'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder="SPONSOR2024"
                  />
                  {codeValid === true && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                  {codeValid === false && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-bold text-blue-900 mb-3">ShiftMasterの主な機能</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">AI自動シフト作成</p>
                        <p className="text-xs text-gray-600">従業員の希望を考慮して最適なシフトを自動生成</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">位置情報打刻</p>
                        <p className="text-xs text-gray-600">不正打刻を防ぐ位置情報による出退勤管理</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">従業員管理</p>
                        <p className="text-xs text-gray-600">シフト希望の提出から勤怠管理まで一元化</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">分析レポート</p>
                        <p className="text-xs text-gray-600">人件費や勤務実績を可視化してコスト最適化</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>処理中...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>登録して決済へ進む</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <a
                  href="/login"
                  className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  すでにアカウントをお持ちの方
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoreRegistration;