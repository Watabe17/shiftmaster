# ShiftMaster - シフト管理システム

AI支援によるシフト作成機能を持つ、シンプルで使いやすいシフト管理システムです。

## 機能

- 📅 AI支援シフト作成（Google Gemini API使用）
- 👥 従業員管理
- ⏰ 勤怠管理（位置情報対応）
- 🏪 店舗設定管理
- 📊 レポート・分析

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```bash
# Gemini API設定
# Google AI Studio (https://aistudio.google.com/) でAPIキーを取得してください
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# データベース設定
DATABASE_URL=your_database_url_here
```

### 3. Gemini APIキーの取得

1. [Google AI Studio](https://aistudio.google.com/) にアクセス
2. Googleアカウントでログイン
3. 「Get API key」をクリック
4. 新しいAPIキーを作成
5. 作成されたAPIキーをコピーして `.env.local` に設定

### 4. データベースのセットアップ

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースのマイグレーション
npx prisma db push

# シードデータの投入（オプション）
npx prisma db seed
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

## AIシフト生成機能

### 使用方法

1. 管理者としてログイン
2. 「シフト作成」メニューにアクセス
3. 対象期間とルールセットを選択
4. 従業員の希望を確認
5. 「シフトを生成」ボタンをクリック

### エラーハンドリング

Gemini APIの利用制限に達した場合：

- **レート制限エラー**: 自動的にリトライされます
- **クォータ制限エラー**: 手動生成モードが利用可能
- **APIキーエラー**: 設定を確認してください

### フォールバック機能

AI生成が利用できない場合、以下の代替手段が提供されます：

- 手動シフト生成（基本的なルールに基づく自動生成）
- 従業員の希望を考慮した基本的なシフト配置
- ポジション別必要人数の充足

## 技術スタック

- **フロントエンド**: Next.js 15, React, TypeScript
- **スタイリング**: Tailwind CSS, shadcn/ui
- **バックエンド**: Supabase, Prisma
- **AI**: Google Gemini API
- **データベース**: PostgreSQL

## トラブルシューティング

### Gemini APIエラー

```
Gemini API エラーレスポンス: "You exceeded your current quota"
```

**解決方法**:
1. Google AI Studioで利用制限を確認
2. 有料プランへの移行を検討
3. 手動生成モードを使用
4. しばらく時間をおいて再試行

### レート制限エラー

```
429: RESOURCE_EXHAUSTED
```

**解決方法**:
1. 自動リトライを待つ
2. リトライ待機時間を確認
3. 手動生成モードを使用

## Vercelデプロイ

### 1. Vercelプロジェクトの作成

1. [Vercel](https://vercel.com) にアクセスしてアカウントを作成
2. 「New Project」をクリック
3. GitHubリポジトリをインポート
4. プロジェクト名を設定（例：`shiftmaster`）

### 2. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定してください：

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# データベース設定
DATABASE_URL=your_database_url_here
```

### 3. GitHub Secretsの設定

GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」で以下を設定：

- `VERCEL_TOKEN`: VercelのAPIトークン
- `ORG_ID`: Vercelの組織ID
- `PROJECT_ID`: VercelのプロジェクトID
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー

### 4. 自動デプロイ

mainブランチにプッシュすると、GitHub Actionsが自動的にVercelにデプロイします。

## ライセンス

MIT License

## サポート

問題が発生した場合は、以下の手順で対処してください：

1. エラーログを確認
2. 環境変数の設定を確認
3. APIキーの有効性を確認
4. ネットワーク接続を確認
