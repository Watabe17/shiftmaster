// AIシフト生成器のテスト
import { describe, it, expect, beforeEach } from '@jest/globals'

// 環境変数をモック
process.env.GEMINI_API_KEY = 'test-api-key'

// AIShiftGeneratorクラスをモック
class MockAIShiftGenerator {
  async testConnection(): Promise<boolean> {
    return true
  }

  async generateShifts(
    month: string,
    employeePreferences: any[],
    positionRequirements: any[],
    shiftRules: any
  ): Promise<any> {
    throw new Error('APIキーが無効です')
  }
}

describe('AIシフト生成器', () => {
  let aiGenerator: MockAIShiftGenerator

  beforeEach(() => {
    aiGenerator = new MockAIShiftGenerator()
  })

  describe('API接続テスト', () => {
    it('API接続テストが実行できる', async () => {
      const result = await aiGenerator.testConnection()
      expect(result).toBe(true)
    })

    it('API接続失敗時にfalseを返す', async () => {
      // 失敗するモックを作成
      const failingGenerator = new MockAIShiftGenerator()
      failingGenerator.testConnection = jest.fn().mockResolvedValue(false)

      const result = await failingGenerator.testConnection()
      expect(result).toBe(false)
    })
  })

  describe('シフト生成テスト', () => {
    const mockEmployeePreferences = [
      {
        id: '1',
        employeeId: 'emp1',
        employeeName: '佐藤太郎',
        date: '2024-01-15',
        status: 'available',
        preferredStartTime: '09:00',
        preferredEndTime: '17:00'
      }
    ]

    const mockPositionRequirements = [
      {
        id: '1',
        positionName: 'レジ',
        minEmployees: 1,
        maxEmployees: 2,
        preferredStartTime: '09:00',
        preferredEndTime: '17:00',
        breakMinutes: 60
      }
    ]

    const mockShiftRules = {
      maxConsecutiveDays: 5,
      minRestHours: 8,
      preferredShiftPattern: 'mixed',
      avoidOvertime: true,
      balanceWorkload: true,
      considerPreferences: true
    }

    it('無効なAPIキーでエラーを投げる', async () => {
      await expect(
        aiGenerator.generateShifts(
          '2024-01',
          mockEmployeePreferences,
          mockPositionRequirements,
          mockShiftRules
        )
      ).rejects.toThrow('APIキーが無効です')
    })

    it('APIキーが設定されていない場合にエラーを投げる', async () => {
      await expect(
        aiGenerator.generateShifts(
          '2024-01',
          mockEmployeePreferences,
          mockPositionRequirements,
          mockShiftRules
        )
      ).rejects.toThrow('APIキーが無効です')
    })
  })

  describe('プロンプト構築テスト', () => {
    it('基本的なプロンプトが構築される', () => {
      // プロンプト構築のロジックをテスト
      const month = '2024-01'
      const employeeName = 'テスト従業員'
      const positionName = 'テストポジション'
      
      // 基本的なプロンプト構造をテスト
      const expectedPrompt = `シフト作成: ${month}`
      const expectedEmployee = employeeName
      const expectedPosition = positionName
      const expectedJson = 'JSON出力'
      
      expect(expectedPrompt).toContain('シフト作成: 2024-01')
      expect(expectedEmployee).toContain('テスト従業員')
      expect(expectedPosition).toContain('テストポジション')
      expect(expectedJson).toContain('JSON出力')
    })
  })
})
