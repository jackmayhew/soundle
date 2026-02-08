import type { GuessResult } from '~/types/game/guess/guess-result.types'

export interface GameInstance {
  guesses: GuessResult[]
  result: 'pending' | 'win' | 'loss'
  puzzleDate: string
  audioUrl: string
  hint: string
  loadingStatus: 'loading' | 'success' | 'error'
  answer: string
  difficulty: number | null
  puzzleNumber: number | null
  completionTime: number | null
  elapsedTime: number
}
