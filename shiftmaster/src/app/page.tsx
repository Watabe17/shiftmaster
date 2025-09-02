export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ShiftMaster</h1>
        <p className="text-lg text-gray-600 mb-8">AI支援シフト管理システム</p>
        <div className="space-y-4">
          <a 
            href="/auth/login" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ログイン
          </a>
          <div className="text-sm text-gray-500">
            <a href="/auth/register" className="text-blue-600 hover:underline">
              新規登録
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
