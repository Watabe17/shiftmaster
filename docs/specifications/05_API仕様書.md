# 05_API仕様書.md

## 概要
本文書では、ShiftMasterのAPI仕様について詳細に定義します。Next.js 14のApp Routerを使用し、Supabase Edge Functionsと組み合わせたREST API構成となっています。

## API設計原則
- **RESTful**: リソース指向のAPI設計
- **認証**: Supabase JWTトークンベース認証
- **レスポンス形式**: JSON統一
- **エラーハンドリング**: 標準HTTPステータスコード
- **バージョニング**: URLパス方式 (/api/v1/)
- **ドキュメント**: OpenAPI 3.0準拠

## ベースURL
```
開発環境: http://localhost:3000/api/v1
本番環境: https://your-domain.vercel.app/api/v1
```

## 認証・認可

### 認証方式
```typescript
// Authorizationヘッダー
Authorization: Bearer <supabase_jwt_token>

// レスポンス形式
interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: 'employee' | 'manager' | 'admin' | 'system_admin';
    store_id: string;
  };
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
```

### 認可レベル
- **employee**: 自分の情報のみアクセス可能
- **manager**: 同一店舗の従業員情報アクセス可能
- **admin**: 同一店舗の全情報アクセス可能
- **system_admin**: 全店舗情報アクセス可能

## 共通レスポンス形式

### 成功レスポンス
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### エラーレスポンス
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

## APIエンドポイント仕様

### 1. 認証・ユーザー管理

#### POST /api/v1/auth/signin
従業員招待トークンによるサインイン

**リクエスト**:
```typescript
interface SignInRequest {
  invitation_token: string;
  password: string;
  full_name: string;
  phone?: string;
}
```

**レスポンス**:
```typescript
interface SignInResponse {
  success: true;
  data: {
    user: UserProfile;
    employee: Employee;
    store: Store;
    access_token: string;
  };
}
```

#### POST /api/v1/auth/clock-in
位置情報付き出勤打刻

**リクエスト**:
```typescript
interface ClockInRequest {
  latitude: number;
  longitude: number;
  device_info?: string;
}
```

#### GET /api/v1/auth/me
現在のユーザー情報取得

### 2. 店舗管理

#### GET /api/v1/stores/:store_id
店舗情報取得

**レスポンス**:
```typescript
interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  business_hours: BusinessHours;
  settings: StoreSettings;
}

interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    is_closed?: boolean;
  };
}
```

#### PUT /api/v1/stores/:store_id
店舗情報更新

**権限**: admin以上

#### GET /api/v1/stores/:store_id/settings
店舗設定取得

#### PUT /api/v1/stores/:store_id/settings
店舗設定更新

**リクエスト**:
```typescript
interface StoreSettingsUpdate {
  auto_break_enabled?: boolean;
  auto_break_start_hours?: number;
  auto_break_duration_minutes?: number;
  overtime_threshold_minutes?: number;
  location_strict_mode?: boolean;
  notification_settings?: NotificationSettings;
}
```

### 3. 従業員管理

#### GET /api/v1/employees
従業員一覧取得

**クエリパラメータ**:
```typescript
interface EmployeeListQuery {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'invited';
  position_id?: string;
  search?: string;
}
```

**レスポンス**:
```typescript
interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  hire_date: string;
  position: Position;
  hourly_wage: number;
  monthly_limit_hours: number;
  social_insurance_enrolled: boolean;
  paid_leave_days: number;
  work_hours_stats: {
    current_month: number;
    remaining_hours: number;
    progress_percentage: number;
  };
}
```

#### POST /api/v1/employees
従業員招待

**権限**: manager以上

**リクエスト**:
```typescript
interface EmployeeInviteRequest {
  full_name: string;
  email?: string;
  phone?: string;
  position_id: string;
  hourly_wage: number;
  monthly_limit_hours?: number;
  role?: EmployeeRole;
}
```

**レスポンス**:
```typescript
interface EmployeeInviteResponse {
  success: true;
  data: {
    employee: Employee;
    invitation_url: string;
    qr_code_url: string;
    invitation_token: string;
  };
}
```

#### PUT /api/v1/employees/:employee_id
従業員情報更新

#### DELETE /api/v1/employees/:employee_id
従業員削除（論理削除）

#### POST /api/v1/employees/:employee_id/regenerate-qr
QRコード再生成

### 4. ポジション管理

#### GET /api/v1/positions
ポジション一覧取得

#### POST /api/v1/positions
ポジション作成

**リクエスト**:
```typescript
interface PositionCreateRequest {
  name: string;
  description?: string;
  hourly_wage?: number;
  color?: string;
}
```

#### PUT /api/v1/positions/:position_id
ポジション更新

#### DELETE /api/v1/positions/:position_id
ポジション削除

### 5. シフト管理

#### GET /api/v1/shift-periods
シフト期間一覧取得

#### POST /api/v1/shift-periods
シフト期間作成

**リクエスト**:
```typescript
interface ShiftPeriodCreateRequest {
  name: string;
  start_date: string;
  end_date: string;
  submission_deadline: string;
}
```

#### POST /api/v1/shift-requests
シフト希望提出

**リクエスト**:
```typescript
interface ShiftRequestSubmit {
  shift_period_id: string;
  preferences: ShiftPreference[];
}

interface ShiftPreference {
  date: string;
  available: boolean;
  preferred_start?: string;
  preferred_end?: string;
  priority?: 'high' | 'medium' | 'low';
  reason?: string;
}
```

#### POST /api/v1/shift-periods/:period_id/generate
AIシフト生成

**権限**: manager以上

**リクエスト**:
```typescript
interface ShiftGenerateRequest {
  settings: {
    min_staff_per_hour: number;
    max_consecutive_days: number;
    preferred_break_duration: number;
    priority_positions: string[];
  };
  constraints: {
    required_positions: {
      [position_id: string]: number;
    };
    business_requirements: string;
  };
}
```

#### GET /api/v1/shifts
シフト一覧取得

**クエリパラメータ**:
```typescript
interface ShiftListQuery {
  start_date: string;
  end_date: string;
  employee_id?: string;
  position_id?: string;
  status?: ShiftStatus;
}
```

#### PUT /api/v1/shifts/:shift_id
シフト更新

### 6. 勤怠管理

#### POST /api/v1/attendance/clock-in
出勤打刻

**リクエスト**:
```typescript
interface ClockInRequest {
  latitude: number;
  longitude: number;
  shift_id?: string;
}
```

#### POST /api/v1/attendance/clock-out
退勤打刻

**リクエスト**:
```typescript
interface ClockOutRequest {
  latitude: number;
  longitude: number;
  attendance_id: string;
}
```

#### GET /api/v1/attendance
勤怠記録取得

**クエリパラメータ**:
```typescript
interface AttendanceQuery {
  start_date: string;
  end_date: string;
  employee_id?: string;
  view?: 'daily' | 'monthly';
}
```

**レスポンス**:
```typescript
interface AttendanceRecord {
  id: string;
  employee: Employee;
  date: string;
  clock_in_time: string;
  clock_out_time: string;
  total_work_minutes: number;
  total_break_minutes: number;
  overtime_minutes: number;
  location_verified: boolean;
  status: AttendanceStatus;
  shift: Shift;
  edits: AttendanceEdit[];
}
```

#### PUT /api/v1/attendance/:attendance_id
勤怠記録修正

**権限**: manager以上

**リクエスト**:
```typescript
interface AttendanceEditRequest {
  clock_in_time?: string;
  clock_out_time?: string;
  break_minutes?: number;
  edit_reason: string;
}
```

#### GET /api/v1/attendance/export
勤怠データエクスポート

**クエリパラメータ**:
```typescript
interface AttendanceExportQuery {
  format: 'csv' | 'excel' | 'pdf';
  start_date: string;
  end_date: string;
  employee_ids?: string[];
}
```

### 7. AI・通知管理

#### POST /api/v1/ai/analyze-shift-requests
シフト希望の分析

**リクエスト**:
```typescript
interface ShiftAnalysisRequest {
  shift_period_id: string;
  analysis_type: 'coverage' | 'conflicts' | 'recommendations';
}
```

#### GET /api/v1/notifications
通知一覧取得

#### PUT /api/v1/notifications/:notification_id/read
通知既読更新

#### POST /api/v1/notifications/send
通知送信

**権限**: manager以上

### 8. 支払い・請求管理

#### GET /api/v1/billing/subscription
契約情報取得

#### POST /api/v1/billing/create-checkout-session
Stripe決済セッション作成

#### POST /api/v1/billing/webhook
Stripeウェブフック処理

## エラーコード一覧

```typescript
enum ErrorCode {
  // 認証・認可
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // バリデーション
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // ビジネスロジック
  LOCATION_OUT_OF_RANGE = 'LOCATION_OUT_OF_RANGE',
  ALREADY_CLOCKED_IN = 'ALREADY_CLOCKED_IN',
  SHIFT_NOT_FOUND = 'SHIFT_NOT_FOUND',
  EMPLOYEE_LIMIT_EXCEEDED = 'EMPLOYEE_LIMIT_EXCEEDED',
  
  // システム
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR'
}
```

## レート制限

```typescript
interface RateLimit {
  '/api/v1/auth/*': '10 requests per minute';
  '/api/v1/attendance/clock-*': '5 requests per minute';
  '/api/v1/ai/*': '20 requests per hour';
  'default': '100 requests per minute';
}
```

## WebSocket API（リアルタイム機能）

### 接続エンドポイント
```
wss://your-domain.vercel.app/api/ws
```

### イベント一覧
```typescript
interface WebSocketEvents {
  // 勤怠関連
  'attendance:clock_in': AttendanceRecord;
  'attendance:clock_out': AttendanceRecord;
  
  // シフト関連
  'shift:assigned': Shift;
  'shift:updated': Shift;
  
  // 通知関連
  'notification:new': Notification;
}
```

## SDK・クライアントライブラリ

### TypeScript SDK
```typescript
import { ShiftMasterClient } from '@/lib/api-client';

const client = new ShiftMasterClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  apiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

// 使用例
const employees = await client.employees.list({
  page: 1,
  limit: 20,
  status: 'active'
});
```

## テスト・デバッグ

### テストデータ
- 開発環境用のシードデータを提供
- Postmanコレクション提供
- OpenAPI仕様書でのSwagger UI

### ログ・監視
- リクエスト/レスポンスログ
- エラートラッキング（Sentry）
- パフォーマンス監視（Vercel Analytics）

## セキュリティ

### CORS設定
```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-domain.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};
```

### CSP設定
```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  connect-src 'self' https://*.supabase.co;
`;
```

## 関連ドキュメント
- 04_データモデル設計書.md
- 06_非機能要件定義書.md
- 07_テスト計画書.md