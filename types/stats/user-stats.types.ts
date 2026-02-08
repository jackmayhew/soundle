export interface GuessDistribution {
  guess: number
  count: number
  percentage: number
}

export interface UserStatistics {
  totalGames: number
  wins: number
  losses: number
  winRate: number
  averageTime: number
  currentStreak: number
  longestStreak: number
  guessDistribution: GuessDistribution[]
}
