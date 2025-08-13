import React, { useState, useEffect } from 'react';
import {
  Calendar, Loader2, CheckCircle, AlertTriangle, Info
} from 'lucide-react';

const PaymentReturn = () => {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'cancel'
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const result = urlParams.get('result');
    
    setTimeout(() => {
      setStatus(result === 'cancel' ? 'cancel' : 'success');
    }, 1500);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">決済結果を確認中...</p>
        </div>
      </div>
    );
  }

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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            {status === 'success' ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">決済完了</h2>
                <p className="text-gray-600 mb-6">
                  お支払いが正常に処理されました。<br />
                  店舗の登録が完了しました。
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">次のステップ</h3>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li>1. 管理者アカウントの招待メールをご確認ください</li>
                    <li>2. メール内のリンクからアカウントを作成</li>
                    <li>3. 初期設定を行いシステムの利用を開始</li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-blue-800">
                    <Info className="w-4 h-4 inline mr-1" />
                    サブスクリプションの詳細は管理画面の「請求管理」から確認できます
                  </p>
                </div>

                <a
                  href="/login"
                  className="w-full inline-block px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors font-medium"
                >
                  ログイン画面へ
                </a>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-12 h-12 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">決済がキャンセルされました</h2>
                <p className="text-gray-600 mb-6">
                  決済処理がキャンセルされました。<br />
                  店舗登録を完了するには決済が必要です。
                </p>

                <div className="flex gap-3">
                  <a
                    href="/register-store"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
                  >
                    登録画面に戻る
                  </a>
                  <a
                    href="/"
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    トップページへ
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentReturn;