import { describe, expect, it } from 'vitest'
import { calculateUserStats } from '~/utils/stats/user-stats-calculations'

const MOCK_STREAK_DATA = { currentStreak: 5, longestStreak: 10 }

describe('user stats calculation', () => {
  it('returns empty stats for an empty calendar', () => {
    const calendar = {}
    const result = calculateUserStats(calendar, MOCK_STREAK_DATA)

    expect(result.totalGames).toBe(0)
    expect(result.wins).toBe(0)
    expect(result.winRate).toBe(0)
  })

  it('correctly calculates basic stats from a populated calendar', () => {
    const calendar = {
      2025: {
        '2025-01-01': { result: 'win', guesses: { length: 3 }, completionTime: 1000 },
        '2025-01-02': { result: 'win', guesses: { length: 5 }, completionTime: 2000 },
        '2025-01-03': { result: 'loss', guesses: { length: 6 }, completionTime: 3000 },
        '2025-01-04': { result: 'pending', guesses: { length: 1 } }, // Should be ignored
      },
    }
    const result = calculateUserStats(calendar as any, MOCK_STREAK_DATA)

    expect(result.totalGames).toBe(3) // Ignores 'pending'
    expect(result.wins).toBe(2)
    expect(result.losses).toBe(1)
    expect(result.winRate).toBeCloseTo(66.67)
  })

  it('correctly calculates average time and guess distribution', () => {
    const calendar = {
      2025: {
        '2025-01-01': { result: 'win', guesses: { length: 2 }, completionTime: 1500 },
        '2025-01-02': { result: 'win', guesses: { length: 2 }, completionTime: 2500 },
        '2025-01-03': { result: 'win', guesses: { length: 4 }, completionTime: 4000 },
        '2025-01-04': { result: 'loss', guesses: { length: 6 }, completionTime: 5000 },
      },
    }
    const result = calculateUserStats(calendar as any, MOCK_STREAK_DATA)

    // Average time should be based on all 4 completed games
    expect(result.averageTime).toBe(3250) // (1500 + 2500 + 4000 + 5000) / 4

    // Guess distribution is only for wins
    expect(result.guessDistribution[0]?.count).toBe(0) // 1 guess
    expect(result.guessDistribution[1]?.count).toBe(2) // 2 guesses
    expect(result.guessDistribution[2]?.count).toBe(0) // 3 guesses
    expect(result.guessDistribution[3]?.count).toBe(1) // 4 guesses
  })

  it('correctly passes through streak data', () => {
    const calendar = { 2025: { '2025-01-01': { result: 'win', guesses: { length: 1 } } } }
    const result = calculateUserStats(calendar as any, MOCK_STREAK_DATA)

    expect(result.currentStreak).toBe(5)
    expect(result.longestStreak).toBe(10)
  })
})
