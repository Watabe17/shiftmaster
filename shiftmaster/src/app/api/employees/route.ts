import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// 従業員一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const employmentType = searchParams.get('employmentType')

    if (!storeId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 従業員一覧取得開始:', { storeId, search, status, employmentType })

    // 検索条件を構築
    const where: any = {
      storeId,
      deletedAt: null
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { employeeCode: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    // 従業員一覧を取得
    const employees = await prisma.employee.findMany({
      where,
      include: {
        position: true,
        userProfile: {
          select: {
            email: true,
            phone: true
          }
        },
        _count: {
          select: {
            attendanceRecords: true,
            shifts: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    console.log(`✅ 従業員一覧取得成功: ${employees.length}件`)

    return NextResponse.json({
      success: true,
      data: employees
    })

  } catch (error) {
    console.error('❌ 従業員一覧取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 従業員作成
export async function POST(request: NextRequest) {
  try {
    const {
      storeId,
      employeeCode,
      fullName,
      email,
      phone,
      role,
      positionId,
      hireDate,
      monthlyLimitHours,
      socialInsuranceEnrolled,
      paidLeaveDays,
      address
    } = await request.json()

    if (!storeId || !employeeCode || !fullName) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    console.log('🔍 従業員作成開始:', { employeeCode, fullName, storeId })

    // 従業員コードの重複チェック
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        employeeCode,
        storeId,
        deletedAt: null
      }
    })

    if (existingEmployee) {
      return NextResponse.json(
        { error: '従業員コードが既に使用されています' },
        { status: 409 }
      )
    }

    // 従業員を作成
    const employee = await prisma.employee.create({
      data: {
        storeId,
        employeeCode,
        fullName,
        email,
        phone,
        role: role || 'EMPLOYEE',
        status: 'INVITED',
        positionId,
        hireDate: hireDate ? new Date(hireDate) : null,
        monthlyLimitHours: monthlyLimitHours || 160,
        socialInsuranceEnrolled: socialInsuranceEnrolled || false,
        paidLeaveDays: paidLeaveDays || 0,
        address
      },
      include: {
        position: true,
        store: {
          select: {
            name: true
          }
        }
      }
    })

    console.log('✅ 従業員作成成功:', employee.id)

    return NextResponse.json({
      success: true,
      data: employee,
      message: '従業員が正常に作成されました'
    })

  } catch (error) {
    console.error('❌ 従業員作成エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 従業員更新
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      fullName,
      email,
      phone,
      role,
      positionId,
      hireDate,
      monthlyLimitHours,
      socialInsuranceEnrolled,
      paidLeaveDays,
      address,
      status
    } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: '従業員IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 従業員更新開始:', { id, fullName })

    // 従業員を更新
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        fullName,
        email,
        phone,
        role,
        positionId,
        hireDate: hireDate ? new Date(hireDate) : null,
        monthlyLimitHours,
        socialInsuranceEnrolled,
        paidLeaveDays,
        address,
        status
      },
      include: {
        position: true,
        userProfile: {
          select: {
            email: true,
            phone: true
          }
        }
      }
    })

    console.log('✅ 従業員更新成功:', employee.id)

    return NextResponse.json({
      success: true,
      data: employee,
      message: '従業員情報が正常に更新されました'
    })

  } catch (error) {
    console.error('❌ 従業員更新エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 従業員削除（論理削除）
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: '従業員IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 従業員削除開始:', { id })

    // 論理削除（deletedAtを設定）
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE'
      }
    })

    console.log('✅ 従業員削除成功:', employee.id)

    return NextResponse.json({
      success: true,
      message: '従業員が正常に削除されました'
    })

  } catch (error) {
    console.error('❌ 従業員削除エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
