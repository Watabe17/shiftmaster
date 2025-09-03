// AIシフト生成のテスト用ユーティリティ
// 実際のGemini APIを使用せずにテストができる

import { 
  EmployeePreference, 
  PositionRequirement, 
  ShiftRule, 
  GeneratedShift,
  AIGenerationResult 
} from './ai-shift-generator'

/**
 * テスト用のモックシフト生成
 * Gemini APIが利用できない場合のフォールバック機能
 */
export class MockAIShiftGenerator {
  /**
   * モックシフトを生成
   */
  static generateMockShifts(
    month: string,
    employeePreferences: EmployeePreference[],
    positionRequirements: PositionRequirement[],
    shiftRules: ShiftRule
  ): AIGenerationResult {
    console.log('モックシフト生成開始:', { month, employeePreferences, positionRequirements, shiftRules })
    
    const shifts: GeneratedShift[] = []
    const daysInMonth = this.getDaysInMonth(month)
    
    // 各日についてシフトを生成
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${month}-${String(day).padStart(2, '0')}`
      
      // 各ポジションに必要人数を配置
      positionRequirements.forEach(req => {
        const availableEmployees = this.getAvailableEmployees(
          employeePreferences, 
          mockEmployees, 
          date, 
          req.id
        )
        
        const requiredCount = Math.min(req.minEmployees, availableEmployees.length)
        
        for (let i = 0; i < requiredCount; i++) {
          if (availableEmployees[i]) {
            shifts.push({
              id: `mock-${date}-${req.id}-${i}`,
              date,
              employeeId: availableEmployees[i].id,
              employeeName: availableEmployees[i].name,
              positionId: req.id,
              positionName: req.positionName,
              startTime: req.preferredStartTime,
              endTime: req.preferredEndTime,
              breakMinutes: req.breakMinutes,
              confidence: 0.6 + (Math.random() * 0.3), // 0.6-0.9の範囲
              reasoning: 'モック生成（AI利用不可）'
            })
          }
        }
      })
    }
    
    // サマリー情報を生成
    const summary = this.generateMockSummary(shifts, employeePreferences)
    const warnings = this.generateMockWarnings(shifts, positionRequirements)
    const suggestions = this.generateMockSuggestions(shifts, shiftRules)
    
    return {
      shifts,
      summary,
      warnings,
      suggestions
    }
  }
  
  /**
   * 月の日数を取得
   */
  private static getDaysInMonth(month: string): number {
    const [year, monthNum] = month.split('-').map(Number)
    return new Date(year, monthNum, 0).getDate()
  }
  
  /**
   * 利用可能な従業員を取得
   */
  private static getAvailableEmployees(
    preferences: EmployeePreference[],
    employees: any[],
    date: string,
    positionId: string
  ): any[] {
    return employees.filter(emp => {
      // ポジションが一致するかチェック
      if (!emp.positions.includes(positionId)) {
        return false
      }
      
      // その日の希望をチェック
      const preference = preferences.find(p => 
        p.employeeId === emp.id && p.date === date
      )
      
      if (!preference) {
        return true // 希望未提出の場合は利用可能
      }
      
      return preference.status !== 'unavailable'
    })
  }
  
  /**
   * モックサマリーを生成
   */
  private static generateMockSummary(shifts: GeneratedShift[], preferences: EmployeePreference[]): any {
    const totalShifts = shifts.length
    const averageConfidence = shifts.reduce((sum, shift) => sum + shift.confidence, 0) / totalShifts
    
    return {
      totalShifts,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      ruleCompliance: 75, // 固定値
      preferenceSatisfaction: 70 // 固定値
    }
  }
  
  /**
   * モック警告を生成
   */
  private static generateMockWarnings(shifts: GeneratedShift[], requirements: PositionRequirement[]): string[] {
    const warnings: string[] = []
    
    // ポジション別の人数チェック
    requirements.forEach(req => {
      const dailyShifts = shifts.filter(s => s.positionId === req.id)
      const dateGroups = this.groupByDate(dailyShifts)
      
      dateGroups.forEach((shiftsForDate, date) => {
        if (shiftsForDate.length < req.minEmployees) {
          warnings.push(`${date}: ${req.positionName}の人数が不足しています (必要: ${req.minEmployees}名, 現在: ${shiftsForDate.length}名)`)
        }
        if (shiftsForDate.length > req.maxEmployees) {
          warnings.push(`${date}: ${req.positionName}の人数が超過しています (最大: ${req.maxEmployees}名, 現在: ${shiftsForDate.length}名)`)
        }
      })
    })
    
    return warnings
  }
  
  /**
   * モック提案を生成
   */
  private static generateMockSuggestions(shifts: GeneratedShift[], rules: ShiftRule): string[] {
    const suggestions: string[] = []
    
    suggestions.push('AI生成が利用できないため、基本的なルールに基づいてシフトを生成しました')
    suggestions.push('必要に応じて手動で調整してください')
    
    if (rules.maxConsecutiveDays < 7) {
      suggestions.push('連続勤務日数を調整して、より柔軟なシフト作成を検討してください')
    }
    
    if (rules.minRestHours < 11) {
      suggestions.push('労働基準法に基づく休息時間の確保を検討してください')
    }
    
    return suggestions
  }
  
  /**
   * 日付別にグループ化
   */
  private static groupByDate(shifts: GeneratedShift[]): Map<string, GeneratedShift[]> {
    const groups = new Map<string, GeneratedShift[]>()
    shifts.forEach(shift => {
      if (!groups.has(shift.date)) {
        groups.set(shift.date, [])
      }
      groups.get(shift.date)!.push(shift)
    })
    return groups
  }
}

/**
 * テスト用のサンプルデータ
 */
export const mockEmployees = [
  {
    id: 'e1',
    name: '佐藤 太郎',
    positions: ['hall', 'cashier'],
    employment_type: 'full_time',
    monthly_limit: 160,
    monthly_current: 145
  },
  {
    id: 'e2',
    name: '鈴木 花子',
    positions: ['kitchen', 'manager'],
    employment_type: 'full_time',
    monthly_limit: 160,
    monthly_current: 152
  },
  {
    id: 'e3',
    name: '田中 一郎',
    positions: ['hall'],
    employment_type: 'part_time',
    monthly_limit: 120,
    monthly_current: 98
  },
  {
    id: 'e4',
    name: '高橋 美咲',
    positions: ['kitchen'],
    employment_type: 'part_time',
    monthly_limit: 120,
    monthly_current: 85
  },
  {
    id: 'e5',
    name: '伊藤 健太',
    positions: ['cashier', 'hall'],
    employment_type: 'part_time',
    monthly_limit: 120,
    monthly_current: 92
  }
]

export const mockShiftRequests = [
  {
    id: 'r1',
    employeeId: 'e1',
    employeeName: '佐藤 太郎',
    date: '2025-02-01',
    status: 'available' as const,
    preferredStartTime: '09:00',
    preferredEndTime: '17:00'
  },
  {
    id: 'r2',
    employeeId: 'e2',
    employeeName: '鈴木 花子',
    date: '2025-02-01',
    status: 'available' as const,
    preferredStartTime: '10:00',
    preferredEndTime: '18:00'
  },
  {
    id: 'r3',
    employeeId: 'e3',
    employeeName: '田中 一郎',
    date: '2025-02-01',
    status: 'unavailable' as const
  },
  {
    id: 'r4',
    employeeId: 'e4',
    employeeName: '高橋 美咲',
    date: '2025-02-01',
    status: 'available' as const,
    preferredStartTime: '11:00',
    preferredEndTime: '19:00'
  },
  {
    id: 'r5',
    employeeId: 'e5',
    employeeName: '伊藤 健太',
    date: '2025-02-01',
    status: 'preferred' as const,
    preferredStartTime: '12:00',
    preferredEndTime: '20:00'
  }
]

export const mockPositionRequirements = [
  {
    id: 'kitchen',
    positionName: 'キッチン',
    minEmployees: 1,
    maxEmployees: 3,
    preferredStartTime: '09:00',
    preferredEndTime: '21:00',
    breakMinutes: 60
  },
  {
    id: 'hall',
    positionName: 'ホール',
    minEmployees: 2,
    maxEmployees: 4,
    preferredStartTime: '09:00',
    preferredEndTime: '21:00',
    breakMinutes: 60
  },
  {
    id: 'cashier',
    positionName: 'レジ',
    minEmployees: 1,
    maxEmployees: 2,
    preferredStartTime: '09:00',
    preferredEndTime: '21:00',
    breakMinutes: 60
  }
]

export const mockShiftRules = {
  maxConsecutiveDays: 5,
  minRestHours: 11,
  preferredShiftPattern: 'mixed' as const,
  avoidOvertime: true,
  balanceWorkload: true,
  considerPreferences: true
}

/**
 * テスト実行関数
 */
export function runMockTest() {
  console.log('モックAIシフト生成テスト開始')
  
  const result = MockAIShiftGenerator.generateMockShifts(
    '2025-02',
    mockShiftRequests,
    mockPositionRequirements,
    mockShiftRules
  )
  
  console.log('生成結果:', result)
  console.log(`生成されたシフト数: ${result.shifts.length}`)
  console.log(`警告数: ${result.warnings.length}`)
  console.log(`提案数: ${result.suggestions.length}`)
  
  return result
}


