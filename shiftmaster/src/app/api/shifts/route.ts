import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// シフト一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const employeeId = searchParams.get('employeeId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')

    if (!storeId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 シフト一覧取得開始:', { storeId, employeeId, startDate, endDate, status })

    // 検索条件を構築
    const where: any = {
      storeId
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    // シフト一覧を取得
    const shifts = await prisma.shift.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true
          }
        },
        position: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        shiftPeriod: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    })

    console.log(`✅ シフト一覧取得成功: ${shifts.length}件`)

    return NextResponse.json({
      success: true,
      data: shifts
    })

  } catch (error) {
    console.error('❌ シフト一覧取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// シフト作成
export async function POST(request: NextRequest) {
  try {
    const {
      storeId,
      employeeId,
      shiftPeriodId,
      positionId,
      date,
      startTime,
      endTime,
      breakStartTime,
      breakEndTime,
      hourlyWage,
      notes,
      createdBy
    } = await request.json()

    if (!storeId || !employeeId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    console.log('🔍 シフト作成開始:', { employeeId, date, startTime, endTime })

    // シフトを作成
    const shift = await prisma.shift.create({
      data: {
        storeId,
        employeeId,
        shiftPeriodId,
        positionId,
        date: new Date(date),
        startTime: new Date(`2000-01-01T${startTime}`),
        endTime: new Date(`2000-01-01T${endTime}`),
        breakStartTime: breakStartTime ? new Date(`2000-01-01T${breakStartTime}`) : null,
        breakEndTime: breakEndTime ? new Date(`2000-01-01T${breakEndTime}`) : null,
        hourlyWage: hourlyWage ? parseFloat(hourlyWage) : null,
        notes,
        createdBy
      },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true
          }
        },
        position: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    })

    console.log('✅ シフト作成成功:', shift.id)

    return NextResponse.json({
      success: true,
      data: shift,
      message: 'シフトが正常に作成されました'
    })

  } catch (error) {
    console.error('❌ シフト作成エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// シフト更新
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      positionId,
      startTime,
      endTime,
      breakStartTime,
      breakEndTime,
      hourlyWage,
      notes,
      status
    } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'シフトIDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 シフト更新開始:', { id })

    // シフトを更新
    const shift = await prisma.shift.update({
      where: { id },
      data: {
        positionId,
        startTime: startTime ? new Date(`2000-01-01T${startTime}`) : undefined,
        endTime: endTime ? new Date(`2000-01-01T${endTime}`) : undefined,
        breakStartTime: breakStartTime ? new Date(`2000-01-01T${breakStartTime}`) : undefined,
        breakEndTime: breakEndTime ? new Date(`2000-01-01T${breakEndTime}`) : undefined,
        hourlyWage: hourlyWage ? parseFloat(hourlyWage) : undefined,
        notes,
        status
      },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true
          }
        },
        position: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    })

    console.log('✅ シフト更新成功:', shift.id)

    return NextResponse.json({
      success: true,
      data: shift,
      message: 'シフトが正常に更新されました'
    })

  } catch (error) {
    console.error('❌ シフト更新エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// シフト削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'シフトIDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 シフト削除開始:', { id })

    // シフトを削除
    await prisma.shift.delete({
      where: { id }
    })

    console.log('✅ シフト削除成功:', id)

    return NextResponse.json({
      success: true,
      message: 'シフトが正常に削除されました'
    })

  } catch (error) {
    console.error('❌ シフト削除エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
