import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// 通知詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log('🔍 通知詳細取得開始:', { id })

    const notification = await prisma.notification.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        store: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!notification) {
      return NextResponse.json(
        { error: '通知が見つかりません' },
        { status: 404 }
      )
    }

    console.log('✅ 通知詳細取得成功:', notification.id)

    return NextResponse.json({
      success: true,
      data: notification
    })

  } catch (error) {
    console.error('❌ 通知詳細取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 通知更新（既読・削除など）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updateData = await request.json()

    console.log('🔍 通知更新開始:', { id, updateData })

    // 更新可能なフィールドのみを抽出
    const {
      status,
      readAt,
      data
    } = updateData

    // 通知の存在確認
    const existingNotification = await prisma.notification.findUnique({
      where: { id }
    })

    if (!existingNotification) {
      return NextResponse.json(
        { error: '通知が見つかりません' },
        { status: 404 }
      )
    }

    // 通知を更新
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        ...(status && { status: status.toUpperCase() }),
        ...(readAt && { readAt: new Date(readAt) }),
        ...(data && { data }),
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        store: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    console.log('✅ 通知更新成功:', updatedNotification.id)

    return NextResponse.json({
      success: true,
      data: updatedNotification,
      message: '通知が正常に更新されました'
    })

  } catch (error) {
    console.error('❌ 通知更新エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 通知削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log('🔍 通知削除開始:', { id })

    // 通知の存在確認
    const existingNotification = await prisma.notification.findUnique({
      where: { id }
    })

    if (!existingNotification) {
      return NextResponse.json(
        { error: '通知が見つかりません' },
        { status: 404 }
      )
    }

    // 通知を削除
    await prisma.notification.delete({
      where: { id }
    })

    console.log('✅ 通知削除成功:', id)

    return NextResponse.json({
      success: true,
      message: '通知が正常に削除されました'
    })

  } catch (error) {
    console.error('❌ 通知削除エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

