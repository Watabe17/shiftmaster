# Vercelデプロイ手順

## 前提条件
- Vercelアカウントが必要です
- GitHubリポジトリにコードがプッシュされている必要があります

## デプロイ手順

### 1. Vercel CLIのインストール
```bash
npm i -g vercel
```

### 2. Vercelにログイン
```bash
vercel login
```

### 3. プロジェクトディレクトリに移動
```bash
cd shiftmaster
```

### 4. 初回デプロイ
```bash
vercel
```

### 5. 環境変数の設定
VercelダッシュボードまたはCLIで以下の環境変数を設定してください：

#### 必須環境変数
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー
- `NEXT_PUBLIC_GEMINI_API_KEY`: Google Gemini APIキー（AI機能用）

#### 環境変数の設定方法（CLI）
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_GEMINI_API_KEY
```

### 6. 再デプロイ
環境変数設定後、再デプロイを実行：
```bash
vercel --prod
```

## 注意事項

1. **Prisma**: データベーススキーマが変更された場合は、VercelダッシュボードでPrismaのマイグレーションを実行してください。

2. **環境変数**: 本番環境では必ず環境変数を設定してください。

3. **ドメイン**: カスタムドメインを使用する場合は、Vercelダッシュボードで設定してください。

## トラブルシューティング

### ビルドエラーが発生する場合
- `vercel logs` でログを確認
- 環境変数が正しく設定されているか確認
- Prismaクライアントが正しく生成されているか確認

### CSSが適用されない場合
- Tailwind CSSの設定を確認
- ビルド時にCSSが正しく生成されているか確認

## 本番環境での確認事項

1. ログインページが正常に表示される
2. 認証機能が動作する
3. データベース接続が正常
4. AI機能（Gemini API）が動作する
5. レスポンシブデザインが適用される
