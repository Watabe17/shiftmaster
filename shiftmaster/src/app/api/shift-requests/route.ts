import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// シフト申請一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')
    const month = searchParams.get('month')

    if (!storeId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 シフト申請一覧取得開始:', { storeId, employeeId, status, month })

    // 検索条件を構築
    const where: any = {
      storeId
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (month) {
      where.month = month
    }

    // シフト申請一覧を取得
    const shiftRequests = await prisma.shiftRequest.findMany({
      where,
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
      },
      orderBy: [
        { month: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    console.log(`✅ シフト申請一覧取得成功: ${shiftRequests.length}件`)

    return NextResponse.json({
      success: true,
      data: shiftRequests
    })

  } catch (error) {
    console.error('❌ シフト申請一覧取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// シフト申請作成
export async function POST(request: NextRequest) {
  try {
    const {
      storeId,
      employeeId,
      month,
      preferences,
      notes
    } = await request.json()

    if (!storeId || !employeeId || !month || !preferences) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    console.log('🔍 シフト申請作成開始:', { employeeId, month, preferencesCount: preferences.length })

    // 既存の申請があるかチェック
    const existingRequest = await prisma.shiftRequest.findFirst({
      where: {
        storeId,
        employeeId,
        month
      }
    })

    if (existingRequest) {
      // 既存の申請を更新
      const updatedRequest = await prisma.shiftRequest.update({
        where: { id: existingRequest.id },
        data: {
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
          },
          notes,
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

      // 通知送信（更新時）
      // TODO: notification-serviceを実装後に有効化
      // try {
      //   await notificationService.sendGeneralNotification(
      //     employeeId,
      //     storeId,
      //     'シフト申請が更新されました',
      //     `${month}のシフト申請が更新されました。`,
      //     'NORMAL'
      //   )
      // } catch (notificationError) {
      //   console.warn('通知送信に失敗しました:', notificationError)
      // }

      return NextResponse.json({
        success: true,
        data: updatedRequest,
        message: 'シフト申請が正常に更新されました'
      })
    } else {
      // 新規申請を作成
      const newRequest = await prisma.shiftRequest.create({
        data: {
          storeId,
          employeeId,
          month,
          preferences: {
            create: preferences.map((pref: any) => ({
              date: new Date(pref.date),
              available: pref.available,
              preferredStartTime: pref.preferredStartTime || null,
              preferredEndTime: pref.preferredEndTime || null,
              priority: pref.priority || 'MEDIUM',
              reason: pref.reason || null
            }))
          },
          notes,
          status: 'DRAFT'
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

      console.log('✅ シフト申請作成成功:', newRequest.id)

      // 通知送信（新規作成時）
      // TODO: notification-serviceを実装後に有効化
      // try {
      //   await notificationService.sendGeneralNotification(
      //     employeeId,
      //     storeId,
      //     'シフト申請が作成されました',
      //     `${month}のシフト申請が作成されました。`,
      //     'NORMAL'
      //   )
      // } catch (notificationError) {
      //   console.warn('通知送信に失敗しました:', notificationError)
      // }

      return NextResponse.json({
        success: true,
        data: newRequest,
        message: 'シフト申請が正常に作成されました'
      })
    }

  } catch (error) {
    console.error('❌ シフト申請作成エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
