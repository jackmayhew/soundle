import type { GameInstance } from '~/types/game/game.types'
import type { UserStatistics } from '~/types/stats/user-stats.types'

/**
 * Aggregates a user's entire game history into a statistics profile.
 * Calculates win rates, average times, and guess distributions.
 * @param calendar The user's full game history.
 * @param streakData Object containing the user's current and longest streak data.
 * @param streakData.currentStreak The user's current consecutive win streak.
 * @param streakData.longestStreak The user's all-time longest win streak.
 */
export function calculateUserStats(
  calendar: Record<string, Record<string, GameInstance>>,
  streakData: { currentStreak: number, longestStreak: number },
): UserStatistics {
  const allGames = Object.values(calendar)
    .flatMap(year => Object.values(year))
    .filter(g => g.result === 'win' || g.result === 'loss')

  if (allGames.length === 0)
    return createEmptyStats()

  const wins = allGames.filter(g => g.result === 'win').length
  const completedTimes = allGames
    .filter(g => g.completionTime && g.completionTime > 0)
    .map(g => g.completionTime!)

  const guessCounts = Array.from({ length: 6 }, (_, i) => ({
    guess: i + 1,
    count: allGames.filter(g => g.result === 'win' && g.guesses.length === i + 1).length,
  }))

  return {
    totalGames: allGames.length,
    wins,
    losses: allGames.length - wins,
    winRate: (wins / allGames.length) * 100,
    averageTime: completedTimes.length ? completedTimes.reduce((a, b) => a + b, 0) / completedTimes.length : 0,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    guessDistribution: guessCounts.map(g => ({
      ...g,
      percentage: (g.count / allGames.length) * 100,
    })),
  }
}

function createEmptyStats(): UserStatistics {
  return {
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    averageTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    guessDistribution: Array.from({ length: 6 }, (_, i) => ({
      guess: i + 1,
      count: 0,
      percentage: 0,
    })),
  }
}
