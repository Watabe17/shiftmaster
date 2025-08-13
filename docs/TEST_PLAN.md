# テスト計画（MVP優先）

## スコープ
- 画面: 認証/オンボード、出退勤、提出/確認、従業員管理、店舗設定、勤怠管理
- API: shift-requests, clock in/out, employees, shop-settings, invitations, attendance

## 戦略
- 単体: 型/バリデーション（zod）、関数単位
- 結合: API↔DB↔RLSの主要フロー
- E2E: Playwrightで主要シナリオ（MVP）

## 主要シナリオ（受け入れ基準）
- 認証/招待
  - /onboard?token=valid → アカウント作成→ /loginへ
  - expired/used → 適切メッセージ
  - ログイン失敗/成功
- 出退勤
  - simple/login切替、半径内のみ打刻可、退勤時の休憩モーダル
  - 完了後5秒で選択画面へ（simple）
- シフト提出/確認
  - ok/ng入力、ok時の時間入力、提出後のバッジ
  - 上限超過時の警告
- 従業員管理
  - 作成/編集、authStatus表示、招待リンク生成/失効
- 店舗設定
  - 保存/未保存警告、座標コピペ、現在地テスト
- 勤怠管理
  - 日次/月次表示、編集モーダル、CSV出力

## 非機能
- パフォーマンス: API応答<2s、ページ表示<3s
- セキュリティ: HTTPS必須、RLS実効性

## テストデータ
- シード: 従業員5、ポジション3、提出データ当月分、店舗設定既定

## E2E実行
- `npm run test:e2e`（Playwright）
- CI: mainへPR時に実行（後続）
