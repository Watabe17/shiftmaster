import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 認証されたユーザーの従業員情報を取得
export async function GET(request: NextRequest) {
  try {
    // TODO: 認証情報からユーザーIDを取得
    // 現在はテスト用に一般従業員を取得（管理者ではなく）
    const employee = await prisma.employee.findFirst({
      where: {
        email: 'employee@shiftmaster.test' // 一般従業員のメールアドレス
      },
      include: {
        store: true,
        position: true
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: '従業員情報が見つかりません' },
        { status: 404 }
      )
    }

    console.log('✅ 従業員情報取得成功:', employee)

    return NextResponse.json({
      success: true,
      data: {
        id: employee.id,
        name: employee.fullName,
        employeeCode: employee.employeeCode,
        position: employee.position?.name || '未設定',
        status: employee.status,
        store: {
          id: employee.store.id,
          name: employee.store.name,
          latitude: employee.store.latitude,
          longitude: employee.store.longitude,
          radiusMeters: employee.store.radiusMeters
        }
      }
    })

  } catch (error) {
    console.error('❌ 従業員情報取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
