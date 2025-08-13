import React, { useState } from 'react';
import { MessageSquare, ArrowRight, ArrowLeft, Check, Building, User, Eye, EyeOff, HelpCircle, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleMapHelp, setShowGoogleMapHelp] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    companyName: '',
    phoneNumber: '',
    termsAccepted: false,
    marketingAccepted: false
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: 'アカウント情報' },
    { number: 2, title: '基本情報' },
    { number: 3, title: '利用規約' }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.email) {
          newErrors.email = 'メールアドレスを入力してください';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = '正しいメールアドレスを入力してください';
        }
        
        if (!formData.password) {
          newErrors.password = 'パスワードを入力してください';
        } else if (formData.password.length < 8) {
          newErrors.password = 'パスワードは8文字以上で入力してください';
        }
        
        if (formData.password !== formData.passwordConfirm) {
          newErrors.passwordConfirm = 'パスワードが一致しません';
        }
        break;
        
      case 2:
        if (!formData.name) {
          newErrors.name = 'お名前を入力してください';
        }
        break;
        
      case 3:
        if (!formData.termsAccepted) {
          newErrors.termsAccepted = '利用規約に同意してください';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // 登録処理
        console.log('Register:', formData);
        alert('登録が完了しました！ログインページへ移動します。');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* ロゴとタイトル */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4">
            <MessageSquare className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">口com</h1>
          <p className="text-gray-600 mt-2">新規アカウント作成</p>
        </div>

        {/* スタイリッシュなプログレスバー */}
        <div className="mb-16">
          <div className="relative max-w-md mx-auto">
            {/* 背景ライン */}
            <div className="absolute top-5 left-5 right-5 h-[2px] bg-gray-200/50"></div>
            
            {/* アクティブライン */}
            <div className="absolute top-5 left-5 h-[2px] overflow-hidden" style={{ width: 'calc(100% - 40px)' }}>
              <div 
                className="h-full bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 transition-all duration-700 ease-out relative"
                style={{ 
                  width: `${progressWidth}%`,
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* シマーエフェクト */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            
            {/* ステップ */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center">
                  <div className="relative">
                    {/* パルスリング */}
                    {currentStep === step.number && (
                      <>
                        <div className="absolute -inset-4 bg-gray-900/10 rounded-full animate-ping" />
                        <div className="absolute -inset-3 bg-gray-900/5 rounded-full animate-pulse" />
                      </>
                    )}
                    
                    {/* ステップサークル */}
                    <div
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 ${
                        currentStep === step.number
                          ? 'bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg scale-125 ring-4 ring-gray-900/20'
                          : currentStep > step.number
                          ? 'bg-gray-800 text-white shadow-md'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-4 h-4" strokeWidth={3} />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>
                    
                    {/* アクティブインジケーター */}
                    {currentStep === step.number && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rounded-full animate-bounce" />
                    )}
                  </div>
                  
                  {/* ステップタイトル */}
                  <p className={`text-[11px] mt-3 font-semibold tracking-wider transition-all duration-300 whitespace-nowrap ${
                    currentStep === step.number 
                      ? 'text-gray-900 scale-110'
                      : currentStep > step.number
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* フォームコンテンツ */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: アカウント情報 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">アカウント情報</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${
                      errors.password ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="8文字以上"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  パスワード（確認）
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.passwordConfirm}
                  onChange={(e) => updateFormData('passwordConfirm', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${
                    errors.passwordConfirm ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="パスワードを再入力"
                />
                {errors.passwordConfirm && (
                  <p className="mt-2 text-sm text-red-600">{errors.passwordConfirm}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: 基本情報 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">基本情報</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="山田 太郎"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  会社名 <span className="text-gray-400 text-xs font-normal">（任意）</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="株式会社サンプル"
                />
                <p className="mt-1 text-xs text-gray-500">法人の場合はご入力ください</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  電話番号 <span className="text-gray-400 text-xs font-normal">（任意）</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="090-1234-5678"
                />
                <p className="mt-1 text-xs text-gray-500">重要なお知らせをSMSでお送りする場合があります</p>
              </div>
            </div>
          )}

          {/* Step 3: 利用規約 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">利用規約への同意</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 max-h-64 overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-3">口com 利用規約</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>第1条（本規約の適用）</p>
                  <p className="pl-4">本規約は、お客様が「口com」（以下「本サービス」）をご利用いただく際の条件を定めるものです。</p>
                  <p>第2条（利用登録）</p>
                  <p className="pl-4">本サービスの利用を希望する方は、本規約に同意の上、当社の定める方法によって利用登録を申請し...</p>
                  <p>第3条（アカウント管理）</p>
                  <p className="pl-4">お客様は、自己の責任において、本サービスのアカウントを適切に管理するものとします...</p>
                  <p className="text-xs text-gray-500 pt-4">※これはサンプルテキストです。実際の利用規約は別途ご確認ください。</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                    className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">
                    <a href="#" className="text-orange-600 hover:text-orange-700 font-medium underline">
                      利用規約
                    </a>
                    および
                    <a href="#" className="text-orange-600 hover:text-orange-700 font-medium underline ml-1">
                      プライバシーポリシー
                    </a>
                    に同意します <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="text-sm text-red-600">{errors.termsAccepted}</p>
                )}

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.marketingAccepted}
                    onChange={(e) => updateFormData('marketingAccepted', e.target.checked)}
                    className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">
                    口comからのお知らせ・キャンペーン情報を受け取る
                    <span className="text-gray-400 text-xs block mt-1">
                      （いつでも配信停止できます）
                    </span>
                  </span>
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 mb-1">登録完了後について</p>
                    <p className="text-blue-700">
                      アカウント登録完了後、ログインして店舗情報を設定していただきます。
                      1アカウントで最大5店舗まで管理可能です。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ナビゲーションボタン */}
          <div className="flex items-center justify-between mt-8">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                戻る
              </button>
            ) : (
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                ログインはこちら
              </button>
            )}

            <button
              onClick={handleNext}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all flex items-center gap-2"
            >
              {currentStep === 3 ? '登録する' : '次へ'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;