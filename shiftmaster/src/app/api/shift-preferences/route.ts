import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// シフト希望一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const employeeId = searchParams.get('employeeId')
    const shiftPeriodId = searchParams.get('shiftPeriodId')
    const status = searchParams.get('status')

    if (!storeId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 シフト希望一覧取得開始:', { storeId, employeeId, shiftPeriodId, status })

    // 検索条件を構築
    const where: any = {
      employee: {
        storeId
      }
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (shiftPeriodId) {
      where.shiftPeriodId = shiftPeriodId
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    // シフト希望一覧を取得
    const preferences = await prisma.shiftRequest.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true
          }
        },
        shiftPeriod: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true
          }
        }
      },
      orderBy: [
        { submittedAt: 'desc' }
      ]
    })

    console.log(`✅ シフト希望一覧取得成功: ${preferences.length}件`)

    return NextResponse.json({
      success: true,
      data: preferences
    })

  } catch (error) {
    console.error('❌ シフト希望一覧取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// シフト希望提出
export async function POST(request: NextRequest) {
  try {
    const {
      employeeId,
      shiftPeriodId,
      requestData
    } = await request.json()

    if (!employeeId || !shiftPeriodId || !requestData) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    console.log('🔍 シフト希望提出開始:', { employeeId, shiftPeriodId })

    // 既存の希望提出をチェック
    const existingRequest = await prisma.shiftRequest.findFirst({
      where: {
        employeeId,
        shiftPeriodId
      }
    })

    let preference

    if (existingRequest) {
      // 既存の希望を更新
      preference = await prisma.shiftRequest.update({
        where: { id: existingRequest.id },
        data: {
          requestData,
          status: 'SUBMITTED',
          updatedAt: new Date()
        },
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              employeeCode: true
            }
          },
          shiftPeriod: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
      console.log('✅ シフト希望更新成功:', preference.id)
    } else {
      // 新しい希望を作成
      preference = await prisma.shiftRequest.create({
        data: {
          employeeId,
          shiftPeriodId,
          requestData,
          status: 'SUBMITTED'
        },
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              employeeCode: true
            }
          },
          shiftPeriod: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
      console.log('✅ シフト希望提出成功:', preference.id)
    }

    return NextResponse.json({
      success: true,
      data: preference,
      message: existingRequest ? 'シフト希望が更新されました' : 'シフト希望が提出されました'
    })

  } catch (error) {
    console.error('❌ シフト希望提出エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// シフト希望更新
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      requestData,
      status
    } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'シフト希望IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 シフト希望更新開始:', { id })

    // シフト希望を更新
    const preference = await prisma.shiftRequest.update({
      where: { id },
      data: {
        requestData,
        status,
        updatedAt: new Date()
      },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true
          }
        },
        shiftPeriod: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    console.log('✅ シフト希望更新成功:', preference.id)

    return NextResponse.json({
      success: true,
      data: preference,
      message: 'シフト希望が正常に更新されました'
    })

  } catch (error) {
    console.error('❌ シフト希望更新エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// シフト希望削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'シフト希望IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 シフト希望削除開始:', { id })

    // シフト希望を削除
    await prisma.shiftRequest.delete({
      where: { id }
    })

    console.log('✅ シフト希望削除成功:', id)

    return NextResponse.json({
      success: true,
      message: 'シフト希望が正常に削除されました'
    })

  } catch (error) {
    console.error('❌ シフト希望削除エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
