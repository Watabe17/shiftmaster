"use client"

import React, { useState, useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneratedShift } from '@/lib/ai-shift-generator'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from 'lucide-react'

interface ShiftCalendarProps {
  shifts: GeneratedShift[]
  onShiftClick?: (shift: GeneratedShift) => void
  onDateClick?: (date: string) => void
  isEditable?: boolean
}

type ViewMode = 'month' | 'week' | 'day'

export function ShiftCalendar({ 
  shifts, 
  onShiftClick, 
  onDateClick,
  isEditable = true 
}: ShiftCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // 現在の月の日付範囲を取得
  const monthDates = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const dates: Date[] = []
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
    
    return dates
  }, [currentDate])

  // 現在の週の日付範囲を取得
  const weekDates = useMemo(() => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    
    const dates: Date[] = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    
    return dates
  }, [currentDate])

  // 指定された日付のシフトを取得
  const getShiftsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return shifts.filter(shift => shift.date === dateStr)
  }

  // 日付をフォーマット
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // 月を変更
  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  // 週を変更
  const changeWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  // 日付を選択
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = formatDate(date)
      setSelectedDate(dateStr)
      onDateClick?.(dateStr)
    }
  }

  // シフトをクリック
  const handleShiftClick = (shift: GeneratedShift) => {
    onShiftClick?.(shift)
  }

  // 月間ビュー
  const MonthView = () => (
    <div className="space-y-4">
      {/* 月間カレンダー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold">
                {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeMonth('next')}
              >
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              今日
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate ? new Date(selectedDate) : undefined}
            onSelect={handleDateSelect}
            month={currentDate}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* シフトサマリー */}
      <Card>
        <CardHeader>
          <CardTitle>シフトサマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
              <div key={day} className="text-center font-medium text-sm p-2">
                {day}
              </div>
            ))}
            {monthDates.map((date, index) => {
              const dayShifts = getShiftsForDate(date)
              const isToday = formatDate(date) === formatDate(new Date())
              const isSelected = selectedDate === formatDate(date)
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[80px] p-2 border rounded-lg cursor-pointer hover:bg-gray-50
                    ${isToday ? 'bg-blue-50 border-blue-200' : ''}
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                  `}
                  onClick={() => handleDateSelect(date)}
                >
                  <div className="text-sm font-medium mb-1">
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayShifts.slice(0, 3).map((shift) => (
                      <div
                        key={shift.id}
                        className="text-xs p-1 bg-blue-100 rounded cursor-pointer hover:bg-blue-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShiftClick(shift)
                        }}
                      >
                        <div className="font-medium">{shift.employeeName}</div>
                        <div className="text-gray-600">
                          {shift.startTime}-{shift.endTime}
                        </div>
                        <div className="text-gray-500">{shift.positionName}</div>
                      </div>
                    ))}
                    {dayShifts.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayShifts.length - 3}件
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // 週間ビュー
  const WeekView = () => (
    <div className="space-y-4">
      {/* 週間ヘッダー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeWeek('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold">
                {weekDates[0].getMonth() + 1}月{weekDates[0].getDate()}日 - {weekDates[6].getMonth() + 1}月{weekDates[6].getDate()}日
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeWeek('next')}
              >
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              今週
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {/* 時間列ヘッダー */}
            <div className="font-medium text-sm p-2">時間</div>
            {weekDates.map((date) => (
              <div key={date.getTime()} className="text-center font-medium text-sm p-2">
                <div>{date.getDate()}</div>
                <div className="text-xs text-gray-500">
                  {['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}
                </div>
              </div>
            ))}

            {/* 時間行 */}
            {Array.from({ length: 24 }, (_, hour) => (
              <React.Fragment key={hour}>
                <div className="text-xs text-gray-500 p-1 border-r">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {weekDates.map((date) => {
                  const dayShifts = getShiftsForDate(date)
                  const hourShifts = dayShifts.filter(shift => {
                    const startHour = parseInt(shift.startTime.split(':')[0])
                    const endHour = parseInt(shift.endTime.split(':')[0])
                    return hour >= startHour && hour < endHour
                  })

                  return (
                    <div
                      key={date.getTime()}
                      className="min-h-[40px] p-1 border-b border-r relative"
                    >
                      {hourShifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="absolute left-0 right-0 top-0 bottom-0 bg-blue-100 border border-blue-300 rounded text-xs p-1 cursor-pointer hover:bg-blue-200"
                          style={{
                            top: '2px',
                            bottom: '2px',
                            left: '2px',
                            right: '2px'
                          }}
                          onClick={() => handleShiftClick(shift)}
                        >
                          <div className="font-medium truncate">{shift.employeeName}</div>
                          <div className="text-gray-600 truncate">{shift.positionName}</div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // 日別ビュー
  const DayView = () => {
    const selectedDateObj = selectedDate ? new Date(selectedDate) : currentDate
    const dayShifts = getShiftsForDate(selectedDateObj)

    return (
      <div className="space-y-4">
        {/* 日別ヘッダー */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const prevDate = new Date(selectedDateObj)
                    prevDate.setDate(prevDate.getDate() - 1)
                    setCurrentDate(prevDate)
                    setSelectedDate(formatDate(prevDate))
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold">
                  {selectedDateObj.getFullYear()}年{selectedDateObj.getMonth() + 1}月{selectedDateObj.getDate()}日
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const nextDate = new Date(selectedDateObj)
                    nextDate.setDate(nextDate.getDate() + 1)
                    setCurrentDate(nextDate)
                    setSelectedDate(formatDate(nextDate))
                  }}
                >
                  <ChevronLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date()
                  setCurrentDate(today)
                  setSelectedDate(formatDate(today))
                }}
              >
                今日
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dayShifts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                この日のシフトはありません
              </div>
            ) : (
              <div className="space-y-3">
                {dayShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleShiftClick(shift)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">{shift.employeeName}</div>
                          <div className="text-sm text-gray-600">{shift.positionName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {shift.startTime} - {shift.endTime}
                        </div>
                        <div className="text-sm text-gray-500">
                          休憩: {shift.breakMinutes}分
                        </div>
                      </div>
                    </div>
                    {shift.reasoning && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        {shift.reasoning}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ビューモード選択 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>シフトカレンダー</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="month" className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>月間</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>週間</span>
              </TabsTrigger>
              <TabsTrigger value="day" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>日別</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="month" className="mt-6">
              <MonthView />
            </TabsContent>

            <TabsContent value="week" className="mt-6">
              <WeekView />
            </TabsContent>

            <TabsContent value="day" className="mt-6">
              <DayView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

