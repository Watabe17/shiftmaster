# 開発環境セットアップ（ENVと依存サービス）

このプロジェクトを動かすために必要な事前準備と環境変数をまとめました。初心者でも手順通りに進めれば起動できます。

## 前提バージョン
- Node.js: 18.x or 20.x（LTS推奨）
- npm: 9+（同梱推奨）
- Supabase CLI: 最新（任意）

## 必須サービスと取得情報
- Supabase プロジェクト
  - NEXT_PUBLIC_SUPABASE_URL（API URL）
  - NEXT_PUBLIC_SUPABASE_ANON_KEY（Anon Key）
  - SUPABASE_SERVICE_ROLE_KEY（Service Role Key）
- Stripe（Phase 2〜）
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - STRIPE_SECRET_KEY
  - STRIPE_PRICE_ID（Checkout用のPrice ID）
  - STRIPE_WEBHOOK_SECRET（Webhook検証用）
- Gemini API（AI生成を使う場合）
  - GEMINI_API_KEY
- Google Maps（任意・Phase 2〜）
  - NEXT_PUBLIC_MAPS_API_KEY（地図ピン調整を入れる場合）

## .env の作成
1. ルート直下に`.env.local`を作成
2. `./.env.example`をコピーして値を入れる

```bash
cp .env.example .env.local
```

## 環境変数一覧（.env.example を参照）
- NEXT_PUBLIC_SUPABASE_URL: SupabaseのURL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: 公開キー
- SUPABASE_SERVICE_ROLE_KEY: サーバ側で利用するサービスロール（ローカル検証用）
- NEXT_PUBLIC_DEFAULT_CLOCK_RADIUS: 打刻半径（m）。例: 50
- GEMINI_API_KEY: AI自動生成で使用
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY / STRIPE_SECRET_KEY: Stripeキー
- STRIPE_PRICE_ID: 決済で利用するPrice ID
- STRIPE_WEBHOOK_SECRET: Webhook検証用
- NEXT_PUBLIC_APP_URL: フロントエンドURL（例: http://localhost:3000）
- INVITE_LINK_TTL_HOURS: 招待リンクの既定有効時間（例: 72）
- NEXT_PUBLIC_MAPS_API_KEY: （任意）地図機能を使う場合

## Supabase（オプション：ローカル）
- CLIインストール: `npm i -g supabase`
- 初期化: `supabase init`
- DB反映: `supabase db push`
- 起動: `supabase start`

## Stripe 設定のヒント（Phase 2〜）
- Price作成後、`STRIPE_PRICE_ID`へ設定
- Webhook受信先: `/api/webhooks/stripe`
- ローカル: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## 起動
- Next.jsアプリ: `npm run dev`（デフォルト http://localhost:3000）
- Viteデモ（demo/配下）: `cd demo && npm i && npm run dev`（ポートは5173以降）

## よくある躓き
- lucide-react解決（Viteデモ）: `demo/vite.config.ts`の`optimizeDeps.include`と`server.fs.allow`を確認
- 位置情報が無効: HTTPS/ブラウザ設定を確認。簡易モードで打刻可
- ダークモードで配色崩れ: ブラウザ拡張やOSの強制ダーク設定を無効化

---

## 取得手順（マニュアル）

### Supabase のキー取得
1. Supabaseダッシュボードで対象プロジェクトを開く
2. 左メニュー `Project Settings` → `API`
3. `Project URL` → `NEXT_PUBLIC_SUPABASE_URL` に設定
4. `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` に設定
5. `service_role` → `SUPABASE_SERVICE_ROLE_KEY` に設定（サーバ/ローカル検証用。フロントに露出させない）
6. 必要に応じて `Authentication` → `SMTP` でメール送信設定（招待/リセットをメール運用する場合）

注意: Service Role Key は漏えい厳禁。ローカル/サーバ側のみで利用。

### Stripe のキー/Price/Webhook
1. Stripeダッシュボード `開発者` → `APIキー`
   - `公開可能キー` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `シークレットキー` → `STRIPE_SECRET_KEY`
2. `商品` → `商品を追加` → `価格` を作成し、`Price ID` を `STRIPE_PRICE_ID` に設定
3. Webhook（ローカル）
   - Stripe CLI をインストールし、`stripe login`
   - `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`
   - コンソールに表示される `Signing secret` を `STRIPE_WEBHOOK_SECRET` に設定
4. Webhook（本番）
   - `開発者` → `Webhook` → `エンドポイントを追加`
   - イベント: `checkout.session.completed`, `customer.subscription.updated`
   - 表示される `署名シークレット` を `STRIPE_WEBHOOK_SECRET` に設定

### Gemini API キー（AI生成）
1. `https://ai.google.dev/` → `Get API key`
2. プロジェクトを作成し API キーを発行 → `GEMINI_API_KEY` に設定

### Google Maps API キー（任意/地図ピン調整）
1. Google Cloud Console → `APIs & Services` → `Credentials`
2. `Create credentials` → `API key` で発行 → `NEXT_PUBLIC_MAPS_API_KEY` に設定
3. 有効化が必要なAPI（利用時）: Maps JavaScript API / Places API / Geocoding API
4. `API restrictions`/`Application restrictions` で参照元を制限（セキュリティ推奨）

### Vercel での環境変数設定
1. Vercelの対象プロジェクト → `Settings` → `Environment Variables`
2. `.env.example` と同名のキーを `Production/Preview/Development` に追加
3. デプロイ後、`Redeploy` で反映

### .env.local の配置（ローカル）
1. ルートで `.env.example` をコピー
   ```bash
   cp .env.example .env.local
   ```
2. 上記手順で取得した値を `.env.local` に記入

補足: HTTPSでの位置情報を本番相当で確認したい場合は、`mkcert` 等でローカル証明書を作成し、ローカルHTTPS環境を用意してください（任意）。
