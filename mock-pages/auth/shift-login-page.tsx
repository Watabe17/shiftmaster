import React, { useState } from 'react';
import {
  Calendar, Lock, Mail, Eye, EyeOff, LogIn, 
  AlertCircle, Loader2, ShieldCheck, KeyRound
} from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // モバイル判定
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = async () => {
    setError('');
    
    // バリデーション
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    if (!email.includes('@')) {
      setError('正しいメールアドレスを入力してください');
      return;
    }

    setIsLoading(true);

    // デモ用: 2秒後に処理
    setTimeout(() => {
      // デモ: admin@example.com / password でログイン成功
      if (email === 'admin@example.com' && password === 'password') {
        // 管理者として /admin/home へ遷移
        console.log('管理者としてログイン成功');
        window.location.href = '/admin/home';
      } else if (email === 'employee@example.com' && password === 'password') {
        // 従業員として /shift へ遷移
        console.log('従業員としてログイン成功');
        window.location.href = '/shift';
      } else {
        setError('メールアドレスまたはパスワードが正しくありません');
        setIsLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col">
      {/* ヘッダー */}
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

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* ログインカード */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* カードヘッダー */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">ログイン</h2>
              <p className="text-white/90 text-sm">
                メールアドレスとパスワードを入力してください
              </p>
            </div>

            {/* ログインフォーム */}
            <div className="p-6 space-y-4">
              {/* エラーメッセージ */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              {/* メールアドレス入力 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isLoading) {
                        handleLogin();
                      }
                    }}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="example@company.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* パスワード入力 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isLoading) {
                        handleLogin();
                      }
                    }}
                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* ログイン状態を保持 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-600">ログイン状態を保持</span>
                </label>
              </div>

              {/* ログインボタン */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>ログイン中...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>ログイン</span>
                  </>
                )}
              </button>

              {/* パスワードリセットリンク */}
              <div className="text-center">
                <a
                  href="/reset-password"
                  className="text-sm text-gray-600 hover:text-orange-600 transition-colors inline-flex items-center gap-1"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>パスワードをお忘れの方</span>
                </a>
              </div>
            </div>
          </div>

          {/* 招待制の説明 */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">このシステムは招待制です</p>
                <p className="text-xs leading-relaxed">
                  新規アカウントの作成には管理者からの招待が必要です。
                  招待リンクまたはQRコードをお持ちでない方は、
                  店舗の管理者にお問い合わせください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            © 2024 ShiftMaster. All rights reserved.
          </p>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            <a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">
              利用規約
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">
              プライバシーポリシー
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">
              お問い合わせ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;