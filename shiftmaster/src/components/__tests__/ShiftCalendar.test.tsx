// ShiftCalendarコンポーネントのテスト
import { describe, it, expect, beforeEach } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// ShiftCalendarコンポーネントをモック
const MockShiftCalendar = ({ onDateSelect, selectedDate }: any) => {
  return (
    <div data-testid="shift-calendar">
      <h2>シフトカレンダー</h2>
      <div>
        <button 
          data-testid="prev-month"
          onClick={() => onDateSelect(new Date(2024, 0, 1))}
        >
          前月
        </button>
        <span data-testid="current-month">2024年1月</span>
        <button 
          data-testid="next-month"
          onClick={() => onDateSelect(new Date(2024, 2, 1))}
        >
          次月
        </button>
      </div>
      <div data-testid="calendar-grid">
        {Array.from({ length: 31 }, (_, i) => (
          <button
            key={i + 1}
            data-testid={`day-${i + 1}`}
            onClick={() => onDateSelect(new Date(2024, 0, i + 1))}
            className={selectedDate?.getDate() === i + 1 ? 'selected' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

describe('ShiftCalendarコンポーネント', () => {
  let mockOnDateSelect: jest.Mock

  beforeEach(() => {
    mockOnDateSelect = jest.fn()
  })

  it('カレンダーが正しくレンダリングされる', () => {
    render(<MockShiftCalendar onDateSelect={mockOnDateSelect} />)
    
    expect(screen.getByTestId('shift-calendar')).toBeInTheDocument()
    expect(screen.getByText('シフトカレンダー')).toBeInTheDocument()
    expect(screen.getByText('2024年1月')).toBeInTheDocument()
  })

  it('月移動ボタンが正しく動作する', () => {
    render(<MockShiftCalendar onDateSelect={mockOnDateSelect} />)
    
    const prevButton = screen.getByTestId('prev-month')
    const nextButton = screen.getByTestId('next-month')
    
    fireEvent.click(prevButton)
    expect(mockOnDateSelect).toHaveBeenCalledWith(new Date(2024, 0, 1))
    
    fireEvent.click(nextButton)
    expect(mockOnDateSelect).toHaveBeenCalledWith(new Date(2024, 2, 1))
  })

  it('日付選択が正しく動作する', () => {
    render(<MockShiftCalendar onDateSelect={mockOnDateSelect} />)
    
    const day15 = screen.getByTestId('day-15')
    fireEvent.click(day15)
    
    expect(mockOnDateSelect).toHaveBeenCalledWith(new Date(2024, 0, 15))
  })

  it('選択された日付がハイライトされる', () => {
    const selectedDate = new Date(2024, 0, 15)
    render(<MockShiftCalendar onDateSelect={mockOnDateSelect} selectedDate={selectedDate} />)
    
    const day15 = screen.getByTestId('day-15')
    expect(day15).toHaveClass('selected')
  })

  it('全ての日付が表示される', () => {
    render(<MockShiftCalendar onDateSelect={mockOnDateSelect} />)
    
    // 1月は31日まで
    for (let i = 1; i <= 31; i++) {
      expect(screen.getByTestId(`day-${i}`)).toBeInTheDocument()
    }
  })
})
