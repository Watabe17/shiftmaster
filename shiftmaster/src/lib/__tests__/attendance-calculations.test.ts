// 勤怠計算のテスト
import { describe, it, expect } from '@jest/globals'

// 勤務時間計算関数
function calculateWorkingHours(
  clockIn: Date, 
  clockOut: Date, 
  breakMinutes: number = 0
): {
  totalMinutes: number
  workMinutes: number
  overtimeMinutes: number
  isOvertime: boolean
} {
  const totalMinutes = Math.round((clockOut.getTime() - clockIn.getTime()) / (1000 * 60))
  const workMinutes = totalMinutes - breakMinutes
  const overtimeMinutes = Math.max(0, workMinutes - 480) // 8時間 = 480分
  const isOvertime = workMinutes > 480

  return {
    totalMinutes,
    workMinutes,
    overtimeMinutes,
    isOvertime
  }
}

// 残業時間計算関数
function calculateOvertime(workMinutes: number, thresholdMinutes: number = 480): number {
  return Math.max(0, workMinutes - thresholdMinutes)
}

// 勤務時間フォーマット関数
function formatWorkTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}時間${mins}分`
}

describe('勤怠計算', () => {
  describe('calculateWorkingHours', () => {
    it('標準勤務時間（8時間）の計算が正確', () => {
      const clockIn = new Date('2025-02-10T09:00:00Z')
      const clockOut = new Date('2025-02-10T18:00:00Z')
      const breakMinutes = 60
      
      const result = calculateWorkingHours(clockIn, clockOut, breakMinutes)
      
      expect(result.totalMinutes).toBe(540) // 9時間
      expect(result.workMinutes).toBe(480) // 8時間
      expect(result.overtimeMinutes).toBe(0)
      expect(result.isOvertime).toBe(false)
    })

    it('残業時間の計算が正確', () => {
      const clockIn = new Date('2025-02-10T09:00:00Z')
      const clockOut = new Date('2025-02-10T19:30:00Z')
      const breakMinutes = 60
      
      const result = calculateWorkingHours(clockIn, clockOut, breakMinutes)
      
      expect(result.totalMinutes).toBe(630) // 10.5時間
      expect(result.workMinutes).toBe(570) // 9.5時間
      expect(result.overtimeMinutes).toBe(90) // 1.5時間
      expect(result.isOvertime).toBe(true)
    })

    it('休憩なしの場合の計算が正確', () => {
      const clockIn = new Date('2025-02-10T09:00:00Z')
      const clockOut = new Date('2025-02-10T17:00:00Z')
      const breakMinutes = 0
      
      const result = calculateWorkingHours(clockIn, clockOut, breakMinutes)
      
      expect(result.totalMinutes).toBe(480) // 8時間
      expect(result.workMinutes).toBe(480) // 8時間
      expect(result.overtimeMinutes).toBe(0)
      expect(result.isOvertime).toBe(false)
    })

    it('日をまたぐ勤務の計算が正確', () => {
      const clockIn = new Date('2025-02-10T22:00:00Z')
      const clockOut = new Date('2025-02-11T06:00:00Z')
      const breakMinutes = 60
      
      const result = calculateWorkingHours(clockIn, clockOut, breakMinutes)
      
      expect(result.totalMinutes).toBe(480) // 8時間
      expect(result.workMinutes).toBe(420) // 7時間
      expect(result.overtimeMinutes).toBe(0)
      expect(result.isOvertime).toBe(false)
    })

    it('短時間勤務の計算が正確', () => {
      const clockIn = new Date('2025-02-10T09:00:00Z')
      const clockOut = new Date('2025-02-10T12:00:00Z')
      const breakMinutes = 0
      
      const result = calculateWorkingHours(clockIn, clockOut, breakMinutes)
      
      expect(result.totalMinutes).toBe(180) // 3時間
      expect(result.workMinutes).toBe(180) // 3時間
      expect(result.overtimeMinutes).toBe(0)
      expect(result.isOvertime).toBe(false)
    })
  })

  describe('calculateOvertime', () => {
    it('標準時間内は残業なし', () => {
      const result = calculateOvertime(480) // 8時間
      expect(result).toBe(0)
    })

    it('8時間30分は30分の残業', () => {
      const result = calculateOvertime(510) // 8.5時間
      expect(result).toBe(30)
    })

    it('10時間は2時間の残業', () => {
      const result = calculateOvertime(600) // 10時間
      expect(result).toBe(120)
    })

    it('カスタム閾値での計算が正確', () => {
      const result = calculateOvertime(500, 400) // 6時間40分、閾値6時間40分
      expect(result).toBe(100) // 1時間40分の残業
    })
  })

  describe('formatWorkTime', () => {
    it('整数時間のフォーマットが正確', () => {
      expect(formatWorkTime(480)).toBe('8時間0分')
      expect(formatWorkTime(600)).toBe('10時間0分')
    })

    it('分を含む時間のフォーマットが正確', () => {
      expect(formatWorkTime(510)).toBe('8時間30分')
      expect(formatWorkTime(135)).toBe('2時間15分')
    })

    it('0分のフォーマットが正確', () => {
      expect(formatWorkTime(0)).toBe('0時間0分')
    })

    it('60分未満のフォーマットが正確', () => {
      expect(formatWorkTime(30)).toBe('0時間30分')
      expect(formatWorkTime(45)).toBe('0時間45分')
    })
  })
})
