import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 勤怠レポート生成
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const reportType = searchParams.get('type') // 'attendance', 'shift', 'summary'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const employeeId = searchParams.get('employeeId')

    if (!storeId || !reportType) {
      return NextResponse.json(
        { error: '店舗IDとレポートタイプが必要です' },
        { status: 400 }
      )
    }

    console.log('🔍 レポート生成開始:', { storeId, reportType, startDate, endDate, employeeId })

    let reportData: any = {}

    switch (reportType) {
      case 'attendance':
        reportData = await generateAttendanceReport(storeId, startDate, endDate, employeeId)
        break
      case 'shift':
        reportData = await generateShiftReport(storeId, startDate, endDate, employeeId)
        break
      case 'summary':
        reportData = await generateSummaryReport(storeId, startDate, endDate)
        break
      default:
        return NextResponse.json(
          { error: '無効なレポートタイプです' },
          { status: 400 }
        )
    }

    console.log('✅ レポート生成成功:', reportType)

    return NextResponse.json({
      success: true,
      data: reportData,
      type: reportType
    })

  } catch (error) {
    console.error('❌ レポート生成エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 勤怠レポート生成
async function generateAttendanceReport(storeId: string, startDate?: string, endDate?: string, employeeId?: string) {
  const where: any = { storeId }
  
  if (employeeId) {
    where.employeeId = employeeId
  }
  
  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    }
  }

  const attendanceRecords = await prisma.attendanceRecord.findMany({
    where,
    include: {
      employee: {
        select: {
          id: true,
          fullName: true,
          employeeCode: true
        }
      }
    },
    orderBy: { date: 'asc' }
  })

  // 統計データを計算
  const totalRecords = attendanceRecords.length
  const totalWorkMinutes = attendanceRecords.reduce((sum, record) => {
    return sum + (record.totalWorkMinutes || 0)
  }, 0)
  
  const totalOvertimeMinutes = attendanceRecords.reduce((sum, record) => {
    return sum + (record.overtimeMinutes || 0)
  }, 0)

  const averageWorkHours = totalRecords > 0 ? (totalWorkMinutes / 60) / totalRecords : 0
  const averageOvertimeHours = totalRecords > 0 ? (totalOvertimeMinutes / 60) / totalRecords : 0

  // 従業員別集計
  const employeeStats = attendanceRecords.reduce((acc: any, record) => {
    const empId = record.employeeId
    if (!acc[empId]) {
      acc[empId] = {
        employeeId: empId,
        employeeName: record.employee.fullName,
        employeeCode: record.employee.employeeCode,
        totalDays: 0,
        totalWorkMinutes: 0,
        totalOvertimeMinutes: 0,
        averageWorkHours: 0
      }
    }
    
    acc[empId].totalDays++
    acc[empId].totalWorkMinutes += record.totalWorkMinutes || 0
    acc[empId].totalOvertimeMinutes += record.overtimeMinutes || 0
    
    return acc
  }, {})

  // 従業員別の平均を計算
  Object.values(employeeStats).forEach((emp: any) => {
    emp.averageWorkHours = emp.totalDays > 0 ? (emp.totalWorkMinutes / 60) / emp.totalDays : 0
    emp.totalWorkHours = emp.totalWorkMinutes / 60
    emp.totalOvertimeHours = emp.totalOvertimeMinutes / 60
  })

  return {
    period: { startDate, endDate },
    summary: {
      totalRecords,
      totalWorkHours: totalWorkMinutes / 60,
      totalOvertimeHours: totalOvertimeMinutes / 60,
      averageWorkHours,
      averageOvertimeHours
    },
    employeeStats: Object.values(employeeStats),
    details: attendanceRecords
  }
}

// シフトレポート生成
async function generateShiftReport(storeId: string, startDate?: string, endDate?: string, employeeId?: string) {
  const where: any = { storeId }
  
  if (employeeId) {
    where.employeeId = employeeId
  }
  
  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    }
  }

  const shifts = await prisma.shift.findMany({
    where,
    include: {
      employee: {
        select: {
          id: true,
          fullName: true,
          employeeCode: true
        }
      },
      position: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { date: 'asc' }
  })

  // 統計データを計算
  const totalShifts = shifts.length
  const totalHours = shifts.reduce((sum, shift) => {
    const startTime = new Date(shift.startTime)
    const endTime = new Date(shift.endTime)
    const diffMs = endTime.getTime() - startTime.getTime()
    return sum + (diffMs / (1000 * 60 * 60))
  }, 0)

  const averageHoursPerShift = totalShifts > 0 ? totalHours / totalShifts : 0

  // 従業員別集計
  const employeeStats = shifts.reduce((acc: any, shift) => {
    const empId = shift.employeeId
    if (!acc[empId]) {
      acc[empId] = {
        employeeId: empId,
        employeeName: shift.employee.fullName,
        employeeCode: shift.employee.employeeCode,
        totalShifts: 0,
        totalHours: 0,
        averageHoursPerShift: 0
      }
    }
    
    const startTime = new Date(shift.startTime)
    const endTime = new Date(shift.endTime)
    const diffMs = endTime.getTime() - startTime.getTime()
    const hours = diffMs / (1000 * 60 * 60)
    
    acc[empId].totalShifts++
    acc[empId].totalHours += hours
    
    return acc
  }, {})

  // 従業員別の平均を計算
  Object.values(employeeStats).forEach((emp: any) => {
    emp.averageHoursPerShift = emp.totalShifts > 0 ? emp.totalHours / emp.totalShifts : 0
  })

  // ポジション別集計
  const positionStats = shifts.reduce((acc: any, shift) => {
    const posId = shift.positionId || 'unknown'
    const posName = shift.position?.name || '未設定'
    
    if (!acc[posId]) {
      acc[posId] = {
        positionId: posId,
        positionName: posName,
        totalShifts: 0,
        totalHours: 0
      }
    }
    
    const startTime = new Date(shift.startTime)
    const endTime = new Date(shift.endTime)
    const diffMs = endTime.getTime() - startTime.getTime()
    const hours = diffMs / (1000 * 60 * 60)
    
    acc[posId].totalShifts++
    acc[posId].totalHours += hours
    
    return acc
  }, {})

  return {
    period: { startDate, endDate },
    summary: {
      totalShifts,
      totalHours,
      averageHoursPerShift
    },
    employeeStats: Object.values(employeeStats),
    positionStats: Object.values(positionStats),
    details: shifts
  }
}

// サマリーレポート生成
async function generateSummaryReport(storeId: string, startDate?: string, endDate?: string) {
  const where: any = { storeId }
  
  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    }
  }

  // 従業員数
  const employeeCount = await prisma.employee.count({ where: { storeId } })

  // 勤怠記録数
  const attendanceCount = await prisma.attendanceRecord.count({ where })

  // シフト数
  const shiftCount = await prisma.shift.count({ where })

  // シフト申請数
  const shiftRequestCount = await prisma.shiftRequest.count({ where: { storeId } })

  // 通知数
  const notificationCount = await prisma.notification.count({ where: { storeId } })

  // 月別の勤怠時間推移
  const monthlyAttendance = await prisma.attendanceRecord.groupBy({
    by: ['date'],
    where,
    _sum: {
      totalWorkMinutes: true
    }
  })

  const monthlyData = monthlyAttendance.map(record => ({
    date: record.date,
    totalWorkHours: (record._sum.totalWorkMinutes || 0) / 60
  }))

  return {
    period: { startDate, endDate },
    overview: {
      employeeCount,
      attendanceCount,
      shiftCount,
      shiftRequestCount,
      notificationCount
    },
    monthlyAttendance: monthlyData
  }
}


