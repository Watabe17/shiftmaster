import React, { useState } from 'react';
import { 
  MessageSquare, Store, QrCode, Activity, 
  ChevronRight, Menu, ChevronLeft, Bell, Settings, LogOut,
  Calendar, Users, FileText, AlertCircle, 
  Clock, Sparkles, Plus, ExternalLink,
  CheckCircle, Copy, Search, Filter, MoreVertical,
  Edit, Trash2, ChevronDown, GripVertical,
  Eye, EyeOff, Circle, CheckSquare, Type,
  Download, X, Gift, Dices, Save, ArrowLeft, XCircle,
  MapPin, Phone, Mail, Lock
} from 'lucide-react';

// ダッシュボードコンポーネント
const Dashboard = ({ currentShop }) => {
  const weeklyStats = {
    reviewsGenerated: 42,
    surveyResponses: 68
  };

  const monthlyReviews = {
    thisMonth: 42,
    lastMonth: 156,
    twoMonthsAgo: 124
  };

  const surveys = [
    { id: 1, name: 'ご来店アンケート', responses: 145, isActive: true },
    { id: 2, name: '新メニューアンケート', responses: 32, isActive: true },
    { id: 3, name: 'テイクアウトアンケート', responses: 23, isActive: false }
  ];

  const recentReviews = [
    { id: 1, createdAt: '10分前', surveyName: 'ご来店アンケート', copiedByUser: true, clickedGoogleMaps: false },
    { id: 2, createdAt: '25分前', surveyName: 'ご来店アンケート', copiedByUser: true, clickedGoogleMaps: true },
    { id: 3, createdAt: '1時間前', surveyName: '新メニューアンケート', copiedByUser: false, clickedGoogleMaps: false },
    { id: 4, createdAt: '2時間前', surveyName: 'ご来店アンケート', copiedByUser: true, clickedGoogleMaps: true },
    { id: 5, createdAt: '3時間前', surveyName: 'ご来店アンケート', copiedByUser: true, clickedGoogleMaps: false }
  ];

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">今週の状況</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">口コミ生成総数</p>
              <div className="p-1.5 bg-orange-100 rounded">
                <Sparkles className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{weeklyStats.reviewsGenerated}</p>
            <p className="text-xs text-gray-500 mt-1">過去7日間</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">アンケート回答数</p>
              <div className="p-1.5 bg-blue-100 rounded">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{weeklyStats.surveyResponses}</p>
            <p className="text-xs text-gray-500 mt-1">過去7日間</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">月別口コミ生成数推移</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-20">今月</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-orange-500 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(monthlyReviews.thisMonth / monthlyReviews.lastMonth) * 100}%` }}
                >
                  <span className="text-xs font-medium text-white">{monthlyReviews.thisMonth}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-20">先月</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-orange-400 rounded-full flex items-center justify-end pr-2" style={{ width: '100%' }}>
                  <span className="text-xs font-medium text-white">{monthlyReviews.lastMonth}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-20">先々月</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-orange-300 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(monthlyReviews.twoMonthsAgo / monthlyReviews.lastMonth) * 100}%` }}
                >
                  <span className="text-xs font-medium text-white">{monthlyReviews.twoMonthsAgo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">アンケート一覧</h2>
              <span className="text-sm text-gray-500">{surveys.length}/5</span>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {surveys.map((survey) => (
              <div key={survey.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{survey.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    survey.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {survey.isActive ? '公開中' : '非公開'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {survey.responses} 回答
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="text-orange-600 hover:text-orange-700 font-medium">
                      編集
                    </button>
                    <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                      <QrCode className="w-4 h-4" />
                      QR
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {surveys.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">アンケートがまだありません</p>
                <button className="text-orange-600 hover:text-orange-700 font-medium">
                  最初のアンケートを作成
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">最近の口コミ生成</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  コピー
                </span>
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  投稿ボタン
                </span>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{review.surveyName}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {review.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      {review.copiedByUser && (
                        <span className="text-gray-600">
                          <Copy className="w-3 h-3 inline" />
                        </span>
                      )}
                      {review.clickedGoogleMaps && (
                        <span className="text-green-600">
                          <ExternalLink className="w-3 h-3 inline" />
                        </span>
                      )}
                    </div>
                    <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                      詳細
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
              すべての履歴を見る
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all text-left group">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">アンケートを作成</p>
                <p className="text-sm text-gray-600 mt-1">新しいアンケートを追加</p>
              </div>
            </div>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all text-left group">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <QrCode className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">QRコードを管理</p>
                <p className="text-sm text-gray-600 mt-1">印刷・ダウンロード</p>
              </div>
            </div>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all text-left group">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <ExternalLink className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Googleマップを開く</p>
                <p className="text-sm text-gray-600 mt-1">口コミへの返信</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

// アンケート一覧コンポーネント
const SurveyList = ({ selectedShop }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showQRModal, setShowQRModal] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const surveys = [
    {
      id: 1,
      name: 'ご来店アンケート',
      description: 'ご来店いただいたお客様への基本アンケート',
      isActive: true,
      responses: 145,
      createdAt: '2025-01-15'
    },
    {
      id: 2,
      name: '新メニューアンケート',
      description: '季節限定メニューに関するご意見収集',
      isActive: true,
      responses: 32,
      createdAt: '2025-01-20'
    },
    {
      id: 3,
      name: 'テイクアウトアンケート',
      description: 'テイクアウトサービスの改善のためのアンケート',
      isActive: false,
      responses: 23,
      createdAt: '2025-01-10'
    }
  ];

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && survey.isActive) ||
                         (filterStatus === 'inactive' && !survey.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="アンケート名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="all">すべて</option>
              <option value="active">公開中</option>
              <option value="inactive">非公開</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">アンケート一覧</h2>
            <span className="text-sm text-gray-500">{filteredSurveys.length}/5 件</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredSurveys.map((survey) => (
            <div key={survey.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900 text-lg">{survey.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      survey.isActive 
                        ? 'bg-green-100 text-green-700 flex items-center gap-1' 
                        : 'bg-gray-100 text-gray-600 flex items-center gap-1'
                    }`}>
                      {survey.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          公開中
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          非公開
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{survey.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {survey.responses} 回答
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      作成日: {survey.createdAt}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="編集">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowQRModal(survey)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="QRコード"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="複製">
                    <Copy className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="プレビュー">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{showQRModal.name} - QRコード</h3>
                <button
                  onClick={() => {
                    setShowQRModal(null);
                    setCopiedUrl(false);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-8 mb-6 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <QrCode className="w-40 h-40 text-gray-800" />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">アンケートURL</p>
                <p className="text-sm text-gray-700 font-mono break-all">
                  {`https://kuchicom.jp/s/abc123/${selectedShop}/survey${String(showQRModal.id).padStart(3, '0')}`}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  PDFダウンロード
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://kuchicom.jp/s/abc123/${selectedShop}/survey${String(showQRModal.id).padStart(3, '0')}`);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  {copiedUrl ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      コピー済み
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      URLコピー
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 口コミ履歴コンポーネント
const ReviewHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [expandedReview, setExpandedReview] = useState(null);

  const reviews = [
    {
      id: 1,
      createdAt: '2025-01-30 14:30',
      surveyName: 'ご来店アンケート',
      responseId: 'R001',
      originalText: 'スタッフの対応が素晴らしく、料理も美味しかったです。特にコーヒーは香り高く、店内の雰囲気も落ち着いていて良かったです。',
      clickedGoogleMaps: true,
      clickedAt: '2025-01-30 14:32',
      rating: 5,
      surveyResponses: [
        { question: '本日のご来店は何回目ですか？', answer: '2-3回目' },
        { question: 'お食事の満足度はいかがでしたか？', answer: '非常に満足' },
        { question: 'スタッフの対応はいかがでしたか？', answer: '非常に良い' }
      ]
    },
    {
      id: 2,
      createdAt: '2025-01-30 13:15',
      surveyName: 'ご来店アンケート',
      responseId: 'R002',
      originalText: '初めて来店しましたが、とても満足しました。ランチメニューが豊富で選ぶのに迷いました。',
      clickedGoogleMaps: true,
      clickedAt: '2025-01-30 13:18',
      rating: 4,
      surveyResponses: [
        { question: '本日のご来店は何回目ですか？', answer: '初めて' },
        { question: 'お食事の満足度はいかがでしたか？', answer: '満足' }
      ]
    },
    {
      id: 3,
      createdAt: '2025-01-30 11:45',
      surveyName: '新メニューアンケート',
      responseId: 'R003',
      originalText: '季節限定メニューがとても美味しかったです。特に秋のきのこパスタは絶品でした。',
      clickedGoogleMaps: false,
      rating: 5,
      surveyResponses: [
        { question: '新メニューの味はいかがでしたか？', answer: '非常に美味しい' },
        { question: '価格設定についてどう思いますか？', answer: '適正' }
      ]
    }
  ];

  const stats = {
    total: reviews.length,
    clickedMaps: reviews.filter(r => r.clickedGoogleMaps).length,
    todayCount: 3,
    averageRating: 4.7
  };

  const toggleExpand = (id) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">総生成数</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Googleマップ開封</p>
          <p className="text-2xl font-bold text-orange-600">{stats.clickedMaps}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">本日の生成</p>
          <p className="text-2xl font-bold text-green-600">{stats.todayCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">平均評価</p>
          <p className="text-2xl font-bold text-gray-900">★ {stats.averageRating}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ID、アンケート名、口コミ内容で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="all">全期間</option>
              <option value="week">今週</option>
              <option value="month">今月</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">生成履歴</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-gray-600">{review.responseId}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{review.surveyName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {review.createdAt}
                      </span>
                      <span>★ {review.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {review.clickedGoogleMaps && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      <ExternalLink className="w-3 h-3" />
                      Googleマップ開封
                    </span>
                  )}
                  <button 
                    onClick={() => toggleExpand(review.id)}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                  >
                    <span>{expandedReview === review.id ? '閉じる' : '詳細'}</span>
                    <ChevronDown className={expandedReview === review.id ? 'w-4 h-4 rotate-180 transition-transform' : 'w-4 h-4 transition-transform'} />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  {review.originalText}
                </p>
              </div>
              
              {expandedReview === review.id && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      アンケート回答内容
                    </h4>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                      {review.surveyResponses && review.surveyResponses.map((response, index) => (
                        <div key={index} className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-gray-700">
                            Q{index + 1}. {response.question}
                          </p>
                          <p className="text-sm text-gray-600 pl-4">
                            → {response.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 設定コンポーネント（シンプル化）
const ShopSettings = ({ selectedShop }) => {
  const [activeTab, setActiveTab] = useState('shop');
  const [saveStatus, setSaveStatus] = useState('');
  
  // 複数店舗のデータ（シンプル化）
  const [shopsData] = useState({
    shop1: { name: 'カフェ Sunny 渋谷店', contactEmail: 'shibuya@cafe-sunny.jp' },
    shop2: { name: 'カフェ Sunny 新宿店', contactEmail: 'shinjuku@cafe-sunny.jp' },
    shop3: { name: 'カフェ Sunny 横浜店', contactEmail: 'yokohama@cafe-sunny.jp' }
  });

  const currentShopData = shopsData[selectedShop] || {};
  
  const [shopName, setShopName] = useState(currentShopData.name || '');
  const [contactEmail, setContactEmail] = useState(currentShopData.contactEmail || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailNotification, setEmailNotification] = useState(true);

  React.useEffect(() => {
    const data = shopsData[selectedShop];
    if (data) {
      setShopName(data.name);
      setContactEmail(data.contactEmail);
    }
  }, [selectedShop, shopsData]);

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  return (
    <>
      {/* タブナビゲーション */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'shop' ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'
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
              activeTab === 'account' ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            アカウント設定
            {activeTab === 'account' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        </div>
      </div>

      {/* 店舗情報タブ（シンプル化） */}
      {activeTab === 'shop' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">店舗基本情報</h2>
          <div className="space-y-6">
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
              <p className="text-xs text-gray-500 mt-1">お客様に表示される店舗名です</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                通知メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">口コミ生成通知を受け取るメールアドレス</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>ヒント：</strong>口コミの投稿先URLは、各アンケートの編集画面で個別に設定できます。
                アンケートごとに異なるプラットフォーム（Googleマップ、食べログなど）への誘導が可能です。
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
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
      )}

      {/* アカウント設定タブ（シンプル化） */}
      {activeTab === 'account' && (
        <div className="space-y-6">
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
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                パスワードを変更
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">通知設定</h2>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotification}
                  onChange={(e) => setEmailNotification(e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">口コミ生成の通知</p>
                  <p className="text-xs text-gray-500">新しい口コミが生成されたときにメールで通知を受け取る</p>
                </div>
              </label>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                設定を保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// メインアプリケーション
const KuchicomApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedShop, setSelectedShop] = useState('shop1');
  const [showNewShopModal, setShowNewShopModal] = useState(false);
  const [newShopName, setNewShopName] = useState('');

  const [shops, setShops] = useState([
    { id: 'shop1', name: 'カフェ Sunny 渋谷店' },
    { id: 'shop2', name: 'カフェ Sunny 新宿店' },
    { id: 'shop3', name: 'カフェ Sunny 横浜店' }
  ]);

  const currentShop = shops.find(s => s.id === selectedShop);

  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: Activity },
    { id: 'surveys', label: 'アンケート管理', icon: FileText },
    { id: 'reviews', label: '口コミ生成履歴', icon: MessageSquare },
    { id: 'coupons', label: 'クーポン管理', icon: Gift, isPreparing: true },
    { id: 'lottery', label: '抽選設定', icon: Dices, isPreparing: true },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  const handleShopChange = (value) => {
    if (value === 'add_new') {
      setShowNewShopModal(true);
    } else {
      setSelectedShop(value);
    }
  };

  const handleAddNewShop = () => {
    if (!newShopName.trim()) return;
    
    const newShopId = `shop${shops.length + 1}`;
    setShops([...shops, {
      id: newShopId,
      name: newShopName
    }]);
    
    setSelectedShop(newShopId);
    setShowNewShopModal(false);
    setNewShopName('');
  };

  const getPageTitle = () => {
    const menu = menuItems.find(item => item.id === activeMenu);
    return menu ? menu.label : 'ダッシュボード';
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard currentShop={currentShop} />;
      case 'surveys':
        return <SurveyList selectedShop={selectedShop} />;
      case 'reviews':
        return <ReviewHistory />;
      case 'settings':
        return <ShopSettings selectedShop={selectedShop} />;
      default:
        return <Dashboard currentShop={currentShop} />;
    }
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

          {sidebarOpen && shops.length >= 1 && (
            <select
              value={selectedShop}
              onChange={(e) => handleShopChange(e.target.value)}
              className="mt-4 w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            >
              {shops.map(shop => (
                <option key={shop.id} value={shop.id}>{shop.name}</option>
              ))}
              {shops.length < 5 && (
                <option value="add_new" className="font-medium text-orange-600">
                  + 新規店舗を追加
                </option>
              )}
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
                <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  {currentShop?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {activeMenu === 'surveys' && (
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    新規アンケート作成
                  </button>
                )}
                {activeMenu === 'reviews' && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    CSVダウンロード
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      {/* 新規店舗追加モーダル（シンプル化） */}
      {showNewShopModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">新規店舗を追加</h3>
                <span className="text-sm text-gray-500">{shops.length}/5 店舗</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    店舗名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newShopName}
                    onChange={(e) => setNewShopName(e.target.value)}
                    placeholder="例：カフェ Sunny 銀座店"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    autoFocus
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    店舗を追加後、設定画面で通知用メールアドレスを設定してください。
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowNewShopModal(false);
                    setNewShopName('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAddNewShop}
                  disabled={!newShopName.trim()}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  追加する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KuchicomApp;