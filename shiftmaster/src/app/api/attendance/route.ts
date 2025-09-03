import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { PrismaClient } from '@prisma/client'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// 勤怠状況取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    if (!employeeId) {
      return NextResponse.json(
        { error: '従業員IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 勤怠状況取得開始:', { employeeId, date })

    // 従業員情報を取得（メールアドレスで検索）
    const employee = await prisma.employee.findFirst({
      where: { email: employeeId },
      include: {
        store: true
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: '従業員が見つかりません' },
        { status: 404 }
      )
    }

    // 今日の勤怠記録を取得
    const attendance = await prisma.attendanceRecord.findFirst({
      where: {
        employeeId: employee.id,
        date: new Date(date),
      },
      include: {
        employee: {
          include: {
            store: true
          }
        }
      }
    })

    console.log('✅ 勤怠状況取得成功:', attendance)

    return NextResponse.json({
      success: true,
      data: attendance || null
    })

  } catch (error) {
    console.error('❌ 勤怠状況取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 出勤・退勤記録
export async function POST(request: NextRequest) {
  try {
    const { employeeId, action, latitude, longitude } = await request.json()
    
    if (!employeeId || !action || !latitude || !longitude) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      )
    }

    console.log('🔍 出退勤記録開始:', { employeeId, action, latitude, longitude })

    // 従業員情報と店舗情報を取得（メールアドレスで検索）
    const employee = await prisma.employee.findFirst({
      where: { email: employeeId },
      include: {
        store: true
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: '従業員が見つかりません' },
        { status: 404 }
      )
    }

    // 位置情報の検証
    const storeLat = parseFloat(employee.store.latitude?.toString() || '0')
    const storeLng = parseFloat(employee.store.longitude?.toString() || '0')
    const storeRadius = employee.store.radiusMeters || 50

    // 距離計算（簡易版）
    const distance = Math.sqrt(
      Math.pow(latitude - storeLat, 2) + Math.pow(longitude - storeLng, 2)
    ) * 111000 // 概算でメートルに変換

    console.log('📍 位置情報検証:', {
      storeLat,
      storeLng,
      userLat: latitude,
      userLng: longitude,
      distance,
      radius: storeRadius
    })

    if (distance > storeRadius) {
      return NextResponse.json({
        error: '店舗から離れすぎています',
        distance: Math.round(distance),
        radius: storeRadius
      }, { status: 400 })
    }

    const now = new Date()
    const today = now.toISOString().split('T')[0]

    if (action === 'clockIn') {
      // 出勤記録
      const existingRecord = await prisma.attendanceRecord.findFirst({
        where: {
          employeeId: employee.id,
          date: new Date(today)
        }
      })

      if (existingRecord) {
        return NextResponse.json({
          error: '今日は既に出勤済みです'
        }, { status: 400 })
      }

      const attendance = await prisma.attendanceRecord.create({
        data: {
          employeeId: employee.id,
          storeId: employee.storeId,
          date: new Date(today),
          clockInTime: now,
          // 位置情報フィールドは一時的に無効化（スキーマの型不整合のため）
          // clockInLocation: `${latitude},${longitude}`,
          status: 'IN_PROGRESS'
        }
      })

      console.log('✅ 出勤記録完了:', attendance)

      return NextResponse.json({
        success: true,
        message: '出勤が記録されました',
        data: attendance
      })

    } else if (action === 'clockOut') {
      // 退勤記録
      const existingRecord = await prisma.attendanceRecord.findFirst({
        where: {
          employeeId: employee.id,
          date: new Date(today),
          clockOutTime: null
        }
      })

      if (!existingRecord) {
        return NextResponse.json({
          error: '出勤記録が見つからないか、既に退勤済みです'
        }, { status: 400 })
      }

      if (!existingRecord.clockInTime) {
        return NextResponse.json({
          error: '出勤時刻が記録されていません'
        }, { status: 400 })
      }

      const attendance = await prisma.attendanceRecord.update({
        where: { id: existingRecord.id },
        data: {
          clockOutTime: now,
          // 位置情報フィールドは一時的に無効化（スキーマの型不整合のため）
          // clockOutLocation: `${latitude},${longitude}`,
          totalWorkMinutes: Math.round((now.getTime() - existingRecord.clockInTime.getTime()) / (1000 * 60)) // 分単位
        }
      })

      console.log('✅ 退勤記録完了:', attendance)

      return NextResponse.json({
        success: true,
        message: '退勤が記録されました',
        data: attendance
      })

    } else {
      return NextResponse.json(
        { error: '無効なアクションです' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ 出退勤記録エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
