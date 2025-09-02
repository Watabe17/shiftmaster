import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

// 従業員招待リンク生成
export async function POST(request: NextRequest) {
  try {
    const { employeeId, expiresInDays = 7 } = await request.json()
    
    if (!employeeId) {
      return NextResponse.json(
        { error: '従業員IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 招待リンク生成開始:', { employeeId, expiresInDays })

    // 従業員情報を取得
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        store: {
          select: {
            name: true
          }
        }
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: '従業員が見つかりません' },
        { status: 404 }
      )
    }

    // 既存の招待トークンを削除
    await prisma.invitation.deleteMany({
      where: { employeeId }
    })

    // 新しい招待トークンを生成
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    // 招待テーブルに保存
    const invitation = await prisma.invitation.create({
      data: {
        token,
        employeeId,
        email: employee.email,
        expiresAt
      }
    })

    // 招待リンクを生成
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const inviteUrl = `${baseUrl}/onboard?token=${token}`
    
    // QRコード用のデータ（実際のQRコード生成はフロントエンドで実装）
    const qrData = {
      url: inviteUrl,
      employeeCode: employee.employeeCode,
      storeName: employee.store.name
    }

    console.log('✅ 招待リンク生成成功:', { token, expiresAt })

    return NextResponse.json({
      success: true,
      data: {
        token,
        inviteUrl,
        qrData,
        expiresAt: expiresAt.toISOString(),
        employee: {
          id: employee.id,
          name: employee.fullName,
          employeeCode: employee.employeeCode,
          storeName: employee.store.name
        }
      },
      message: '招待リンクが正常に生成されました'
    })

  } catch (error) {
    console.error('❌ 招待リンク生成エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 招待リンクの一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')

    if (!storeId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 招待リンク一覧取得開始:', { storeId })

    // 店舗の従業員の招待情報を取得
    const invitations = await prisma.invitation.findMany({
      where: {
        employee: {
          storeId,
          deletedAt: null
        }
      },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true,
            email: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ 招待リンク一覧取得成功: ${invitations.length}件`)

    return NextResponse.json({
      success: true,
      data: invitations
    })

  } catch (error) {
    console.error('❌ 招待リンク一覧取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 招待リンクの削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'トークンが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 招待リンク削除開始:', { token })

    // 招待トークンを削除
    await prisma.invitation.delete({
      where: { token }
    })

    console.log('✅ 招待リンク削除成功:', token)

    return NextResponse.json({
      success: true,
      message: '招待リンクが正常に削除されました'
    })

  } catch (error) {
    console.error('❌ 招待リンク削除エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
