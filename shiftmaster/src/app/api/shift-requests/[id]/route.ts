import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// シフト申請詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log('🔍 シフト申請詳細取得開始:', { id })

    const shiftRequest = await prisma.shiftRequest.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true
          }
        },
        preferences: {
          orderBy: {
            date: 'asc'
          }
        }
      }
    })

    if (!shiftRequest) {
      return NextResponse.json(
        { error: 'シフト申請が見つかりません' },
        { status: 404 }
      )
    }

    console.log('✅ シフト申請詳細取得成功:', shiftRequest.id)

    return NextResponse.json({
      success: true,
      data: shiftRequest
    })

  } catch (error) {
    console.error('❌ シフト申請詳細取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// シフト申請更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updateData = await request.json()

    console.log('🔍 シフト申請更新開始:', { id, updateData })

    // 更新可能なフィールドのみを抽出
    const {
      preferences,
      notes,
      status
    } = updateData

    // シフト申請の存在確認
    const existingRequest = await prisma.shiftRequest.findUnique({
      where: { id }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'シフト申請が見つかりません' },
        { status: 404 }
      )
    }

    // シフト申請を更新
    const updatedRequest = await prisma.shiftRequest.update({
      where: { id },
      data: {
        ...(preferences && {
          preferences: {
            deleteMany: {},
            create: preferences.map((pref: any) => ({
              date: new Date(pref.date),
              available: pref.available,
              preferredStartTime: pref.preferredStartTime || null,
              preferredEndTime: pref.preferredEndTime || null,
              priority: pref.priority || 'MEDIUM',
              reason: pref.reason || null
            }))
          }
        }),
        ...(notes !== undefined && { notes }),
        ...(status && { status: status.toUpperCase() }),
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
        preferences: {
          orderBy: {
            date: 'asc'
          }
        }
      }
    })

    console.log('✅ シフト申請更新成功:', updatedRequest.id)

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: 'シフト申請が正常に更新されました'
    })

  } catch (error) {
    console.error('❌ シフト申請更新エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// シフト申請削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log('🔍 シフト申請削除開始:', { id })

    // シフト申請の存在確認
    const existingRequest = await prisma.shiftRequest.findUnique({
      where: { id }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'シフト申請が見つかりません' },
        { status: 404 }
      )
    }

    // シフト申請を削除
    await prisma.shiftRequest.delete({
      where: { id }
    })

    console.log('✅ シフト申請削除成功:', id)

    return NextResponse.json({
      success: true,
      message: 'シフト申請が正常に削除されました'
    })

  } catch (error) {
    console.error('❌ シフト申請削除エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

