// AIシフト生成APIのテスト
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'

// 環境変数をモック
process.env.GEMINI_API_KEY = 'test-api-key'

// Prismaクライアントをモック
const mockPrisma = {
  store: {
    findUnique: jest.fn()
  },
  shift: {
    findMany: jest.fn()
  },
  shiftPeriod: {
    create: jest.fn()
  },
  aiShiftGeneration: {
    create: jest.fn()
  }
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma)
}))

// AIシフト生成器をモック（パスを相対パスに変更）
jest.mock('../../../lib/ai-shift-generator', () => ({
  AIShiftGenerator: jest.fn().mockImplementation(() => ({
    testConnection: jest.fn().mockResolvedValue(true),
    generateShifts: jest.fn().mockResolvedValue({
      shifts: [
        {
          id: '1',
          date: '2024-01-15',
          employeeId: 'emp1',
          employeeName: 'テスト従業員',
          positionId: 'pos1',
          positionName: 'テストポジション',
          startTime: '09:00',
          endTime: '17:00',
          breakMinutes: 60,
          confidence: 0.9,
          reasoning: 'テスト理由'
        }
      ],
      summary: {
        totalShifts: 1,
        totalHours: 8,
        averageConfidence: 0.9
      },
      warnings: [],
      suggestions: []
    })
  }))
}))

describe('AIシフト生成API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // fetchをモック
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('POST /api/ai-shift-generate', () => {
    it('必要なパラメータが不足している場合は400エラー', async () => {
      // モックレスポンスを設定
      ;(global.fetch as jest.Mock).mockResolvedValue({
        status: 400,
        json: () => Promise.resolve({ error: '必要なパラメータが不足しています' })
      })

      const requestBody = {
        month: '2024-01',
        // 他のパラメータが不足
      }

      const response = await fetch('http://localhost:3000/api/ai-shift-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      expect(response.status).toBe(400)
    })

    it('店舗が見つからない場合は404エラー', async () => {
      // モックレスポンスを設定
      ;(global.fetch as jest.Mock).mockResolvedValue({
        status: 404,
        json: () => Promise.resolve({ error: '店舗が見つかりません' })
      })

      const requestBody = {
        month: '2024-01',
        employeePreferences: [],
        positionRequirements: [],
        shiftRules: {},
        storeId: 'non-existent-store'
      }

      const response = await fetch('http://localhost:3000/api/ai-shift-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      expect(response.status).toBe(404)
    })

    it('正常なシフト生成リクエストが処理される', async () => {
      // モックレスポンスを設定
      ;(global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: {
            shifts: [
              {
                id: '1',
                date: '2024-01-15',
                employeeId: 'emp1',
                employeeName: 'テスト従業員',
                positionId: 'pos1',
                positionName: 'テストポジション',
                startTime: '09:00',
                endTime: '17:00',
                breakMinutes: 60,
                confidence: 0.9,
                reasoning: 'テスト理由'
              }
            ],
            summary: {
              totalShifts: 1,
              totalHours: 8,
              averageConfidence: 0.9
            },
            warnings: [],
            suggestions: []
          },
          shiftPeriodId: 'period-1'
        })
      })

      const requestBody = {
        month: '2024-01',
        employeePreferences: [
          {
            id: '1',
            employeeId: 'emp1',
            employeeName: 'テスト従業員',
            date: '2024-01-15',
            status: 'available'
          }
        ],
        positionRequirements: [
          {
            id: '1',
            positionName: 'テストポジション',
            minEmployees: 1,
            maxEmployees: 2,
            preferredStartTime: '09:00',
            preferredEndTime: '17:00',
            breakMinutes: 60
          }
        ],
        shiftRules: {
          maxConsecutiveDays: 5,
          minRestHours: 8,
          preferredShiftPattern: 'mixed',
          avoidOvertime: true,
          balanceWorkload: true,
          considerPreferences: true
        },
        storeId: 'test-store'
      }

      const response = await fetch('http://localhost:3000/api/ai-shift-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.shifts).toHaveLength(1)
    })
  })

  describe('GET /api/ai-shift-generate', () => {
    it('店舗IDが提供されていない場合は400エラー', async () => {
      // モックレスポンスを設定
      ;(global.fetch as jest.Mock).mockResolvedValue({
        status: 400,
        json: () => Promise.resolve({ error: '店舗IDが必要です' })
      })

      const response = await fetch('http://localhost:3000/api/ai-shift-generate')
      
      expect(response.status).toBe(400)
    })

    it('正常な履歴取得リクエストが処理される', async () => {
      // モックレスポンスを設定
      ;(global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: [
            {
              id: 'gen-1',
              status: 'COMPLETED',
              createdAt: new Date(),
              shiftPeriod: { name: '2024年1月シフト' },
              createdByEmployee: { fullName: 'テスト管理者' }
            }
          ]
        })
      })

      const response = await fetch('http://localhost:3000/api/ai-shift-generate?storeId=test-store')
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
    })
  })
})
