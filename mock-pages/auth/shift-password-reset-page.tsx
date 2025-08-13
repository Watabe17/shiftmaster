import React, { useState } from 'react';
import {
  Calendar, Mail, KeyRound, ArrowLeft, Send,
  AlertCircle, CheckCircle, Loader2, Info,
  Lock, Eye, EyeOff, Shield
} from 'lucide-react';

const PasswordResetPage = () => {
  const [step, setStep] = useState('request'); // 'request', 'sent', 'reset', 'complete'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // URLパラメータからトークンを取得（実際のリセット時）
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const type = urlParams.get('type');
    
    // Supabaseからのリセットリンクの場合
    if (token && type === 'recovery') {
      setStep('reset');
    }
  }, []);

  // パスワード強度チェック
  React.useEffect(() => {
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (newPassword.length >= 12) strength++;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) strength++;
    if (/[0-9]/.test(newPassword)) strength++;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength++;
    setPasswordStrength(Math.min(strength, 4));
  }, [newPassword]);

  const handleRequestReset = async () => {
    setError('');
    
    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }
    
    if (!email.includes('@')) {
      setError('正しいメールアドレスを入力してください');
      return;
    }

    setIsLoading(true);

    // 実際のSupabase実装
    // const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //   redirectTo: `${window.location.origin}/reset-password`,
    // });

    // デモ: 2秒後に送信完了
    setTimeout(() => {
      setStep('sent');
      setIsLoading(false);
    }, 2000);
  };

  const handlePasswordReset = async () => {
    setError('');
    
    if (!newPassword) {
      setError('新しいパスワードを入力してください');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('パスワードは8文字以上で設定してください');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setIsLoading(true);

    // 実際のSupabase実装
    // const { error } = await supabase.auth.updateUser({
    //   password: newPassword
    // });

    // デモ: 2秒後にリセット完了
    setTimeout(() => {
      setStep('complete');
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

  // Step 1: メールアドレス入力
  if (step === 'request') {
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
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">パスワードリセット</h2>
                <p className="text-white/90 text-sm">
                  登録されているメールアドレスを入力してください
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* エラーメッセージ */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}

                {/* 説明 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">パスワードリセットの手順</p>
                      <ol className="space-y-0.5 list-decimal list-inside">
                        <li>登録済みのメールアドレスを入力</li>
                        <li>リセット用のリンクをメールで受信</li>
                        <li>メール内のリンクから新しいパスワードを設定</li>
                      </ol>
                    </div>
                  </div>
                </div>

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
                          handleRequestReset();
                        }
                      }}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="example@company.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* 送信ボタン */}
                <button
                  onClick={handleRequestReset}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>送信中...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>リセットリンクを送信</span>
                    </>
                  )}
                </button>

                {/* ログインへ戻る */}
                <a
                  href="/login"
                  className="w-full flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>ログイン画面に戻る</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Step 2: メール送信完了
  if (step === 'sent') {
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
                <Mail className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">メールを送信しました</h2>
              <p className="text-gray-600 mb-6">
                <span className="font-medium">{email}</span><br />
                宛にパスワードリセット用のリンクを送信しました
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-sm font-medium text-gray-700 mb-2">次の手順</h3>
                <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                  <li>メールの受信トレイを確認</li>
                  <li>「パスワードリセット」メールを開く</li>
                  <li>メール内のリンクをクリック</li>
                  <li>新しいパスワードを設定</li>
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-amber-800">
                  メールが届かない場合は、迷惑メールフォルダをご確認ください。
                  それでも届かない場合は、管理者にお問い合わせください。
                </p>
              </div>

              <a
                href="/login"
                className="w-full inline-block px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors font-medium"
              >
                ログイン画面へ戻る
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Step 3: 新しいパスワードの設定（メールのリンクから）
  if (step === 'reset') {
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
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">新しいパスワードの設定</h2>
                <p className="text-white/90 text-sm">
                  新しいパスワードを入力してください
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* エラーメッセージ */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}

                {/* 新しいパスワード */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    新しいパスワード
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  {newPassword && (
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
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="パスワードを再入力"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">パスワードが一致しません</p>
                  )}
                </div>

                {/* パスワード要件 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-800 mb-2">パスワードの要件:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li className={newPassword.length >= 8 ? 'text-green-700' : ''}>
                      {newPassword.length >= 8 ? '✓' : '・'} 8文字以上
                    </li>
                    <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'text-green-700' : ''}>
                      {/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? '✓' : '・'} 大文字と小文字を含む
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'text-green-700' : ''}>
                      {/[0-9]/.test(newPassword) ? '✓' : '・'} 数字を含む
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-700' : ''}>
                      {/[^A-Za-z0-9]/.test(newPassword) ? '✓' : '・'} 記号を含む（推奨）
                    </li>
                  </ul>
                </div>

                {/* 更新ボタン */}
                <button
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>更新中...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>パスワードを更新</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Step 4: リセット完了
  if (step === 'complete') {
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">パスワード更新完了</h2>
              <p className="text-gray-600 mb-6">
                パスワードが正常に更新されました。<br />
                新しいパスワードでログインしてください。
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-blue-800">
                  セキュリティのため、パスワードは定期的に変更することをお勧めします。
                </p>
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

export default PasswordResetPage;