import { describe, expect, it } from 'vitest'
import { normalizeGlobalStats } from '~/utils/stats/global-stats-calculations'

describe('global stats normalization', () => {
  it('fills in missing guess distribution slots with zeros', () => {
    const rawApiData = {
      totalPlays: 10,
      wins: 8,
      averageTime: 100,
      guessDistribution: [
        { guess: 1, count: 5 },
        { guess: 3, count: 3 },
      ],
    }

    const result = normalizeGlobalStats(rawApiData as any)

    // Should always have 6 slots
    expect(result.guessDistribution).toHaveLength(6)
    // Slot 1 (index 0)
    expect(result.guessDistribution[0]?.count).toBe(5)
    expect(result.guessDistribution[0]?.percentage).toBe(50)
    // Slot 2 (index 1) - should be auto-filled
    expect(result.guessDistribution[1]?.count).toBe(0)
    expect(result.guessDistribution[1]?.percentage).toBe(0)
  })

  it('calculates win rate correctly', () => {
    const rawApiData = {
      totalPlays: 200,
      wins: 150,
      averageTime: 50,
      guessDistribution: [],
    }
    const result = normalizeGlobalStats(rawApiData as any)
    expect(result.winRate).toBe(75)
  })

  it('handles zero total plays without dividing by zero', () => {
    const rawApiData = {
      totalPlays: 0,
      wins: 0,
      averageTime: 0,
      guessDistribution: [],
    }
    const result = normalizeGlobalStats(rawApiData as any)
    expect(result.winRate).toBe(0)
    expect(result.guessDistribution[0]?.percentage).toBe(0)
  })
})
