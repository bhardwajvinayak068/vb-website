import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCyclingText } from './useCyclingText'

describe('useCyclingText', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts on the first line', () => {
    const { result } = renderHook(() =>
      useCyclingText(['ONE', 'TWO', 'THREE'], 1000)
    )
    expect(result.current).toBe('ONE')
  })

  it('advances to the next line after the interval, and wraps around', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() =>
      useCyclingText(['ONE', 'TWO', 'THREE'], 1000)
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe('TWO')

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current).toBe('ONE')
  })
})
