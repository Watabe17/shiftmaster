import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 勤怠履歴取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const employeeId = searchParams.get('employeeId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')

    if (!storeId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 勤怠履歴取得開始:', { storeId, employeeId, startDate, endDate, status })

    // 検索条件を構築
    const where: any = {
      storeId
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    // 勤怠履歴を取得
    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true,
            position: {
              select: {
                name: true,
                color: true
              }
            }
          }
        },
        shift: {
          select: {
            startTime: true,
            endTime: true,
            position: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { date: 'desc' },
        { clockInTime: 'desc' }
      ]
    })

    console.log(`✅ 勤怠履歴取得成功: ${attendanceRecords.length}件`)

    return NextResponse.json({
      success: true,
      data: attendanceRecords
    })

  } catch (error) {
    console.error('❌ 勤怠履歴取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 勤怠記録の編集
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      clockInTime,
      clockOutTime,
      breakStartTime,
      breakEndTime,
      totalBreakMinutes,
      totalWorkMinutes,
      overtimeMinutes,
      notes,
      editedBy
    } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: '勤怠記録IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 勤怠記録編集開始:', { id })

    // 勤怠記録を更新
    const attendanceRecord = await prisma.attendanceRecord.update({
      where: { id },
      data: {
        clockInTime: clockInTime ? new Date(clockInTime) : undefined,
        clockOutTime: clockOutTime ? new Date(clockOutTime) : undefined,
        breakStartTime: breakStartTime ? new Date(breakStartTime) : undefined,
        breakEndTime: breakEndTime ? new Date(breakEndTime) : undefined,
        totalBreakMinutes: totalBreakMinutes ? parseInt(totalBreakMinutes) : undefined,
        totalWorkMinutes: totalWorkMinutes ? parseInt(totalWorkMinutes) : undefined,
        overtimeMinutes: overtimeMinutes ? parseInt(overtimeMinutes) : undefined,
        notes
      },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true
          }
        }
      }
    })

    // 編集履歴を記録
    if (editedBy) {
      await prisma.attendanceEdit.create({
        data: {
          attendanceRecordId: id,
          editedBy,
          editReason: '管理者による手動編集',
          oldValues: {}, // 実際の実装では古い値を保存
          newValues: {
            clockInTime,
            clockOutTime,
            breakStartTime,
            breakEndTime,
            totalBreakMinutes,
            totalWorkMinutes,
            overtimeMinutes,
            notes
          }
        }
      })
    }

    console.log('✅ 勤怠記録編集成功:', attendanceRecord.id)

    return NextResponse.json({
      success: true,
      data: attendanceRecord,
      message: '勤怠記録が正常に更新されました'
    })

  } catch (error) {
    console.error('❌ 勤怠記録編集エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 勤怠履歴のCSV出力
export async function POST(request: NextRequest) {
  try {
    const {
      storeId,
      employeeId,
      startDate,
      endDate,
      format = 'csv'
    } = await request.json()

    if (!storeId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 勤怠履歴CSV出力開始:', { storeId, employeeId, startDate, endDate, format })

    // 検索条件を構築
    const where: any = {
      storeId
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // 勤怠履歴を取得
    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where,
      include: {
        employee: {
          select: {
            fullName: true,
            employeeCode: true
          }
        },
        position: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { employee: { employeeCode: 'asc' } }
      ]
    })

    if (format === 'csv') {
      // CSV形式で出力
      const csvData = generateCSV(attendanceRecords)
      
      console.log('✅ 勤怠履歴CSV出力成功')

      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="attendance_${startDate}_${endDate}.csv"`
        }
      })
    } else {
      // JSON形式で出力
      return NextResponse.json({
        success: true,
        data: attendanceRecords
      })
    }

  } catch (error) {
    console.error('❌ 勤怠履歴CSV出力エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// CSV生成関数
function generateCSV(attendanceRecords: any[]): string {
  const headers = [
    '日付',
    '従業員コード',
    '従業員名',
    'ポジション',
    '出勤時刻',
    '退勤時刻',
    '休憩開始時刻',
    '休憩終了時刻',
    '総休憩時間(分)',
    '総勤務時間(分)',
    '残業時間(分)',
    'ステータス',
    '備考'
  ]

  const csvRows = [headers.join(',')]

  for (const record of attendanceRecords) {
    const row = [
      record.date,
      record.employee.employeeCode,
      record.employee.fullName,
      record.position?.name || '',
      record.clockInTime ? new Date(record.clockInTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '',
      record.clockOutTime ? new Date(record.clockOutTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '',
      record.breakStartTime ? new Date(record.breakStartTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '',
      record.breakEndTime ? new Date(record.breakEndTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '',
      record.totalBreakMinutes || 0,
      record.totalWorkMinutes || 0,
      record.overtimeMinutes || 0,
      record.status,
      record.notes || ''
    ]

    csvRows.push(row.join(','))
  }

  return csvRows.join('\n')
}
