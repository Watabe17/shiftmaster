import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// 店舗設定取得
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

    console.log('🔍 店舗設定取得開始:', { storeId })

    // 店舗基本情報を取得
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        storeSettings: true,
        positions: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    console.log('✅ 店舗設定取得成功')

    return NextResponse.json({
      success: true,
      data: {
        store: {
          id: store.id,
          name: store.name,
          address: store.address,
          phone: store.phone,
          email: store.email,
          latitude: store.latitude,
          longitude: store.longitude,
          radiusMeters: store.radiusMeters,
          timezone: store.timezone,
          businessHours: store.businessHours
        },
        settings: store.storeSettings[0] || null,
        positions: store.positions
      }
    })

  } catch (error) {
    console.error('❌ 店舗設定取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 店舗設定更新
export async function PUT(request: NextRequest) {
  try {
    const {
      storeId,
      storeData,
      settingsData,
      positionsData
    } = await request.json()

    if (!storeId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 店舗設定更新開始:', { storeId })

    // 店舗基本情報を更新
    if (storeData) {
      await prisma.store.update({
        where: { id: storeId },
        data: {
          name: storeData.name,
          address: storeData.address,
          phone: storeData.phone,
          email: storeData.email,
          latitude: storeData.latitude ? parseFloat(storeData.latitude) : undefined,
          longitude: storeData.longitude ? parseFloat(storeData.longitude) : undefined,
          radiusMeters: storeData.radiusMeters ? parseInt(storeData.radiusMeters) : undefined,
          timezone: storeData.timezone,
          businessHours: storeData.businessHours
        }
      })
    }

    // 店舗設定を更新
    if (settingsData) {
      const existingSettings = await prisma.storeSetting.findFirst({
        where: { storeId }
      })

      if (existingSettings) {
        await prisma.storeSetting.update({
          where: { id: existingSettings.id },
          data: {
            autoBreakEnabled: settingsData.autoBreakEnabled,
            autoBreakStartHours: settingsData.autoBreakStartHours ? parseFloat(settingsData.autoBreakStartHours) : undefined,
            autoBreakDurationMinutes: settingsData.autoBreakDurationMinutes ? parseInt(settingsData.autoBreakDurationMinutes) : undefined,
            overtimeThresholdMinutes: settingsData.overtimeThresholdMinutes ? parseInt(settingsData.overtimeThresholdMinutes) : undefined,
            earlyClockInMinutes: settingsData.earlyClockInMinutes ? parseInt(settingsData.earlyClockInMinutes) : undefined,
            lateClockOutMinutes: settingsData.lateClockOutMinutes ? parseInt(settingsData.lateClockOutMinutes) : undefined,
            locationStrictMode: settingsData.locationStrictMode,
            notificationSettings: settingsData.notificationSettings
          }
        })
      } else {
        await prisma.storeSetting.create({
          data: {
            storeId,
            autoBreakEnabled: settingsData.autoBreakEnabled || false,
            autoBreakStartHours: settingsData.autoBreakStartHours ? parseFloat(settingsData.autoBreakStartHours) : 6.0,
            autoBreakDurationMinutes: settingsData.autoBreakDurationMinutes ? parseInt(settingsData.autoBreakDurationMinutes) : 60,
            overtimeThresholdMinutes: settingsData.overtimeThresholdMinutes ? parseInt(settingsData.overtimeThresholdMinutes) : 480,
            earlyClockInMinutes: settingsData.earlyClockInMinutes ? parseInt(settingsData.earlyClockInMinutes) : 30,
            lateClockOutMinutes: settingsData.lateClockOutMinutes ? parseInt(settingsData.lateClockOutMinutes) : 30,
            locationStrictMode: settingsData.locationStrictMode !== undefined ? settingsData.locationStrictMode : true,
            notificationSettings: settingsData.notificationSettings || {}
          }
        })
      }
    }

    // ポジションを更新
    if (positionsData && Array.isArray(positionsData)) {
      // 既存のポジションを削除
      await prisma.position.deleteMany({
        where: { storeId }
      })

      // 新しいポジションを作成
      for (const position of positionsData) {
        await prisma.position.create({
          data: {
            storeId,
            name: position.name,
            description: position.description,
            hourlyWage: position.hourlyWage ? parseFloat(position.hourlyWage) : null,
            color: position.color || '#6B7280',
            sortOrder: position.sortOrder || 0
          }
        })
      }
    }

    console.log('✅ 店舗設定更新成功')

    return NextResponse.json({
      success: true,
      message: '店舗設定が正常に更新されました'
    })

  } catch (error) {
    console.error('❌ 店舗設定更新エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 店舗設定のテスト（位置情報など）
export async function POST(request: NextRequest) {
  try {
    const { action, storeId, testData } = await request.json()

    if (!storeId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 店舗設定テスト開始:', { action, storeId })

    switch (action) {
      case 'test-location':
        // 位置情報のテスト
        const store = await prisma.store.findUnique({
          where: { id: storeId },
          select: {
            latitude: true,
            longitude: true,
            radiusMeters: true
          }
        })

        if (!store || !store.latitude || !store.longitude) {
          return NextResponse.json({
            success: false,
            error: '店舗の位置情報が設定されていません'
          })
        }

        // テスト座標との距離を計算
        const testLat = parseFloat(testData.latitude)
        const testLng = parseFloat(testData.longitude)
        const distance = calculateDistance(
          parseFloat(store.latitude.toString()),
          parseFloat(store.longitude.toString()),
          testLat,
          testLng
        )

        const isWithinRadius = distance <= (store.radiusMeters || 50)

        return NextResponse.json({
          success: true,
          data: {
            distance: Math.round(distance),
            radius: store.radiusMeters,
            isWithinRadius,
            storeLocation: {
              latitude: store.latitude,
              longitude: store.longitude
            },
            testLocation: {
              latitude: testLat,
              longitude: testLng
            }
          }
        })

      case 'test-business-hours':
        // 営業時間のテスト
        const businessHours = await prisma.store.findUnique({
          where: { id: storeId },
          select: { businessHours: true }
        })

        return NextResponse.json({
          success: true,
          data: {
            businessHours: businessHours?.businessHours
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: '無効なテストアクションです'
        })
    }

  } catch (error) {
    console.error('❌ 店舗設定テストエラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 距離計算関数（簡易版）
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // 地球の半径（メートル）
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}
