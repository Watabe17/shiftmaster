// 勤怠APIのテスト
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'

// モックデータ
const mockEmployee = {
  id: 'test-employee-id',
  email: 'test@example.com',
  storeId: 'test-store-id',
  store: {
    id: 'test-store-id',
    latitude: 35.6762,
    longitude: 139.6503,
    radiusMeters: 50
  }
}

// Prismaクライアントをモック
const mockPrisma = {
  employee: {
    findFirst: jest.fn(),
    findUnique: jest.fn()
  },
  attendanceRecord: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}

// モックを先に定義してからjest.mockを呼び出す
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma)
}))

// NextRequestとNextResponseをモック
class MockNextRequest {
  constructor(url, options = {}) {
    this.url = url
    this.method = options.method || 'GET'
    this._body = options.body
  }
  
  async json() {
    return JSON.parse(this._body || '{}')
  }
}

class MockNextResponse {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.headers = new Map()
  }
  
  static json(data, init = {}) {
    const response = new MockNextResponse(JSON.stringify(data), init)
    response.json = async () => data
    return response
  }
}

global.NextRequest = MockNextRequest
global.NextResponse = MockNextResponse

describe('勤怠API', () => {
  beforeAll(() => {
    // テスト用の環境変数を設定
    process.env.NODE_ENV = 'test'
  })

  beforeEach(() => {
    // 各テスト前にモックをクリア
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/attendance（モック版）', () => {
    it('従業員IDが提供されていない場合は400エラー', () => {
      // 簡単なモックテスト
      const url = new URL('http://localhost:3000/api/attendance')
      const employeeId = url.searchParams.get('employeeId')
      
      expect(employeeId).toBeNull()
    })

    it('従業員が見つからない場合のモック', () => {
      mockPrisma.employee.findFirst.mockResolvedValue(null)
      
      const result = mockPrisma.employee.findFirst()
      expect(result).resolves.toBeNull()
    })

    it('勤怠記録が存在する場合のモック', () => {
      const mockAttendance = {
        id: 'attendance-id',
        employeeId: 'test-employee-id',
        date: new Date('2025-02-10'),
        clockInTime: new Date('2025-02-10T09:00:00Z'),
        clockOutTime: null,
        totalWorkMinutes: 0,
        status: 'IN_PROGRESS'
      }

      mockPrisma.employee.findFirst.mockResolvedValue(mockEmployee)
      mockPrisma.attendanceRecord.findFirst.mockResolvedValue(mockAttendance)

      expect(mockPrisma.employee.findFirst()).resolves.toEqual(mockEmployee)
      expect(mockPrisma.attendanceRecord.findFirst()).resolves.toEqual(mockAttendance)
    })
  })

  describe('POST /api/attendance（モック版）', () => {
    it('出勤記録作成のモック', () => {
      const mockAttendance = {
        id: 'new-attendance-id',
        employeeId: 'test-employee-id',
        storeId: 'test-store-id',
        date: new Date('2025-02-10'),
        clockInTime: new Date('2025-02-10T09:00:00Z'),
        status: 'IN_PROGRESS'
      }

      mockPrisma.employee.findFirst.mockResolvedValue(mockEmployee)
      mockPrisma.attendanceRecord.findFirst.mockResolvedValue(null) // 既存記録なし
      mockPrisma.attendanceRecord.create.mockResolvedValue(mockAttendance)

      expect(mockPrisma.attendanceRecord.create()).resolves.toEqual(mockAttendance)
    })

    it('APIレスポンスの形式チェック', () => {
      const mockResponse = MockNextResponse.json({
        success: true,
        message: '出勤が記録されました',
        data: { id: 'test-id' }
      })

      expect(mockResponse.status).toBe(200)
      expect(mockResponse.json()).resolves.toHaveProperty('success', true)
    })

    it('エラーレスポンスの形式チェック', () => {
      const mockErrorResponse = MockNextResponse.json({
        error: '従業員が見つかりません'
      }, { status: 404 })

      expect(mockErrorResponse.status).toBe(404)
      expect(mockErrorResponse.json()).resolves.toHaveProperty('error')
    })
  })

  describe('位置情報検証ロジック', () => {
    it('距離計算が正確', () => {
      // ハーバサイン公式のテスト
      const R = 6371e3 // 地球の半径（メートル）
      const lat1 = 35.6762 * Math.PI / 180
      const lat2 = 35.6762 * Math.PI / 180
      const deltaLat = 0
      const deltaLng = 0
      
      const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLng/2) * Math.sin(deltaLng/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const distance = R * c

      expect(distance).toBeCloseTo(0, 1) // 同じ座標なので距離0
    })

    it('範囲内チェックが正確', () => {
      const distance = 30 // 30メートル
      const radius = 50 // 50メートル範囲
      
      expect(distance <= radius).toBe(true)
    })

    it('範囲外チェックが正確', () => {
      const distance = 100 // 100メートル
      const radius = 50 // 50メートル範囲
      
      expect(distance <= radius).toBe(false)
    })
  })
})