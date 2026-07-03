import type { GlobalResultsResponse } from '~/schemas/results/global-results.schema'

/**
 * Normalizes raw API response into a consistent format for the UI.
 * Fills in missing guess distribution slots and calculates percentages.
 */
export function normalizeGlobalStats(response: GlobalResultsResponse) {
  const winRate = response.totalPlays > 0 ? (response.wins / response.totalPlays) * 100 : 0

  // Ensure slots 1-6 are always represented
  const guessCounts = Array.from({ length: 6 }, (_, i) => ({ guess: i + 1, count: 0 }))

  if (response.guessDistribution) {
    response.guessDistribution.forEach((d) => {
      if (d.guess >= 1 && d.guess <= 6) {
        guessCounts[d.guess - 1]!.count = d.count
      }
    })
  }

  const guessDistribution = guessCounts.map(g => ({
    ...g,
    percentage: response.totalPlays > 0 ? (g.count / response.totalPlays) * 100 : 0,
  }))

  return {
    totalPlays: response.totalPlays,
    winRate,
    averageTime: response.averageTime,
    guessDistribution,
  }
}
