# シフト管理システム要件定義書

**文書バージョン**: 1.1  
**作成日**: 2024年  
**更新日**: 2024年  
**プロジェクト名**: シフト管理システム

---

## 1. プロジェクト概要

### 1.1 目的
位置情報を活用した出退勤管理と、AI支援によるシフト作成機能を持つ、シンプルで使いやすいシフト管理システムの開発。

### 1.2 背景
- 紙やExcelでのシフト管理からの脱却
- 不正打刻の防止（位置情報による制限）
- シフト作成業務の効率化

### 1.3 スコープ
- **対象業務**: 出退勤管理、シフト作成・管理
- **対象ユーザー**: 単一店舗の従業員および管理者
- **対象外**: 給与計算、経理処理、多店舗管理

### 1.4 用語定義
| 用語 | 定義 |
|------|------|
| 打刻 | 出勤・退勤時刻を記録すること |
| シフト希望 | 従業員が提出する勤務可能日時 |
| 確定シフト | 管理者が作成した正式な勤務予定 |
| ポジション | 従業員の役割（調理、ホール等） |

---

## 2. システム構成

### 2.1 技術スタック

| 項目 | 技術 | 選定理由 |
|------|------|----------|
| **フロントエンド** | Next.js 14 (App Router) | Vercelとの親和性、SEO対応、開発効率 |
| **スタイリング** | Tailwind CSS + shadcn/ui | 開発速度、カスタマイズ性 |
| **バックエンド** | Supabase | 認証・DB・APIを統合提供、開発工数削減 |
| **データベース** | PostgreSQL (Supabase) | RLS対応、リアルタイム機能 |
| **認証** | Supabase Auth | DBと統合、実装が簡単 |
| **AI** | Google Gemini API | コスト効率、日本語対応良好 |
| **ホスティング** | Vercel | Next.jsとの相性、自動デプロイ |
| **位置情報** | Geolocation API | ブラウザ標準API |

### 2.2 システム構成図

```
┌─────────────────────────────────────────┐
│           クライアント (Browser)          │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │     Next.js (Vercel)             │  │
│  │  ・React Components              │  │
│  │  ・Tailwind CSS + shadcn/ui     │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↓↑
        HTTPS (Supabase Client Library)
                    ↓↑
┌─────────────────────────────────────────┐
│          Supabase Cloud                 │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │    Supabase Auth                 │  │
│  │    認証・セッション管理            │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │    PostgreSQL + RLS              │  │
│  │    データ永続化・アクセス制御      │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │    Edge Functions                │  │
│  │    Gemini API連携                │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↓↑
            Google Gemini API
```

### 2.3 ディレクトリ構造

```
shift-management/
├── app/                      # Next.js App Router
│   ├── (auth)/               # 認証関連ページ
│   │   ├── login/
│   │   └── reset-password/
│   ├── (employee)/           # 従業員用ページ
│   │   ├── attendance/       # 出退勤
│   │   └── shift/           # シフト提出・確認
│   ├── (admin)/             # 管理者用ページ
│   │   ├── home/
│   │   ├── shift-create/
│   │   ├── employees/
│   │   ├── attendance-manage/
│   │   └── settings/
│   └── layout.tsx
├── components/               # 共通コンポーネント
│   ├── ui/                  # shadcn/ui
│   └── features/            # 機能別コンポーネント
├── lib/                     # ユーティリティ
│   ├── supabase/           # Supabase設定
│   ├── gemini/             # Gemini API
│   └── utils/
├── types/                   # TypeScript型定義
└── supabase/               # Supabase設定
    ├── migrations/         # DBマイグレーション
    └── functions/          # Edge Functions
```

---

## 3. 機能要件

### 3.1 認証機能

#### 3.1.1 ログイン
- **入力項目**: メールアドレス、パスワード
- **処理**: Supabase Authで認証
- **成功時**: 権限に応じたホーム画面へ遷移
- **失敗時**: エラーメッセージ表示

#### 3.1.2 パスワードリセット
- **処理**: メールアドレス入力→リセットメール送信
- **実装**: Supabase Authの標準機能を使用

#### 3.1.3 サインアップ/招待ポリシー（更新）
- 方針: 一般サインアップは無効。管理者が発行する「招待リンク/QR」でオンボーディング（メール不要）
- 招待リンク/QRの動作:
  - 管理画面から従業員ごとに有効期限付きリンクを生成（例: 24h/72h/7d）。同リンクをQRとして表示/配布可能
  - 従業員はリンク/QRから初回アクセスし、パスワード設定→ログイン
  - リンク失効・再発行が可能（既存は無効化）
- 任意（メールを使う場合のみ）:
  - 招待メール送信、パスワードリセットメール送信をオプションで提供

（補足）ログイン画面の招待制明記:
- `/login` 画面に「このシステムは招待制です」の説明を表示。オンボードへのCTAは設置しない（リンク/QR経由のみ）

初回案内の分岐（メールの有無で決定）:
- メールあり:
  - 自動送付（推奨オプション）: 従業員登録時に「保存時に招待メールを送る」をON→保存直後に招待メール送信
  - 手動送付: 登録後、従業員行のメニューまたは編集モーダルから「招待メール送信」を実行
- メールなし:
  - 招待リンク/QRを生成して配布（印刷/チャット共有等）。有効期限切れは失効→再発行

#### 3.1.4 ログイン/オンボード（新設）
- ログイン（/login）
  - 入力: email, password
  - 下部導線: 「パスワードをお忘れの方 → /reset-password」
  - 画面内に招待制の明示: 「このシステムは招待制です。新規登録は管理者の招待が必要です」
  - 失敗メッセージ例:
    - 未招待/無効化: 「このアカウントは未招待/無効です。管理者にご確認ください」
    - 誤パスワード: 「メールアドレスまたはパスワードが正しくありません」
- オンボード（/onboard）
  - アクセス: 招待リンク（`/onboard?token=...`）経由のみ想定。トークン未指定時は期限切れ扱い
  - Step1: トークン検証（状態: 有効/期限切れ/使用済み）
    - 有効: 招待内容表示→初期設定へ
    - 期限切れ: 再発行依頼の案内を表示
    - 使用済み: ログイン導線を表示
  - 招待内容表示: 表示項目は「氏名 / 従業員コード / 店舗名」に限定（権限・有効期限は非表示）
  - Step2: 初期設定
    - メールが既に紐付いている場合でも、初期値表示の上で編集を許可（管理者の仮登録メールの上書きを許容）
    - パスワードは強度表示（弱い/普通/強い/とても強い）
  - 完了: 5秒後に `/login` へリダイレクト（現モック準拠）。将来は自動サインイン→ロールに応じた遷移も選択可
  - セキュリティ: トークンは一度のみ使用可。HTTPS必須。有効期限チェック必須

注記（参照モック）: `shift-login-page.tsx`, `shift-onboard-page.tsx`, `shift-password-reset-page.tsx`

### 3.2 従業員機能

#### 3.2.1 出退勤登録

注記: 本節は `shiht-employee-attendance.tsx` のモックUIに準拠。

##### 機能詳細
```typescript
interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string;           // YYYY-MM-DD
  clock_in: string;       // HH:MM:SS
  clock_out?: string;     // HH:MM:SS
  break_minutes?: number; // 休憩時間（分）
  clock_in_location: {
    latitude: number;
    longitude: number;
  };
  clock_out_location?: {
    latitude: number;
    longitude: number;
  };
}
```

##### 処理フロー
1. 位置情報取得
2. 店舗からの距離計算（Haversine formula）
3. 50m以内の場合のみボタン有効化
4. 出勤/退勤時刻をDBに記録
5. 退勤時は休憩時間入力モーダル表示

##### UI仕様（従業員側）
- 画面: `/attendance`
- ステータス表示: 未出勤/出勤中/退勤済
- ボタン制御:
  - 出勤ボタン: 位置情報が許可され半径内で有効化
  - 退勤ボタン: 出勤中のみ有効化。押下で休憩分入力（既定60分。0以上, 15分刻み）
- エラー表示:
  - 位置情報未許可/圏外/ブラウザ未対応の明示
- 打刻履歴: 当日および直近の履歴を一覧表示（出退勤と休憩分）
- 位置情報の取り扱い: 打刻時のみ取得。保存後は参照のみ

（追加）モード切替:
- loginモード: 従来どおりログイン前提（従業員ごとに本人打刻）
- simpleモード: ログイン不要の簡易モード（共用端末想定）
  - 従業員選択: プルダウン選択 or 従業員コード入力（社員番号）
  - 出勤/退勤完了後、自動で従業員選択画面へ戻す（5秒後）
  - 初期は画面上でモード切替UIを提供（本番は設定で固定予定）

（追加）ヘッダー時計:
- 画面上部に大型時計を常時表示（等幅フォント、年月日・曜日・時刻［秒］）
- 背景を薄いグレーで視認性を強調

（追加）完了画面:
- 出勤時: 緑系のトーンで「本日もよろしくお願いいたします！」を大きく表示
- 退勤時: 青系のトーンで「お疲れ様でした！」を大きく表示
- 5秒後に従業員選択画面へ自動リセット（simpleモード時）

（更新）休憩入力:
- 退勤ボタン押下時にモーダル表示
- クイック選択: なし/30分/45分/60分（デフォルト60分）
- カスタム入力: 15分単位で入力可能

#### 3.2.2 シフト希望提出（実装モック準拠）

データ構造（UI入力）:
```typescript
interface ShiftRequestUI {
  date: string;                     // YYYY-MM-DD
  availability: 'ok' | 'ng';        // 勤務可/不可（maybeは廃止）
  start?: string;                   // HH:MM（availability='ok' のとき任意）
  end?: string;                     // HH:MM（availability='ok' のとき任意）
  note?: string;
}
```

画面/ルート: `/shift`

月選択/ナビゲーション:
- 月を前後に切替（左右ボタン）。モバイルはヘッダー下に月表示のみ
- 進捗バー: 当月の提出率%を表示（モバイルで強調）

ビュー切替:
- タブ: カレンダー / リスト

カレンダー操作（PC）:
- クリック: 日付選択→一括編集パネル（サイドパネル）
- Shift+クリック: 任意日付を複数選択
- ドラッグ: 範囲選択（開始日→終了日）

カレンダー操作（モバイル）:
- タップで選択、スワイプで範囲選択
- 一括編集パネルはボトムシートで表示

一括編集パネル（共通）:
- クイック設定: 早番/日勤/遅番/終日可（時間セット）
- 勤務可否: ok / ng（ngのとき時間入力非表示）
- 希望時間: start/end（15分刻み推奨）
- 備考: 任意
- 適用/選択日の削除

保存/提出:
- 下書き保存: 即時保存のUIフィードバック（saving→saved）
- 提出: 提出すると当月は「提出済み」バッジ表示、提出ボタンは無効化
- 締切: 画面に締切日を明示（例: 前月25日）。締切後の編集は不可（管理者再開）

モバイル固定ボトムナビ:
- シフト提出/確定シフト/出退勤/提出ボタン（提出済み時は無効）

バリデーション:
- `start < end`（availability='ok' かつ時間入力時）
- 1日1レコード（UNIQUE(user_id, date））
- `maxOffRequests` 連携: 店舗設定の `defaultMaxOffRequests` または従業員個別の `maxOffRequests` を上限とし、当月の `ng` 件数が上限超過する編集/提出は警告（将来のサーバ側検証含む）

#### 3.2.3 確定シフト（実装モック準拠）

画面/ルート: `/confirmed`

ビュー切替:
- タブ: カレンダー / リスト（将来: 週表示 week を追加可）

カレンダー:
- 今月の日付グリッド。確定シフトがある日はカード表示（開始/終了）、当日はリング強調
- クリック/タップで詳細モーダルを表示

詳細モーダル（モバイル最適化）:
- 項目: 日付（曜日）/ 勤務時間（合計時間）/ シフト区分（早番/日勤/遅番）
- モバイル: 全幅ボトムシート、PC: 中央カード

リスト:
- 当月の確定シフトを日付順に一覧（勤務時間と区分アイコン）
- 行クリックで詳細モーダル

操作:
- 印刷/ダウンロード（PCヘッダーのアクション）

その他:
- 管理者変更は自動反映。未確定日は「休み」表示（将来はドラフト状態の表示検討）

### 3.3 管理者機能（更新）

#### 3.3.0 管理者ホーム（新設｜モックUIに準拠）

概要: 管理者のためのダッシュボード。現在の提出状況やクイックアクション、最近の更新を俯瞰し、主要画面へ遷移する。

ヘッダー:
- 画面タイトル: 「管理者ホーム」
- 店舗表示: 店舗名を表示（Phase 1 は単一店舗固定。店舗切替UIは表示しない。将来の複数店舗対応時にセレクタを追加）
- 主要CTA: 「今月のシフトを作成」→ `/admin/shift-create`

今週の状況（カード3枚）:
- 指標定義（直近7日）
  - 提出件数: `submittedRequests`（シフト希望の提出件数）
  - 未提出者: `pendingRequests`（提出していない従業員数）
  - 勤怠修正申請: `attendanceCorrections`（承認待ち件数）
- カードはトーン別（orange/blue/green）で背景とアクセント色を変更

シフト希望 提出状況:
- 進捗バー: `submissionRate = submittedCount / totalEmployees * 100` を%表示
- 従業員行リスト（提出済み/未提出のバッジ表示、最終更新時刻の表示）

```typescript
interface SubmissionStatus {
  user_id: string;      // UIでは userId
  user_name: string;    // UIでは userName
  submitted: boolean;
  last_updated?: string; // YYYY-MM-DD HH:mm (任意)
}
```

クイックアクション:
- 代表的な遷移先をカードで提示

```typescript
interface QuickAction {
  id: 'shift-create' | 'employees' | 'attendance';
  label: string;         // ボタン表示名
  description: string;   // 補足説明
  color: 'orange' | 'blue' | 'green';
  route: string;         // 遷移先
}
// 例: shift-create → /admin/shift-create, employees → /admin/employees, attendance → /admin/attendance
```

最近の更新:
- 直近の重要イベント（例: 仮シフト保存、希望提出、勤怠修正申請）を時系列で表示

```typescript
type ActivityType = 'shift' | 'request' | 'attendance';
interface RecentActivity {
  id: string;
  type: ActivityType;
  text: string; // 例: "2月の仮シフトを保存しました"
  time: string; // 例: "10分前"
}
```

運用メモ:
- お知らせ/ヒントの固定ボックス（初期は静的テキスト。将来は通知機能に統合）

ナビゲーション/ルーティング:
- 本画面のパス: `/admin/home`
- 主な遷移: クイックアクション/CTAより各機能へ

注記（単一店舗前提）:
- Phase 1 は単一店舗運用のため、管理者画面群では店舗セレクタは非表示（固定店舗を前提）。将来の多店舗対応時に復活。

#### 3.3.1 シフトルール設定（新設｜モックUIに準拠）

概要: シフト作成の前提となる複数のルールセットを管理。各ルールセットは「勤務パターン」「時間帯別必要人数」「カスタムルール」から構成される。画面はタブ切替（勤務パターン/必要人数設定/カスタムルール）。ヘッダー右上に保存ボタンを配置し、保存中/保存済みのステータス表示を行う。左上にはシフト作成への戻り導線（/shift-create）。

ルールセット管理:

```typescript
// DB層（snake_case）
interface RuleSetRecord {
  id: string;
  name: string;
  description?: string;
  color: 'blue' | 'orange' | 'green' | 'purple' | 'red';
  is_default: boolean;
  created_at: string;
  updated_at: string; // UIの表示は last_modified に相当
}

// UI層（camelCase）
interface RuleSet {
  id: string;
  name: string;
  description: string;
  color: 'blue' | 'orange' | 'green' | 'purple' | 'red';
  isDefault: boolean;
  createdAt: string;
  lastModified: string;
}
```

機能詳細:
- 新規作成: 名前/説明/カラーを入力し作成。現行モックでは「通常期」の標準設定を初期値として複製して作成。
- 編集: 一覧カード上で名前・説明のインライン編集→保存で `lastModified` を当日で更新。
- 削除: デフォルトのルールセットは削除不可。その他は削除可能。
- 複製: 一覧ヘッダー「このルールセットを複製」からモーダルを開き、新規作成として作成（現行モックでは選択中に依らず「通常期」をひな型にコピー）。

勤務パターン（任意）:

```typescript
// DB
interface ShiftPatternRecord {
  id: string;
  rule_set_id: string;
  name: string;
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  color?: string;     // UI表示色（例: 'yellow' | 'blue' | 'purple' | 'gray'）
  display_order?: number;
  created_at: string;
}

// UI
interface ShiftPattern {
  id: string;
  name: string;
  start: string; // UIでは start
  end: string;   // UIでは end
  color: string; // 'yellow' | 'blue' | 'purple' | 'gray' など
}
```

- 有効/無効の切替が可能（チェックボックス）。
- パターンの追加/削除、名称・時間・色の編集に対応。

時間帯別必要人数:

```typescript
interface StaffRequirementRow {
  time: string; // HH:MM
  count: { [position_id: string]: number };
}

interface Requirements {
  weekday: StaffRequirementRow[];
  weekend: StaffRequirementRow[];
}
```

- 平日/週末・祝日の別で、時間帯×ポジションの必要人数を設定。
- 初期モックではポジションは `kitchen | hall | cashier` の固定キー。将来は `positions` テーブルを参照（任意名称/色）。
- 画面は「全ポジション」タブでは各ポジション分の入力を横並びで表示。「個別ポジション」では対象ポジションのみの入力を表示。
- UIは先頭5件のみ表示し「全時間帯を表示 →」の導線あり（現行は表示のみ。ページング/展開は次フェーズ）。

カスタムルール:

```typescript
interface CustomRule {
  id: number;      // UI上の一時ID
  rule: string;    // フリーテキスト
  active: boolean; // 有効/無効
}
```

- ルールの追加/削除、テキスト編集、有効/無効切替に対応。
- 個人名の含まれるルールも入力可（例: 「佐藤太郎は火曜午前は避ける」）。

データインポート:
- 過去シフトから必要人数をインポートするUI（ドラッグ&ドロップ/ファイル選択）。
- 対応形式: CSV, Excel（.xlsx/.xls）, PDF, JPEG/PNG。
- 現行モックではファイル選択→通知表示まで。数値への自動反映ロジックは未実装（次フェーズ）。

保存/状態表示:
- 右上の「変更を保存」ボタンで保存中スピナー/保存済み表示を行う（モック）。
- ルールセット名・説明のインライン編集には個別の「保存」ボタンあり。

ナビゲーション/ルーティング:
- 本画面のパス: `/admin/shift-rules`
- ヘッダーの戻る: `/admin/shift-create`

備考（命名規約）:
- DBは snake_case、フロント（UI/型定義）は camelCase を原則とする。
- 例）DB: `is_default`, `start_time` / UI: `isDefault`, `start`。

#### 3.3.2 シフト作成

前提: 本画面はモックUIに準拠し、ルール設定画面と分離。ページロード直後は「ステップ -1（初期設定/下書き）」を表示する。

ステップインジケーター:
- 画面上部に Step1〜Step3 のインジケーターを表示。
- 現在ステップは強調、完了済みステップはチェックアイコン表示。

ステップ -1: 初期設定/下書き
- 下書きパネル: 直近の1件を表示（再開/削除）。
- 作成対象ポジションの選択:
  - 全ポジション（バッジ: "全ポジション"。説明: 一括作成）
  - 個別ポジション（キッチン/ホール/レジなど、色分けバッジ。説明: 個別作成）
- ルールセット選択カード:
  - カードをクリックして選択。「このルールで作成」ボタン付き。
  - カード内にはカラー、説明、最終使用時期を表示。
  - 右上のリンク「ルール管理」から `/admin/shift-rules` に遷移。
- 月選択: 右上のドロップダウンで対象月を選択。

データ構造（UI層）:
```typescript
type PositionId = 'kitchen' | 'hall' | 'cashier' | string; // 初期は固定キー。将来はpositionsテーブルと連動

interface DraftShiftMeta {
  id: string;
  month: string;                // YYYY-MM
  rule_set: string;             // ルールセット名
  position: string;             // '全ポジション' or 表示名
  saved_at: string;             // ローカル日時文字列
}

interface ShiftAssignmentUI {
  employeeId: string;
  position: PositionId;
  start: string;                // HH:MM
  end: string;                  // HH:MM
}

type GeneratedShiftsUI = Record<string, ShiftAssignmentUI[]>; // キーは 'YYYY-MM-DD'
```

注記:
- 初期実装では下書きはメタ情報のみ保持（`DraftShiftMeta`）。後続で `shift_data`（全体の割当）保存に拡張（DBの `draft_shifts.shift_data` と対応）。
- ポジションカラーは `orange|blue|green|purple|red` の定義に従いバッジ表示。

##### Step 1: 提出状況確認（UIモックに準拠）
```typescript
interface SubmissionStatus {
  user_id: string;
  user_name: string;
  submitted: boolean;
  last_updated?: string;
}
```

表示仕様:
- 28日分を横スクロール可能なテーブル形式
- セル幅: 100px（シフト調整画面と同じ）
- 表示内容:
  - ◯: 終日OK（時間未指定で勤務可）
  - 時間表記（例: 09:00-17:00）: 勤務可で時間指定あり（青系表示）
  - 不可と理由: 赤色表示
  - 未提出: グレー表示
- 週末（土日）は背景色をオレンジ系に
- 左列（従業員名＋ポジションバッジ）は固定（sticky）
- CSV出力ボタンあり
- 右上の月選択ドロップダウンは全ステップ共通で表示

##### Step 2: AI自動作成（UIモックに準拠）
```typescript
// Gemini APIへのリクエスト
interface ShiftGenerationRequest {
  month: string;
  position: string;
  shift_requests: ShiftRequest[];
  requirements: {
    daily_staff_needed: number;
    operating_hours: string;
    custom_rules: string; // フリーテキスト
  };
  past_shifts?: Shift[]; // 過去データ（オプション）
}
```

UI構成・処理:
- サマリーカード表示（適用ルール/対象ポジション/希望提出率/対象人数）
- 「シフトを生成」ボタン押下で生成処理。生成中はスピナー表示。
- 適用ルールセットの必要人数/カスタムルール、従業員の希望（ok/ng＋任意の希望時間）を考慮（NGは入れない、OKで時間指定があれば可能な限り尊重、未提出者も適切に配置）。
- 「戻る」ボタンで Step 1 に戻る。

##### Step 3: 手動調整/確定（UIモックに準拠）
- シフト表ビュー: 従業員×日付のマトリクス。セルにポジション（色バッジ）/勤務時間/希望の簡易表示。セルクリックで編集モーダル（休み/ポジション/時間を編集）。
- 人員数ビュー: ポジション×時間の必要人数と実際人数を比較。過不足を色分け（不足: 赤/適正: 緑/過剰: 青）。対象日は当日もしくは選択日（現行モックは固定日表示。切替は次フェーズ）。
- 操作: 下書き保存（1件のみ）/CSV出力/シフト確定のボタンを提供（現行モックはダミー動作）。

編集モーダル（UIモックに準拠）:
```typescript
interface ShiftEditPayload {
  isOff: boolean;
  position?: PositionId;
  start?: string; // HH:MM
  end?: string;   // HH:MM
}
```
- 「休み」トグル可。
- 休みでない場合、ポジション選択（従業員が担当可能なポジションのみ）、開始/終了時刻を編集可。
- 保存で対象日の割当を上書き（既存があれば置換、休み指定なら削除）。
- キャンセルで変更破棄。

フィルタ/操作:
- ビュー切替: 「シフト表」「人員数」タブ。
- ポジションフィルタ: 「全ポジション」/個別を切替（従業員リスト/人員数に反映）。
- 「再生成」ボタン: Step 1に戻って再度AI生成を実行。

#### 3.3.4 勤怠管理（更新｜モックUIに準拠）

概要: 日次/月次の勤怠を閲覧・集計し、必要に応じて編集（出退勤/休憩/修正理由）を行う。位置情報による打刻有効判定も表示する。

ルーティング:
- 本画面のパス: `/admin/attendance`

ヘッダー:
- タイトル「勤怠管理」
- 右側に「勤怠表出力」「CSV出力」ボタン

ビュー切替:
- 日次ビュー（daily）/ 月次ビュー（monthly）のトグルボタン

日次ビュー:
- 日付選択（左右の前日/翌日ボタン＋`<input type="date">`）
- サマリー: 出勤予定人数/出勤済人数/残業合計分
- テーブル列: 従業員（コード＋氏名＋編集済みアイコン）/ シフト（例: 09:00-18:00 or 休み）/ 出勤/ 退勤/ 休憩（分）/ 実働（hh:mm）/ 残業（+分）/ 位置（OK=緑アイコン）/ 操作（編集）
- 編集: シフトが「休み」以外の場合に編集可能

月次ビュー:
- 月選択（YYYY-MM）/ 従業員選択（ドロップダウン）
- サマリー: 出勤日数/総勤務時間/残業時間
- テーブル列: 日付（週末はオレンジ背景）/ シフト/ 出勤/ 退勤/ 実働/ 残業/ 備考（例: 編集済）/ 操作（編集）
- 選択中日付は強調表示（リング）

編集モーダル:
```typescript
interface AttendanceEditPayload {
  clock_in?: string;       // HH:MM
  clock_out?: string;      // HH:MM
  break_minutes?: number;  // 分
  edit_reason: string;     // 必須
}
```
- ヘッダー: 勤怠記録編集
- 対象情報: 従業員名/対象日
- 入力: 出勤/退勤（time）、休憩（number, step=15）、修正理由（必須）
- 保存/キャンセルボタン

位置情報の表示:
- 打刻位置が店舗の打刻可能半径内であればOK（緑アイコン）。UIでは `location_ok` を表示。
- 判定は `attendances.clock_in_lat/lng` と店舗の `stores.latitude/longitude/clock_radius_meters` から算出。

データ構造（UI層例）:
```typescript
interface DailyAttendanceRowUI {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_code: string;
  scheduled: string;        // '09:00-18:00' | '休み'
  clock_in: string | null;  // 'HH:MM' | null
  clock_out: string | null; // 'HH:MM' | null
  break_minutes: number;
  actual_hours: string | null;   // 'h:mm'
  overtime_minutes: number;      // 分
  location_ok: boolean;
  edited: boolean;               // edited_by/edit_reasonの有無から導出
}

interface MonthlyAttendanceRowUI {
  date: string;      // YYYY-MM-DD
  day: string;       // '月' 等（表示用）
  scheduled: string; // '09:00-18:00' | '休み'
  clock_in: string | null;
  clock_out: string | null;
  actual: string | null;   // 'h:mm'
  overtime: number;        // 分
}
```

API入出力（概略）は §5.5 を参照。

#### 3.3.5 店舗設定（新設｜モックUIに準拠）

目的: シフト作成/勤怠計算の前提となる店舗共通ルールを管理する。

ルーティング:
- 本画面のパス: `/admin/settings`

タブ構成:
- 基本情報: 店舗名/住所/電話/通知メール/打刻位置（住所→地図→座標）
- 営業時間/定休日: 曜日別の開店/閉店、定休日、翌日閉店（跨ぎ）
- 打刻/計上ルール: 営業時間外勤務の許容、早出/残業の許容分、丸め（1/5/10/15/30分, 切捨/切上/四捨五入）、遅刻/早退の猶予
- 休憩ルール: 連続労働分数に応じた自動休憩付与（有給/無給、複数段階）
- ポジション管理: コード/名称/色/並び順/有効・無効
- 高度な設定: 日付境界時刻（例: 5=05:00）、既定の休み希望上限（従業員未設定時に適用）

UI/UX:
- 保存ボタンで保存中スピナー/成功トースト/エラートースト
- 未保存離脱時の確認ダイアログ
- ポジションはドラッグ&ドロップで並び替え、色は固定パレットから選択
- 営業時間は曜日行の一括適用操作を提供
- 打刻位置（Phase 1）: Googleマップから座標をコピペして `stores.latitude/longitude` を保存。現在地テストで距離算出と判定（OK/範囲外）
- 打刻位置（Phase 2 以降）: 住所検索→地図上のピンで微調整（将来対応）

型（UI想定）:
```ts
type RoundingMode = 'floor' | 'ceil' | 'round';

interface RoundingPolicy { unitMinutes: 1|5|10|15|30; mode: RoundingMode }
interface BusinessHour { weekday: 0|1|2|3|4|5|6; isClosed: boolean; open?: string; close?: string; crossMidnight?: boolean }
interface BreakRuleUI { autoInsert: boolean; minWorkMinutes: number; breakMinutes: number; paid: boolean }

interface ShopSettingsUI {
  businessHours: BusinessHour[];
  allowWorkOutsideHours: boolean;
  earlyStartAllowMinutes: number;
  lateEndAllowMinutes: number;
  clockInRounding: RoundingPolicy;
  clockOutRounding: RoundingPolicy;
  overtimeRounding: RoundingPolicy;
  graceLateMinutes: number;
  graceEarlyLeaveMinutes: number;
  defaultMaxOffRequests: number | null;
  dayBoundaryHour: number; // 0-6
  clockRadiusMeters: number; // 打刻可能半径（m）
  breakRules: BreakRuleUI[];
}

interface PositionUI { id: string; code: string; name: string; color: string; order: number; active: boolean }
```

仕様連携:
- シフト作成のポジション選択肢は、当画面のポジション管理に同期
- 勤怠計算は「丸め/猶予/日付境界/休憩」設定を参照
- `defaultMaxOffRequests` は従業員個別の `maxOffRequests` 未設定時に適用
- 出退勤の半径判定は `stores.latitude/longitude` と `clockRadiusMeters` を使用（ハバースイン距離）

将来拡張（次フェーズ）:
- 例外日（臨時休業/特別営業時間）管理、祝日カレンダー取込

#### 3.3.6 開発者ツール（新設｜運用/検証支援）

目的: 管理者/システム管理者が検証・初期投入・デバッグを行うためのユーティリティをまとめる（本番では厳格な権限制御）。

ルーティング:
- 本画面のパス: `/admin/dev-tools`

主機能:
- 招待/アカウント管理: 従業員/管理者の招待リンク生成・失効・QR表示、メール送信テスト（プレビュー）
- 設定の入出力: 店舗設定/ポジション/休憩ルールをJSONでエクスポート/インポート
- 機能フラグ（任意）: 検証用の表示切替（例: 出退勤のsimpleモード固定）
- テスター: 位置情報計測（店舗座標との距離表示）、Edge Functionの疎通確認
- ダミーデータ: 従業員/希望/シフト/勤怠のサンプル投入/クリア（注意喚起付き）

権限/セキュリティ:
- `admin` 以上。危険操作は二重確認/環境ガード（本番無効）

#### 3.3.3 従業員管理（更新｜モックUIに準拠）

概要: 従業員の検索/フィルタ/一覧/登録/編集を行う。UIはサイドバー＋テーブル主体。CSV取り込み/エクスポート、個別編集モーダルを提供。

ヘッダー:
- タイトル「従業員管理」
- サマリー: 総人数/稼働中人数
- 操作: CSV取込、エクスポート、新規登録

フィルタ:
- キーワード検索: 名前/カナ/メール/従業員コード
- 雇用形態: all | full_time | part_time | contract
- ステータス: all | active | inactive

一覧テーブル（列）:
- チェックボックス（全選択/個別選択）
- 従業員（コード＋氏名、氏名クリックで編集モーダル）
- 雇用形態（色バッジ）
- ポジション（複数バッジ、`user_positions` 連動）
- 有給残（日）
- 社会保険（●=健康/年金あり、▲=雇用のみ、- =なし）
- 月間上限（h）
- 今月実績（h、進捗バー/しきい値80%=橙, 90%超=赤）
- ステータス（稼働中/休止中のトグル）
- アカウント（authStatus 表示とメニュー: 招待リンク生成/コピー/QR表示/失効）
- 操作（編集）

モーダル（新規/編集）:
- タブ: 基本情報 / 雇用情報 / 社会保険・有給
- 基本情報: 従業員コード（必須）/氏名（必須）/カナ（必須）/メール（必須）/電話/住所/権限（admin|employee）
- 雇用情報: 雇用形態（必須）/入社日（必須）/契約期限（契約のみ必須）/対応可能ポジション（複数選択）/月間労働時間上限（時間）
- 社会保険・有給: 各保険の有無（健康/年金/雇用）/有給 付与・消化・残の確認
- バリデーション: 必須項目の未入力時は保存不可
- アカウント連携（重要）:
  - プロファイルID（`profiles.id`）はアプリ内の主キー、AuthユーザーIDは `profiles.auth_user_id` にリンク
  - 新規登録時: メールあり→ Authユーザー作成→ 返却IDを `profiles.auth_user_id` に保存／メールなし→ 先に`profiles`を作成し、招待リンクでオンボード完了時に `auth_user_id` を紐付け
  - 既存従業員のメール変更時: Auth 側のメールも同期（`auth_user_id` が存在する場合）
  - 退職/休止時: `profiles.is_active=false`。Auth 側は無効化（任意）
- アカウントタブ（UI）:
  - 表示: `authStatus`（'active'|'invited'|'disabled'）
  - 操作: 招待リンク生成（24h/72h/7d）/リンクコピー/QR表示/既存リンク失効
  - 任意: 招待メール再送/パスワードリセットメール（メールアドレスがある場合のみ）
  - 招待リンクは時間制限付きトークンで作成し、失効で再利用不可

データ構造（UI層）:
```typescript
type EmploymentType = 'full_time' | 'part_time' | 'contract';
type Role = 'admin' | 'employee';

interface EmployeeUI {
  id: string;              // = profiles.id（アプリ内の主キー）
  authUserId?: string | null; // = auth.users.id（存在すれば）
  employeeCode: string;
  name: string;
  kana: string;
  email: string | null;
  phone?: string;
  role: Role;
  positions: string[]; // position_id
  employment_type: EmploymentType;
  hire_date: string;         // YYYY-MM-DD
  contract_end?: string | null; // YYYY-MM-DD | null
  is_active: boolean;
  address?: string;
  monthly_limit?: number;    // h
  monthly_current?: number;  // h（APIで計算して返す）
  paid_leave?: { total: number; used: number; remaining: number };
  social_insurance?: { health: boolean; pension: boolean; employment: boolean };
  authStatus?: 'active'|'invited'|'disabled';
  maxOffRequests?: number; // 休み希望上限（日/月）。未設定時は店舗の既定値を適用
}
```

算出項目:
- `monthly_current`: 当月の `attendances` 集計で算出（API側）
- `paid_leave.remaining = total - used`（API側で返却しても良い）

操作仕様:
- 行選択/全選択（右下に選択件数表示）
- ステータストグルで `is_active` を即時切替
- ページネーション（初期は1/1固定、将来実データでページング）

ナビゲーション/ルーティング:
- 本画面のパス: `/admin/employees`

---

 

### 3.4 店舗登録/決済（公開）

目的: 店舗オーナーが自走でテナントを作成し、必要に応じてStripe決済を完了する。

画面/ルート（実装準拠）:
- `/register-store`（公開）
  - 入力: 店舗名、管理者メール、招待コード（任意）
  - 挙動:
    - 招待コードが有効: 決済スキップで店舗作成（sponsored）→ 管理者招待リンク発行
    - コードなし/無効: Stripe Checkoutへ遷移（サブスク作成）
- `/billing/return`（公開）
  - success/cancelの結果表示。
  - 成功時は「管理者アカウントの招待メールをご確認ください」導線（Webhookでの反映を前提）

招待コード:
- フィールド: `code`, `expires_at`, `max_uses`, `used_count`, `note`
- 目的: スポンサー/支援先向けに決済スキップを提供

Stripe（MVP｜表示ポリシー）:
- Checkout Session作成（price_id指定）
- Webhook: `checkout.session.completed`, `customer.subscription.updated` で `stores` を更新
- 店舗管理者は 店舗設定画面の「請求管理」タブから Customer Portal を起動（支払方法/請求管理）
- 料金のUI表示はミニマム（具体的な販促文/割引文言は管理画面に非表示、公開登録ページでも金額強調を避ける）

権限/遷移:
- 登録完了後、管理者にはオンボード用の招待リンクが送付される

### 3.5 システム管理（運営）

目的: 運営が複数店舗を横断して管理（参照/最低限の操作）する。

画面/ルート:
- `/system/stores`（一覧）
  - 列: 店舗名、オーナーEmail、プラン（free/sponsored/paid）、課金ステータス、作成日、状態
  - 操作: 検索/絞り込み、詳細へ
- `/system/stores/:id`（詳細｜実装準拠）
  - 概要: 店舗基本情報、Stripe customer/subscription、スポンサー状態
  - 操作: 基本情報の編集（店舗名/住所/電話/オーナー情報/メール）、停止/再開、管理者招待リンクの生成/失効、Stripe Portalリンク生成
- `/system/invite-codes`（招待コード管理）
  - 一覧/発行/失効、コピー。項目: code/期限/上限/使用回数/メモ
- 店舗管理者向け 請求管理（`/admin/settings` 内タブ）
  - Customer Portal 起動ボタン

権限:
- `system_admin` のみ `/system/*` にアクセス可。本番はIP制限/再認証推奨

---

## 4. データベース設計（ルール設定の追加分を含む）

### 4.1 テーブル定義

#### users（Supabase Auth統合）
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id),
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'employee')) DEFAULT 'employee',
  employment_type TEXT,
  hourly_wage DECIMAL(10,2),
  hire_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### stores
```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  contact_email TEXT,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  clock_radius_meters INTEGER DEFAULT 50, -- 打刻可能半径（m）
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### positions
```sql
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES stores(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### user_positions（中間テーブル）
```sql
CREATE TABLE user_positions (
  user_id UUID REFERENCES profiles(id),
  position_id UUID REFERENCES positions(id),
  PRIMARY KEY (user_id, position_id)
);
```

-- 従業員管理で使用する拡張（profiles拡張）
-- 既存 profiles に以下のカラムを追加（必要に応じてマイグレーション分割）
-- employee_code, kana, phone, address, contract_end, monthly_limit
-- max_off_requests（休み希望上限/日）、auth_status（active/invited/disabled）
-- 既存 'role', 'hire_date', 'is_active' は流用
-- 例:
-- ALTER TABLE profiles ADD COLUMN employee_code TEXT UNIQUE;
-- ALTER TABLE profiles ADD COLUMN kana TEXT;
-- ALTER TABLE profiles ADD COLUMN phone TEXT;
-- ALTER TABLE profiles ADD COLUMN address TEXT;
-- ALTER TABLE profiles ADD COLUMN contract_end DATE;
-- ALTER TABLE profiles ADD COLUMN monthly_limit INTEGER;
-- ALTER TABLE profiles ADD COLUMN max_off_requests SMALLINT;
-- ALTER TABLE profiles ADD COLUMN auth_status TEXT CHECK (auth_status IN ('active','invited','disabled'));

-- 社会保険・有給の管理（簡易）
-- シンプルに profiles に持たせる場合:
-- ALTER TABLE profiles ADD COLUMN insurance_health BOOLEAN DEFAULT false;
-- ALTER TABLE profiles ADD COLUMN insurance_pension BOOLEAN DEFAULT false;
-- ALTER TABLE profiles ADD COLUMN insurance_employment BOOLEAN DEFAULT true;
-- ALTER TABLE profiles ADD COLUMN paid_leave_total INTEGER DEFAULT 0;
-- ALTER TABLE profiles ADD COLUMN paid_leave_used INTEGER DEFAULT 0;

#### shift_requests
```sql
CREATE TABLE shift_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  availability TEXT CHECK (availability IN ('ok', 'ng')),
  preferred_start TIME,
  preferred_end TIME,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

#### shifts
```sql
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  position_id UUID REFERENCES positions(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

#### attendances
```sql
CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  clock_in TIME,
  clock_out TIME,
  break_minutes INTEGER DEFAULT 0,
  clock_in_lat DECIMAL(10,8),
  clock_in_lng DECIMAL(11,8),
  clock_out_lat DECIMAL(10,8),
  clock_out_lng DECIMAL(11,8),
  edited_by UUID REFERENCES profiles(id),
  edit_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

#### rule_sets（新規）
```sql
CREATE TABLE rule_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT CHECK (color IN ('blue', 'orange', 'green', 'purple', 'red')),
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### shift_patterns（新規）
```sql
CREATE TABLE shift_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_set_id UUID REFERENCES rule_sets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  color TEXT,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### staff_requirements（新規）
```sql
CREATE TABLE staff_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_set_id UUID REFERENCES rule_sets(id) ON DELETE CASCADE,
  day_type TEXT CHECK (day_type IN ('weekday', 'weekend')),
  time TIME NOT NULL,
  position_id UUID REFERENCES positions(id),
  required_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rule_set_id, day_type, time, position_id)
);
```

#### custom_rules（新規）
```sql
CREATE TABLE custom_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_set_id UUID REFERENCES rule_sets(id) ON DELETE CASCADE,
  rule_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### draft_shifts（新規）
```sql
CREATE TABLE draft_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  month TEXT NOT NULL,
  rule_set_id UUID REFERENCES rule_sets(id),
  position_filter TEXT,  -- 'all' or position_id
  shift_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### shop_settings（新規）
```sql
CREATE TABLE shop_settings (
  shop_id UUID PRIMARY KEY REFERENCES stores(id),
  business_hours JSONB NOT NULL,
  allow_work_outside_hours BOOLEAN DEFAULT false,
  early_start_allow_minutes SMALLINT DEFAULT 0,
  late_end_allow_minutes SMALLINT DEFAULT 0,
  clock_in_round_unit SMALLINT DEFAULT 1,
  clock_in_round_mode TEXT CHECK (clock_in_round_mode IN ('floor','ceil','round')) DEFAULT 'round',
  clock_out_round_unit SMALLINT DEFAULT 1,
  clock_out_round_mode TEXT CHECK (clock_out_round_mode IN ('floor','ceil','round')) DEFAULT 'round',
  overtime_round_unit SMALLINT DEFAULT 15,
  overtime_round_mode TEXT CHECK (overtime_round_mode IN ('floor','ceil','round')) DEFAULT 'floor',
  grace_late_minutes SMALLINT DEFAULT 0,
  grace_early_leave_minutes SMALLINT DEFAULT 0,
  default_max_off_requests SMALLINT,
  day_boundary_hour SMALLINT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### break_rules（新規）
```sql
CREATE TABLE break_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES stores(id),
  min_work_minutes INTEGER NOT NULL,  -- 連続労働分数のしきい値
  break_minutes INTEGER NOT NULL,     -- 自動付与する休憩分
  paid BOOLEAN DEFAULT false,         -- 有給休憩か
  auto_insert BOOLEAN DEFAULT true,   -- 自動付与を有効にするか
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### invitations（新規）
```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  employee_id UUID REFERENCES profiles(id),
  email TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
#### invite_codes（新規｜運営向け）
```sql
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

-- stores 拡張（課金/オーナー情報）
```sql
ALTER TABLE stores
  ADD COLUMN stripe_customer_id TEXT,
  ADD COLUMN stripe_subscription_id TEXT,
  ADD COLUMN plan TEXT CHECK (plan IN ('free','sponsored','paid')) DEFAULT 'free',
  ADD COLUMN plan_status TEXT CHECK (plan_status IN ('active','past_due','canceled')) DEFAULT 'active',
  ADD COLUMN is_sponsored BOOLEAN DEFAULT false,
  ADD COLUMN owner_profile_id UUID REFERENCES profiles(id);
```

-- profiles.role に system_admin を追加（メモ）
-- 既存ロール: 'admin','employee' に 'system_admin' を追加

```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  employee_id UUID REFERENCES profiles(id),
  email TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

```sql
CREATE TABLE break_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES stores(id),
  min_work_minutes SMALLINT NOT NULL,
  break_minutes SMALLINT NOT NULL,
  auto_insert BOOLEAN DEFAULT true,
  paid BOOLEAN DEFAULT false,
  display_order SMALLINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Row Level Security (RLS)

```sql
-- 従業員は自分のデータのみアクセス可能
ALTER TABLE shift_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own shift requests" ON shift_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shift requests" ON shift_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 管理者は全データアクセス可能
CREATE POLICY "Admins can view all data" ON shift_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 同様のポリシーを各テーブルに設定
```

---

## 5. API設計（更新）
### 5.7 公開登録/決済（新設）

#### POST /api/public/register-store
- 入力: { store_name, owner_email, invite_code? }
- 動作:
  - 招待コードが有効 → 店舗作成（plan='sponsored', is_sponsored=true）→ 管理者招待発行（リンク/QR返却）
  - 招待コードなし/無効 → Stripe Checkout Session を作成し `checkout_url` を返却

#### POST /api/webhooks/stripe
- 受信: checkout.session.completed, customer.subscription.updated
- 動作: stores の plan/plan_status/stripe_* を更新（冪等）

#### POST /api/billing/portal-session（管理者）
- 動作: Stripe Customer Portal の起動URLを返却

### 5.8 システム管理API（運営｜新設）

#### GET /api/system/stores
- クエリ: q, plan, status, page, page_size
- 権限: system_admin

#### GET /api/system/stores/:id
- 権限: system_admin

#### POST /api/system/stores/:id/toggle-active
- 動作: 店舗の停止/再開

#### GET/POST /api/system/invite-codes
- 一覧/発行/失効（POST は action指定）

### 5.0 管理者ホーム用API（新設）

#### /api/admin/dashboard
- GET: 管理者ホームのダッシュボード集計を取得

レスポンス例:
```typescript
interface AdminDashboardResponse {
  store: { id: string; name: string };
  weekly_stats: {
    submitted_requests: number;
    pending_requests: number;
    attendance_corrections: number;
  };
  submission_statuses: SubmissionStatus[]; // §3.3.0 参照
  recent_activities: RecentActivity[];     // §3.3.0 参照
}
```

### 5.1 ルールセット関連API（新設）

#### /api/rule-sets
- GET: ルールセット一覧取得
- POST: 新規ルールセット作成

#### /api/rule-sets/:id
- PUT: ルールセット更新（名前/説明/カラー、is_default の変更）
- DELETE: ルールセット削除（is_default の場合は 400）

#### /api/rule-sets/:id/duplicate
- POST: ルールセット複製（内容ごとコピー）

#### /api/rule-sets/:id/patterns
- GET: 勤務パターン一覧取得
- POST: 勤務パターン追加

#### /api/rule-sets/:id/patterns/:pattern_id
- PUT: 勤務パターン更新
- DELETE: 勤務パターン削除

#### /api/rule-sets/:id/requirements
- GET: 必要人数設定取得（weekday/weekend 全行）
- PUT: 必要人数設定更新（バルク）

#### /api/rule-sets/:id/requirements/import
- POST: 過去データからインポート（CSV/Excel/PDF/画像）。初期は受付のみ（非同期処理/後続で反映）。

#### /api/rule-sets/:id/rules
- GET: カスタムルール一覧取得
- POST: カスタムルール追加

#### /api/rule-sets/:id/rules/:rule_id
- PUT: カスタムルール更新
- DELETE: カスタムルール削除

### 5.2 シフト作成関連API（更新）

#### /api/shifts/draft
- GET: 下書き取得（ユーザー毎に1件）
- POST: 下書き保存（上書き）
- DELETE: 下書き削除

#### /api/shifts/export
- POST: CSV出力
```typescript
interface ExportRequest {
  month: string;
  type: 'requests' | 'shifts';
  position?: string; // 'all' or position_id
}
```

### 5.3 Supabase Edge Functions（AI生成）

#### /functions/generate-shift
Gemini APIを使用してAI自動生成。ルールセットの必要人数/カスタムルール、従業員の希望（ok/ng＋任意の希望時間）を考慮する。

```typescript
interface ShiftGenerationRequest {
  month: string;                 // YYYY-MM
  position: string | 'all';      // 例: 'kitchen' | 'all'
  rule_set_id: string;           // 適用するルールセット
}

interface ShiftGenerationResponse {
  shifts: Array<{
    date: string;                // YYYY-MM-DD
    assignments: Array<{
      user_id: string;
      position_id: string;
      start_time: string;        // HH:MM
      end_time: string;          // HH:MM
    }>;
  }>;
}
```

### 5.2 クライアント側API呼び出し
 
### 5.3 シフト希望提出API（従業員側｜新設）

#### /api/shift-requests
- GET: 当月の自分の希望一覧（authユーザー）
- PUT: 月次の部分更新（配列で複数日を一括、サーバーでUPSERT）

リクエスト例:
```typescript
interface PutShiftRequestsPayload {
  month: string; // YYYY-MM
  items: Array<{
    date: string;                // YYYY-MM-DD
    availability: 'ok'|'ng';
    start?: string;              // HH:MM
    end?: string;                // HH:MM
    note?: string;
  }>;
}
```

バリデーション（サーバー）:
- `availability='ok'` のとき `start<end` をチェック
- UNIQUE(user_id,date)に対してUPSERT
- 当月の `ng` 件数が `profiles.max_off_requests`（未設定時は `shop_settings.default_max_off_requests`）を超える場合は 409 で警告（MVPでは警告のみ）

### 5.4 従業員管理API（新設）

#### /api/employees
- GET: 従業員一覧（検索・フィルタ・ページング）
  - クエリ: `q`（検索）, `employment_type`, `status`, `page`, `page_size`
- POST: 従業員作成
  - 動作: メールあり→ Authユーザーを作成→ 返却された `auth_user_id` を `profiles.auth_user_id` に保存し、`profiles` を作成
          メールなし→ まず `profiles` を作成（`auth_user_id` はNULL）→ 招待リンクでオンボード時に紐付け
  - メールがある場合: オプションで招待メール自動送信（フラグ `send_invite_email: true`）
  - メールがない場合: 招待リンク/QRでオンボーディング（後述API）

レスポンス例（一覧）:
```typescript
interface EmployeesListResponseItem {
  id: string;                    // profiles.id
  auth_user_id: string | null;   // auth.users.id
  employee_code: string;
  name: string;
  kana: string;
  email: string | null;
  role: 'admin'|'employee';
  employment_type: 'full_time'|'part_time'|'contract';
  is_active: boolean;
  monthly_limit: number | null;
  monthly_current: number | null;
  paid_leave_total: number | null;
  paid_leave_used: number | null;
  social_insurance: { health: boolean; pension: boolean; employment: boolean } | null;
  positions: { id: string; code: string; name: string; color: string }[];
  auth_status: 'active'|'invited'|'disabled' | null;
  max_off_requests: number | null;
}
```

#### /api/employees/:id
- GET: 詳細取得
- PUT: 更新（基本/雇用/保険・有給）
- DELETE: 削除（初期は非対応でも可）

PUTリクエスト例（抜粋）:
```typescript
interface UpdateEmployeePayload {
  name?: string;
  kana?: string;
  email?: string | null; // 更新時はAuthと同期
  phone?: string | null;
  address?: string | null;
  employment_type?: 'full_time'|'part_time'|'contract';
  hire_date?: string;     // YYYY-MM-DD
  contract_end?: string | null;
  positions?: string[];   // position_id
  monthly_limit?: number | null;
  paid_leave_total?: number | null;
  paid_leave_used?: number | null;
  insurance_health?: boolean;
  insurance_pension?: boolean;
  insurance_employment?: boolean;
  auth_status?: 'active'|'invited'|'disabled';
  max_off_requests?: number | null;
}
```

#### /api/employees/:id/toggle-active
- POST: 稼働/休止の切替
  - 付随動作（任意）: Authユーザーの有効/無効を同期

#### /api/employees/import
- POST: CSV取込（非同期処理、初期は受付のみ）

#### /api/employees/export
- GET: CSVエクスポート

#### /api/employees/:id/invite-link
- POST: 招待リンク生成（有効期限: 24h/72h/7d 指定）
- レスポンス: { action_link: string, qr_png: string(base64), expires_at: string }

#### /api/employees/:id/invite-revoke
- POST: 既存の招待リンク無効化

#### /api/employees/:id/invite-resend (optional)
- POST: 招待メールの再送（メール運用時）

#### /api/employees/:id/password-reset (optional)
- POST: パスワードリセットメール送信（メール運用時）

### 5.6 招待・トークンAPI（新設）

#### /api/invitations
- POST: 招待トークンの生成（`employee_id`, `email?`, `expires_at`）→ トークンとURL/QRを返却
  - レスポンス例: `{ token: string, action_link: string, qr_png: string(base64), expires_at: string }`

#### /api/invitations/verify
- GET: `token` を検証して状態を返す（valid/expired/used + 招待情報）
  - レスポンス例: `{ status: 'valid'|'expired'|'used', employee_name?: string, employee_code?: string, store_name?: string, email?: string | null }`
  - エラー: 400（token欠落）, 404（該当なし）

#### /api/invitations/use
- POST: `token` を使用済みにする（オンボード完了時）
  - リクエスト: `{ token: string, email: string, password_set: true }`
  - レスポンス: `{ success: true }`
  - エラー: 400（token欠落）, 409（期限切れ/使用済）, 422（入力不正）

### 5.5 勤怠管理API（新設）

#### /api/attendance/daily
- GET: 指定日の全従業員の日次勤怠一覧
  - クエリ: `date`（YYYY-MM-DD）, `store_id`（任意）
- レスポンス: `DailyAttendanceRowUI[]` とサマリー（出勤予定/出勤済/残業合計）

#### /api/attendance/monthly
- GET: 指定の従業員・月の月次勤怠一覧
  - クエリ: `month`（YYYY-MM）, `employee_id`
- レスポンス: `MonthlyAttendanceRowUI[]` とサマリー（出勤日数/総勤務分/残業分）

#### /api/attendance/:id
- PUT: 勤怠記録の更新（管理者編集）
  - ボディ: `AttendanceEditPayload`（§3.3.4）
  - 備考: `edited_by` は認証ユーザーID、`edit_reason` は必須

#### /api/attendance/export
- GET: CSVエクスポート（日次/月次いずれか。クエリで切替）
  - クエリ例: `type=daily&date=YYYY-MM-DD` or `type=monthly&month=YYYY-MM&employee_id=...`

```typescript
// Supabase Client初期化
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// データ取得例
const { data, error } = await supabase
  .from('shifts')
  .select('*')
  .eq('date', '2024-12-01')
```

#### （従業員）打刻API

- POST /api/clock/in
  - ボディ: `{ employee_id?: string, employee_code?: string, lat: number, lng: number, timestamp?: string }`
  - 動作: 認証ユーザーから `employee_id` を解決（simpleモード時は `employee_code` を許可）。店舗座標と半径で位置判定し、当日未出勤なら `clock_in` を登録
  - エラー: 403（圏外/位置未許可）, 409（すでに出勤済み）

- POST /api/clock/out
  - ボディ: `{ employee_id?: string, employee_code?: string, lat: number, lng: number, break_minutes?: number, timestamp?: string }`
  - 動作: 出勤中レコードに `clock_out` と `break_minutes` を設定
  - エラー: 400（未出勤）, 403（圏外）, 409（すでに退勤済み）

レスポンス例:
```typescript
interface ClockResponse { ok: boolean; status: 'clocked_in'|'clocked_out'; message?: string }
```

---

### 5.6 店舗設定API（新設）

#### /api/shop-settings
- GET: 店舗設定の取得（`ShopSettingsUI`）
- PUT: 店舗設定の更新（全置換）
  - 競合回避: 楽観ロックとして ETag/If-Match を採用
  - クライアント手順:
    1) GETで `ETag` を取得
    2) PUT時にヘッダ `If-Match: <ETag>` を付与
    3) 不一致時は 412 Precondition Failed を返し、再読込→再編集を促す
  - 備考: Phase 1 は単一店舗固定のため、サーバ側で `shop_id` を認証テナントのデフォルトに固定して扱う

#### /api/positions
- GET: `PositionUI[]`（active=trueのみ。`order`昇順）
- POST: 追加

#### /api/positions/:id
- PUT: 更新（名称/色/order/active）
- DELETE: 削除 or 論理削除（active=false）

#### /api/break-rules
- GET: `BreakRuleUI[]`（order昇順）
- POST/PUT/DELETE: 追加・更新・削除

## 6. 画面設計（更新）

### 6.1 画面一覧

| 画面名 | パス | 権限 | 説明 |
|--------|------|------|------|
| ログイン | /login | 全員 | メール/パスワード認証 |
| オンボード | /onboard | 招待 | 招待リンクからの初期設定（トークン必須） |
| パスワード再設定 | /reset-password | 全員 | リセットメール送信/新パスワード設定 |
| 出退勤 | /attendance | 従業員 | 打刻機能 |
| シフト提出 | /shift | 従業員 | 希望の提出・編集 |
| 確定シフト | /confirmed | 従業員 | 確定シフトの閲覧 |
| 管理者ホーム | /admin/home | 管理者 | メニュー画面（提出状況/クイックアクション/最近の更新） |
| 開発者ツール | /admin/dev-tools | 管理者 | 開発者向けユーティリティ（ダミーデータ投入/初期化・設定のエクスポート/インポート・メール/招待デバッグ） |
| シフト作成 | /admin/shift-create | 管理者 | AI作成・編集 |
| シフトルール設定 | /admin/shift-rules | 管理者 | ルールセット管理（勤務パターン/必要人数/カスタムルール） |
| 従業員管理 | /admin/employees | 管理者 | 登録・編集 |
| 勤怠管理 | /admin/attendance | 管理者 | 勤怠データ編集 |
| 店舗設定 | /admin/settings | 管理者 | 店舗・打刻/計上ルール・ポジション・請求管理タブ |
| 店舗登録 | /register-store | 公開 | 店舗名・オーナーEmail・招待コード、決済誘導 |
| 決済戻り | /billing/return | 公開 | Stripe決済の戻り（成功/キャンセル表示） |
| 運営: 店舗一覧 | /system/stores | system_admin | テナント横断一覧（検索/絞り込み） |
| 運営: 店舗詳細 | /system/stores/:id | system_admin | 概要/課金/招待/ログ、基本情報編集 |
| 運営: 招待コード | /system/invite-codes | system_admin | 招待コードの一覧/発行/失効 |
| 開発者ツール | /admin/dev-tools | 管理者 | 開発者向けユーティリティ（ダミーデータ投入/初期化・設定のエクスポート/インポート・メール/招待デバッグ） |

### 6.2 UI/UX 指針（ルール設定・作成画面）
- ポジション表示は色分け（orange, blue, green, purple, red）。
- ルール設定はタブ切替（勤務パターン/必要人数/カスタムルール）。
- 必要人数は時間帯別の横並び入力。全ポジション表示/個別ポジション表示を切替。
- 右上に保存ボタン。保存中/保存済みの視覚的フィードバックを表示。
- ルールセット一覧カードは選択時に強調（オレンジ境界/背景）。デフォルトは「既定」バッジ。
- ルールセットの新規作成/複製/削除（既定は削除不可）を提供。

### 6.3 UI/UX 指針（従業員管理）
- 検索は即時反映（クライアント側フィルタ。将来はサーバー検索）
- 雇用形態/ステータスのセレクトで一覧が絞り込まれる
- 氏名は編集モーダルのトリガー
- 月間実績のしきい値表示（>90%: 赤, >80%: 橙）
- 選択件数をフッター右側に表示

### 6.4 レスポンシブ対応
- モバイル: 375px～
- タブレット: 768px～
- デスクトップ: 1024px～

### 6.5 UI/UX 指針（出退勤）
- モード切替（login/simple）を画面右上に配置（デモ）。本番は管理設定で固定可
- 大型時計は常時表示し、秒単位で更新。背景で視認性を担保
- 完了画面は色トーンと文言で出勤/退勤を明確化し、5秒後に自動リセット
- 休憩入力は退勤時にモーダルで実施。クイックボタンと15分刻みの数値入力を併用
- 位置情報の許可/範囲外は即時にバナーで可視化

---

## 7. セキュリティ要件

### 7.1 認証・認可
- Supabase Authによる認証
- JWTトークンベースのセッション管理
- RLSによるデータアクセス制御

### 7.2 データ保護
- HTTPS通信必須
- 位置情報は打刻時のみ取得（保存後は参照のみ）
- パスワードはSupabase側でbcryptハッシュ化

### 7.3 不正防止
- 位置情報による打刻制限
- 同一日の重複打刻防止
- 管理者による編集履歴の記録

### 7.4 RLS（Row Level Security）方針（要点）
- `profiles`: 自分自身のみ参照/更新可能。管理者は同店舗の従業員を参照/更新可
- サンプル（Supabaseポリシー例・概略）
```sql
-- shift_requests: 従業員は自分の行のみ
create policy "select own requests" on shift_requests
  for select using (auth.uid() = user_id);
create policy "upsert own requests" on shift_requests
  for insert with check (auth.uid() = user_id);
create policy "update own requests" on shift_requests
  for update using (auth.uid() = user_id);

-- 従業員一覧（管理者のみ）: store_idのマッピングがある前提
-- 例: profiles.store_id = current_setting('app.store_id')::uuid
create policy "admin can read employees" on profiles
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
```
- `shift_requests`: 従業員は自分の行のみ CRUD。管理者は同店舗の全従業員の行を参照可
- `shifts`: 管理者のみ書込。従業員は自分の確定シフトのみ参照
- `attendances`: 従業員は自分の行参照、自己申請（将来）。管理者は同店舗の全行を参照/更新
- `rule_sets/*`: 管理者のみ CRUD
- `shop_settings/positions/break_rules`: 管理者のみ CRUD、従業員は参照のみ
- `invitations`: 管理者のみ CRUD、トークン検証（verify）は公開関数で制御

---

## 8. 非機能要件

### 8.1 性能要件
- ページ読み込み: 3秒以内
- API応答時間: 2秒以内
- 同時接続数: 100ユーザー

### 8.2 可用性
- Vercel/Supabaseの標準SLAに準拠
- 月間稼働率: 99.9%以上

### 8.3 運用要件
- バックアップ: Supabase標準（日次）
- ログ保持期間: 30日

---

## 9. 開発スケジュール

### Phase 1: 基礎開発（2週間）
- [ ] プロジェクト初期設定
- [ ] Supabase/Vercel環境構築
- [ ] 認証機能実装
- [ ] DB設計・マイグレーション
- [ ] 基本画面の作成

### Phase 2: 主要機能（3週間）
- [ ] 出退勤機能（位置情報なし）
- [ ] シフト提出・確認
- [ ] 従業員管理
- [ ] 基本的な管理者機能

### Phase 3: 位置情報・AI機能（2週間）
- [ ] 位置情報による打刻制限
- [ ] Gemini API連携
- [ ] AI自動シフト作成
- [ ] シフト手動調整機能

### Phase 4: 仕上げ（1週間）
- [ ] バグ修正
- [ ] UI/UX改善
- [ ] マニュアル作成
- [ ] 本番環境デプロイ

**総開発期間: 約8週間**

---

## 10. 制約事項

### 10.1 技術的制約
- 位置情報はHTTPS環境でのみ動作
- iOSのSafariでは位置情報に制限あり
- Gemini API利用上限あり（要確認）

### 10.2 運用制約
- 初期は単一店舗のみ対応
- 管理者アカウントは最小限に
- CSV出力は月次締め後を推奨

### 10.3 将来の拡張予定
- 多店舗対応
- 給与計算システム連携
- モバイルアプリ化
- 詳細な分析機能

---

## 11. 環境変数

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
GEMINI_API_KEY=your_gemini_key

# 位置情報設定
NEXT_PUBLIC_DEFAULT_CLOCK_RADIUS=50
```

---

## 12. 開発者向けメモ

### 命名規約
- DB: snake_case（例: `is_default`, `start_time`）
- フロント: camelCase（例: `isDefault`, `start`）
- APIでの相互変換はサーバー側で行う（型生成時は自動変換ルールを統一）

### セットアップ手順
```bash
# 1. リポジトリクローン
git clone [repository]

# 2. 依存関係インストール
npm install

# 3. Supabase CLIインストール
npm install -g supabase

# 4. Supabaseプロジェクト作成
supabase init

# 5. マイグレーション実行
supabase db push

# 6. 開発サーバー起動
npm run dev
```

### よく使うコマンド
```bash
# Supabase
supabase start          # ローカル環境起動
supabase db reset       # DB初期化
supabase gen types      # TypeScript型生成

# Next.js
npm run dev            # 開発サーバー
npm run build          # ビルド
npm run lint           # Linter実行
```

---

## 改訂履歴

| バージョン | 日付 | 変更内容 | 作成者 |
|-----------|------|---------|--------|
| 1.0 | 2024/XX/XX | 初版作成 | - |
| 1.1 | 2024/XX/XX | シフトルール設定の追加、シフト作成フローの詳細化、DB/API/UI更新 | - |