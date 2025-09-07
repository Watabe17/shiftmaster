import { NextRequest, NextResponse } from 'next/server'
import { AIShiftGenerator, EmployeePreference, PositionRequirement, ShiftRule } from '@/lib/ai-shift-generator'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

// AIシフト生成
export async function POST(request: NextRequest) {
  try {
    const { 
      month, 
      employeePreferences, 
      positionRequirements, 
      shiftRules,
      storeId 
    } = await request.json()

    if (!month || !employeePreferences || !positionRequirements || !shiftRules || !storeId) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      )
    }

    console.log('🤖 AIシフト生成開始:', { month, storeId })

    // 店舗情報を取得
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        storeSettings: true
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    // AIシフト生成器を初期化
    const aiGenerator = new AIShiftGenerator()

    // API接続テスト
    const isConnected = await aiGenerator.testConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: 'AIサービスに接続できません。APIキーを確認してください。' },
        { status: 503 }
      )
    }

    // 既存のシフトを取得
    const existingShifts = await prisma.shift.findMany({
      where: {
        storeId: storeId,
        date: {
          gte: new Date(`${month}-01`),
          lt: new Date(`${month}-31`)
        }
      },
      include: {
        employee: true,
        position: true
      }
    })

    // 既存シフトをAI生成器の形式に変換
    const existingShiftsForAI = existingShifts.map(shift => ({
      id: shift.id,
      date: shift.date.toISOString().split('T')[0],
      employeeId: shift.employeeId,
      employeeName: shift.employee.fullName,
      positionId: shift.positionId || '',
      positionName: shift.position?.name || '',
      startTime: shift.startTime.toString().slice(0, 5),
      endTime: shift.endTime.toString().slice(0, 5),
      breakMinutes: 60,
      confidence: 1.0,
      reasoning: '既存シフト'
    }))

    // AIシフト生成を実行
    const result = await aiGenerator.generateShifts(
      month,
      employeePreferences,
      positionRequirements,
      shiftRules,
      existingShiftsForAI
    )

    // 生成結果をデータベースに保存
    const shiftPeriod = await prisma.shiftPeriod.create({
      data: {
        storeId: storeId,
        name: `${month}月シフト`,
        startDate: new Date(`${month}-01`),
        endDate: new Date(`${month}-31`),
        status: 'GENERATING',
        createdBy: 'system' // TODO: 実際のユーザーIDに置き換え
      }
    })

    // AI生成履歴を保存
    await prisma.aiShiftGeneration.create({
      data: {
        shiftPeriodId: shiftPeriod.id,
        storeId: storeId,
        generationInput: {
          month,
          employeePreferences,
          positionRequirements,
          shiftRules
        },
        generationOutput: result,
        status: 'COMPLETED',
        createdBy: 'system' // TODO: 実際のユーザーIDに置き換え
      }
    })

    console.log('✅ AIシフト生成完了:', result.shifts.length, '件のシフトを生成')

    return NextResponse.json({
      success: true,
      data: result,
      shiftPeriodId: shiftPeriod.id
    })

  } catch (error: any) {
    console.error('❌ AIシフト生成エラー:', error)
    
    // エラーの種類に応じて適切なレスポンスを返す
    if (error.type === 'API_KEY_INVALID') {
      return NextResponse.json(
        { error: 'AI APIキーが無効です。設定を確認してください。' },
        { status: 401 }
      )
    } else if (error.type === 'QUOTA_EXCEEDED') {
      return NextResponse.json(
        { error: 'AI APIの利用制限に達しました。しばらく時間をおいて再試行してください。' },
        { status: 429 }
      )
    } else if (error.type === 'RATE_LIMIT') {
      return NextResponse.json(
        { error: 'リクエストが多すぎます。しばらく時間をおいて再試行してください。' },
        { status: 429 }
      )
    } else {
      return NextResponse.json(
        { error: 'シフト生成に失敗しました。しばらく時間をおいて再試行してください。' },
        { status: 500 }
      )
    }
  }
}

// AIシフト生成履歴取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const month = searchParams.get('month')

    if (!storeId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    const whereClause: any = { storeId }
    if (month) {
      whereClause.createdAt = {
        gte: new Date(`${month}-01`),
        lt: new Date(`${month}-31`)
      }
    }

    const generations = await prisma.aiShiftGeneration.findMany({
      where: whereClause,
      include: {
        shiftPeriod: true,
        createdByEmployee: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: generations
    })

  } catch (error) {
    console.error('❌ AIシフト生成履歴取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
