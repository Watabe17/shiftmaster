import React, { useState } from 'react';
import { 
  MessageSquare, Eye, EyeOff, AlertCircle, ArrowRight
} from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setErrors({ email: '', password: '', general: '' });

    // バリデーション
    let hasError = false;
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'メールアドレスを入力してください' }));
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: '正しいメールアドレスを入力してください' }));
      hasError = true;
    }

    if (!password) {
      setErrors(prev => ({ ...prev, password: 'パスワードを入力してください' }));
      hasError = true;
    }

    if (hasError) return;

    // ログイン処理（実際はAPIコール）
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // エラーサンプル
      // setErrors({ general: 'メールアドレスまたはパスワードが正しくありません' });
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左側 - ブランディングエリア */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-orange-500/30">
            <MessageSquare className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">口コミ365</h1>
          <p className="text-xl text-gray-400 text-center max-w-md">
            効率的な口コミ収集で、あなたのビジネスを加速させる
          </p>
        </div>
        {/* 装飾的な要素 */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-orange-500/10 to-transparent"></div>
      </div>

      {/* 右側 - ログインフォーム */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* モバイル用ロゴ */}
          <div className="lg:hidden text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4">
              <MessageSquare className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">口コミ365</h1>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">ログイン</h2>
              <p className="mt-2 text-gray-600">アカウントにアクセス</p>
            </div>

            {/* エラーメッセージ */}
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full px-0 py-3 bg-transparent border-0 border-b-2 focus:outline-none focus:border-orange-500 transition-colors text-lg ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* パスワード */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full px-0 py-3 pr-10 bg-transparent border-0 border-b-2 focus:outline-none focus:border-orange-500 transition-colors text-lg ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* パスワードリセット */}
              <div className="flex justify-end">
                <button className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  パスワードをお忘れですか？
                </button>
              </div>

              {/* ログインボタン */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    処理中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    ログイン
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>

              {/* 新規登録リンク */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600">
                  アカウントをお持ちでない方は
                  <button className="ml-1 font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                    新規登録
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;