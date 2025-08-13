# 開発ガイド（Contributing）

## セットアップ
1. `npm install`
2. Supabase環境変数を設定（.env.local）
3. `npm run dev`

## コード規約
- TypeScript strict、shadcn/ui準拠、Tailwind
- 命名: DB snake_case / フロント camelCase
- Lint/Format: `npm run lint` / Prettier

## ブランチ/PR
- ブランチ: `feature/<scope>-<short>`
- PRテンプレ: 目的/変更点/動作確認/スクショ
- チェックリスト: lint OK、型OK、主要フロー手動確認

## DB/マイグレーション
- 変更は `supabase/migrations` にSQLで追加
- `supabase db push` で反映
- 型生成: `supabase gen types`

## 開発の進め方
- BACKLOGのP0から着手→ROADMAPのPhase順
- 画面ごとに API I/O と UI型を先に固定→実装
- シードデータを用意して動作確認

## よくある質問
- lucide-react解決: Vite最適化、fs.allow設定
- ポート競合: Viteが自動で次ポートへ
- 黒背景: ダーク系拡張/OS設定を確認
