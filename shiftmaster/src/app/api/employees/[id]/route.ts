import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 従業員詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log('🔍 従業員詳細取得開始:', { id })

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        position: true,
        userProfile: {
          select: {
            email: true,
            phone: true
          }
        },
        store: true
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: '従業員が見つかりません' },
        { status: 404 }
      )
    }

    console.log('✅ 従業員詳細取得成功:', employee)

    return NextResponse.json({
      success: true,
      data: employee
    })

  } catch (error) {
    console.error('❌ 従業員詳細取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 従業員更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updateData = await request.json()

    console.log('🔍 従業員更新開始:', { id, updateData })

    // 更新可能なフィールドのみを抽出
    const {
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
    } = updateData

    // 従業員の存在確認
    const existingEmployee = await prisma.employee.findUnique({
      where: { id }
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { error: '従業員が見つかりません' },
        { status: 404 }
      )
    }

    // 従業員情報を更新
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(role && { role: role.toUpperCase() }),
        ...(positionId && { positionId }),
        ...(hireDate && { hireDate: new Date(hireDate) }),
        ...(monthlyLimitHours && { monthlyLimitHours }),
        ...(socialInsuranceEnrolled !== undefined && { socialInsuranceEnrolled }),
        ...(paidLeaveDays !== undefined && { paidLeaveDays }),
        ...(address && { address })
      },
      include: {
        position: true,
        userProfile: true
      }
    })

    console.log('✅ 従業員更新成功:', updatedEmployee)

    return NextResponse.json({
      success: true,
      data: updatedEmployee
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log('🔍 従業員削除開始:', { id })

    // 従業員の存在確認
    const existingEmployee = await prisma.employee.findUnique({
      where: { id }
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { error: '従業員が見つかりません' },
        { status: 404 }
      )
    }

    // 論理削除（deletedAtを設定）
    const deletedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE'
      }
    })

    console.log('✅ 従業員削除成功:', deletedEmployee)

    return NextResponse.json({
      success: true,
      message: '従業員を正常に削除しました'
    })

  } catch (error) {
    console.error('❌ 従業員削除エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

