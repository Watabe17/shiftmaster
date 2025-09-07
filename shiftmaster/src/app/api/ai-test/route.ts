import { NextRequest, NextResponse } from 'next/server'
import { AIShiftGenerator } from '@/lib/ai-shift-generator'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

// AI接続テスト
export async function GET(request: NextRequest) {
  try {
    console.log('🤖 AI接続テスト開始')

    const aiGenerator = new AIShiftGenerator()
    
    // API接続テストを実行
    const isConnected = await aiGenerator.testConnection()
    
    if (isConnected) {
      console.log('✅ AI接続テスト成功')
      return NextResponse.json({
        success: true,
        message: 'AI接続テストが成功しました',
        timestamp: new Date().toISOString()
      })
    } else {
      console.log('❌ AI接続テスト失敗')
      return NextResponse.json({
        success: false,
        message: 'AI接続テストが失敗しました。APIキーを確認してください。',
        timestamp: new Date().toISOString()
      }, { status: 503 })
    }

  } catch (error: any) {
    console.error('❌ AI接続テストエラー:', error)
    return NextResponse.json({
      success: false,
      message: 'AI接続テスト中にエラーが発生しました',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// AIシフト生成テスト
export async function POST(request: NextRequest) {
  try {
    const { testData } = await request.json()
    
    console.log('🤖 AIシフト生成テスト開始')

    const aiGenerator = new AIShiftGenerator()
    
    // テスト用のデータ
    const employeePreferences = [
      {
        id: '1',
        employeeId: 'emp1',
        employeeName: '佐藤太郎',
        date: '2024-01-15',
        status: 'available' as const,
        preferredStartTime: '09:00',
        preferredEndTime: '17:00'
      },
      {
        id: '2',
        employeeId: 'emp2',
        employeeName: '鈴木花子',
        date: '2024-01-15',
        status: 'available' as const,
        preferredStartTime: '10:00',
        preferredEndTime: '18:00'
      }
    ]

    const positionRequirements = [
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

    const shiftRules = {
      maxConsecutiveDays: 5,
      minRestHours: 8,
      preferredShiftPattern: 'mixed' as const,
      avoidOvertime: true,
      balanceWorkload: true,
      considerPreferences: true,
      aiModel: 'gemini-1.5-flash' as const,
      temperature: 0.7
    }

    // AIシフト生成を実行
    const result = await aiGenerator.generateShifts(
      '2024-01',
      employeePreferences,
      positionRequirements,
      shiftRules
    )

    console.log('✅ AIシフト生成テスト成功:', result.shifts.length, '件のシフトを生成')

    return NextResponse.json({
      success: true,
      message: 'AIシフト生成テストが成功しました',
      data: {
        generatedShifts: result.shifts.length,
        summary: result.summary,
        warnings: result.warnings,
        suggestions: result.suggestions
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ AIシフト生成テストエラー:', error)
    
    return NextResponse.json({
      success: false,
      message: 'AIシフト生成テスト中にエラーが発生しました',
      error: error.message,
      errorType: error.type || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
