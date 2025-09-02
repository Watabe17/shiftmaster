import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 通知一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const storeId = searchParams.get('storeId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    if (!userId && !storeId) {
      return NextResponse.json(
        { error: 'ユーザーIDまたは店舗IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 通知一覧取得開始:', { userId, storeId, status, type })

    // 検索条件を構築
    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (storeId) {
      where.storeId = storeId
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (type && type !== 'all') {
      where.type = type.toUpperCase()
    }

    // 通知一覧を取得
    const notifications = await prisma.notification.findMany({
      where,
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
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    console.log(`✅ 通知一覧取得成功: ${notifications.length}件`)

    return NextResponse.json({
      success: true,
      data: notifications
    })

  } catch (error) {
    console.error('❌ 通知一覧取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 通知作成
export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      storeId,
      type,
      title,
      message,
      data,
      priority
    } = await request.json()

    if (!userId || !storeId || !type || !title || !message) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    console.log('🔍 通知作成開始:', { userId, type, title })

    // 通知を作成
    const notification = await prisma.notification.create({
      data: {
        userId,
        storeId,
        type: type.toUpperCase(),
        title,
        message,
        data: data || {},
        priority: priority || 'NORMAL',
        status: 'UNREAD'
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

    console.log('✅ 通知作成成功:', notification.id)

    // メール通知の送信（後で実装）
    // await sendEmailNotification(notification)

    return NextResponse.json({
      success: true,
      data: notification,
      message: '通知が正常に作成されました'
    })

  } catch (error) {
    console.error('❌ 通知作成エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 一括通知作成（店舗全体や特定の従業員グループ向け）
export async function PUT(request: NextRequest) {
  try {
    const {
      storeId,
      employeeIds,
      type,
      title,
      message,
      data,
      priority
    } = await request.json()

    if (!storeId || !type || !title || !message) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    console.log('🔍 一括通知作成開始:', { storeId, type, title, employeeCount: employeeIds?.length || 'all' })

    let targetUserIds: string[] = []

    if (employeeIds && employeeIds.length > 0) {
      // 特定の従業員向け
      targetUserIds = employeeIds
    } else {
      // 店舗全体の従業員向け
      const employees = await prisma.employee.findMany({
        where: { storeId },
        select: { userId: true }
      })
      targetUserIds = employees.map(emp => emp.userId)
    }

    // 各ユーザーに通知を作成
    const notificationPromises = targetUserIds.map(userId =>
      prisma.notification.create({
        data: {
          userId,
          storeId,
          type: type.toUpperCase(),
          title,
          message,
          data: data || {},
          priority: priority || 'NORMAL',
          status: 'UNREAD'
        }
      })
    )

    const notifications = await Promise.all(notificationPromises)

    console.log(`✅ 一括通知作成成功: ${notifications.length}件`)

    // メール通知の送信（後で実装）
    // await sendBulkEmailNotifications(notifications)

    return NextResponse.json({
      success: true,
      data: notifications,
      message: `${notifications.length}件の通知が正常に作成されました`
    })

  } catch (error) {
    console.error('❌ 一括通知作成エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

