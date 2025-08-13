import React, { useState, useEffect } from 'react';
import {
  Calendar, Lock, Mail, Eye, EyeOff, UserPlus, 
  AlertCircle, CheckCircle, Loader2, ShieldCheck,
  ArrowRight, User, Building, Hash, Clock, XCircle,
  RefreshCw, MessageSquare, KeyRound, Info
} from 'lucide-react';

const OnboardPage = () => {
  const [currentStep, setCurrentStep] = useState('loading'); // 'loading', 'valid', 'expired', 'used', 'setup', 'complete'
  const [tokenInfo, setTokenInfo] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // URLからトークンを取得して検証
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      setCurrentStep('expired');
      return;
    }

    // デモ: トークン検証
    setTimeout(() => {
      // デモ用のトークン判定
      if (token === 'expired123') {
        setCurrentStep('expired');
      } else if (token === 'used123') {
        setCurrentStep('used');
      } else {
        // 有効なトークン
        setTokenInfo({
          token: token,
          employeeName: '田中 太郎',
          employeeCode: 'E001',
          storeName: 'カフェ ShiftMaster 渋谷店',
          email: 'tanaka@example.com' // メール設定済みの場合
        });
        setEmail('tanaka@example.com');
        setCurrentStep('valid');
      }
    }, 1500);
  }, []);

  // パスワード強度チェック
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(Math.min(strength, 4));
  }, [password]);

  const handleSetup = async () => {
    setError('');
    
    // バリデーション
    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }
    
    if (!email.includes('@')) {
      setError('正しいメールアドレスを入力してください');
      return;
    }
    
    if (!password) {
      setError('パスワードを入力してください');
      return;
    }
    
    if (password.length < 8) {
      setError('パスワードは8文字以上で設定してください');
      return;
    }
    
    if (password !== passwordConfirm) {
      setError('パスワードが一致しません');
      return;
    }

    setIsLoading(true);
    
    // デモ: アカウント作成処理
    setTimeout(() => {
      setCurrentStep('complete');
      setIsLoading(false);
    }, 2000);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return '弱い';
      case 2:
        return '普通';
      case 3:
        return '強い';
      case 4:
        return 'とても強い';
      default:
        return '';
    }
  };

  // ローディング画面
  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">招待リンクを確認中...</p>
        </div>
      </div>
    );
  }

  // 期限切れ画面
  if (currentStep === 'expired') {
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
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">招待リンクの有効期限切れ</h2>
              <p className="text-gray-600 mb-6">
                この招待リンクは有効期限が切れています。<br />
                新しい招待リンクが必要な場合は、管理者にお問い合わせください。
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-medium text-gray-700 mb-2">管理者への連絡事項：</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• お名前と従業員コード</li>
                  <li>• 招待リンクの再発行依頼</li>
                  <li>• 連絡先メールアドレス</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <a
                  href="/login"
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ログイン画面へ
                </a>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  管理者に連絡
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 使用済み画面
  if (currentStep === 'used') {
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
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">この招待リンクは使用済みです</h2>
              <p className="text-gray-600 mb-6">
                すでにアカウントの作成が完了しています。<br />
                ログイン画面からサインインしてください。
              </p>
              <a
                href="/login"
                className="w-full inline-block px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors font-medium"
              >
                ログイン画面へ
              </a>
              <div className="mt-4">
                <a
                  href="/reset-password"
                  className="text-sm text-gray-600 hover:text-orange-600 transition-colors inline-flex items-center gap-1"
                >
                  <KeyRound className="w-4 h-4" />
                  パスワードをお忘れの場合
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 招待内容確認画面
  if (currentStep === 'valid') {
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
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">アカウント作成</h2>
                <p className="text-white/90 text-sm">招待を受けてアカウントを作成します</p>
              </div>

              <div className="p-6">
                {/* 招待情報 */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">招待内容</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">氏名:</span>
                      <span className="font-medium text-gray-900">{tokenInfo?.employeeName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">従業員コード:</span>
                      <span className="font-medium text-gray-900">{tokenInfo?.employeeCode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">店舗:</span>
                      <span className="font-medium text-gray-900">{tokenInfo?.storeName}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep('setup')}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                >
                  <span>アカウント作成を開始</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-4 text-center">
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
  }

  // パスワード設定画面
  if (currentStep === 'setup') {
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
                <h2 className="text-2xl font-bold text-white mb-2">初期設定</h2>
                <p className="text-white/90 text-sm">メールアドレスとパスワードを設定してください</p>
              </div>

              <div className="p-6 space-y-4">
                {/* エラーメッセージ */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}

                {/* 従業員情報（表示のみ） */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">従業員:</span>
                    <span className="font-medium text-gray-900">
                      {tokenInfo?.employeeName} ({tokenInfo?.employeeCode})
                    </span>
                  </div>
                </div>

                {/* メールアドレス */}
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
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="example@company.com"
                      disabled={tokenInfo?.email} // 既にメールが設定されている場合は編集不可
                    />
                  </div>
                  {tokenInfo?.email && (
                    <p className="mt-1 text-xs text-gray-500">
                      ※ 管理者により仮登録されています。必要に応じて変更してください。
                    </p>
                  )}
                </div>

                {/* パスワード */}
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
                      className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="8文字以上で設定"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  {/* パスワード強度表示 */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* パスワード確認 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    パスワード（確認）
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswordConfirm ? 'text' : 'password'}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="パスワードを再入力"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswordConfirm ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* パスワード要件 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-800 mb-2">パスワードの要件:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li className={password.length >= 8 ? 'text-green-700' : ''}>
                      {password.length >= 8 ? '✓' : '・'} 8文字以上
                    </li>
                    <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-green-700' : ''}>
                      {/[A-Z]/.test(password) && /[a-z]/.test(password) ? '✓' : '・'} 大文字と小文字を含む
                    </li>
                    <li className={/[0-9]/.test(password) ? 'text-green-700' : ''}>
                      {/[0-9]/.test(password) ? '✓' : '・'} 数字を含む
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-700' : ''}>
                      {/[^A-Za-z0-9]/.test(password) ? '✓' : '・'} 記号を含む（推奨）
                    </li>
                  </ul>
                </div>

                {/* 作成ボタン */}
                <button
                  onClick={handleSetup}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>作成中...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>アカウントを作成</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentStep('valid')}
                  className="w-full text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  戻る
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 完了画面
  if (currentStep === 'complete') {
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
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">アカウント作成完了！</h2>
              <p className="text-gray-600 mb-6">
                アカウントの作成が完了しました。<br />
                ログイン画面からサインインしてください。
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-sm font-medium text-gray-700 mb-2">アカウント情報</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>氏名: <span className="font-medium text-gray-900">{tokenInfo?.employeeName}</span></p>
                  <p>メール: <span className="font-medium text-gray-900">{email}</span></p>
                </div>
              </div>

              <a
                href="/login"
                className="w-full inline-block px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors font-medium"
              >
                ログイン画面へ
              </a>

              <div className="mt-4 text-xs text-gray-500">
                5秒後に自動的にログイン画面へ移動します
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default OnboardPage;