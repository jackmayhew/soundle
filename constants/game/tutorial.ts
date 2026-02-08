import type { GameInstance } from '~/types/game/game.types'
import type { HintCodeType } from '~/types/game/hint-code.types'

interface TutorialGuess {
  text: string
  correct: boolean
  hint: HintCodeType | null
}

export const TUTORIAL_AUDIO = '/audio/dog-barking.mp3'
export const TUTORIAL_BAD_GUESS = 'Dog'
export const TUTORIAL_CORRECT_GUESS = 'Dog Barking'

export const TUTORIAL_GUESSES: TutorialGuess[] = [
  { text: TUTORIAL_BAD_GUESS, correct: false, hint: 'TOO_GENERAL' },
  { text: TUTORIAL_CORRECT_GUESS, correct: true, hint: null },
]

// Don't really need this but whatever
export const TUTORIAL_GAME: GameInstance = {
  guesses: TUTORIAL_GUESSES,
  result: 'pending',
  puzzleDate: '2025-01-01',
  audioUrl: TUTORIAL_AUDIO,
  hint: 'Man\'s best friend has something to say.',
  answer: TUTORIAL_CORRECT_GUESS,
  loadingStatus: 'loading',
  difficulty: 1,
  puzzleNumber: 1,
  elapsedTime: 0,
  completionTime: 0,
}
