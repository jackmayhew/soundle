import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useArchiveDates } from '~/composables/game/use-archive-dates'
import { FIRST_PUZZLE_DATE } from '~/constants/game'

describe('archive dates composable', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should generate dates from first puzzle to today', () => {
    // Set "Today" to Dec 31, 2026 (well after the start date)
    vi.setSystemTime(new Date('2026-12-31T12:00:00Z'))

    const dates = useArchiveDates()

    expect(dates[dates.length - 1]).toBe(FIRST_PUZZLE_DATE)
    expect(dates[0]).toBe('2026-12-31')
  })

  it('should not include future dates', () => {
    vi.setSystemTime(new Date('2026-12-31T12:00:00Z'))

    const dates = useArchiveDates()

    // Ensure tomorrow (Jan 1, 2027) is not in the list
    const futureDate = dates.find(date => date > '2026-12-31')
    expect(futureDate).toBeUndefined()
  })

  it('should return dates in reverse order (newest first)', () => {
    vi.setSystemTime(new Date('2026-12-31T12:00:00Z'))

    const dates = useArchiveDates()

    // Newest date (index 0) should be greater than oldest date (last index)
    expect(dates[0]! > dates[dates.length - 1]!).toBe(true)
  })
})
