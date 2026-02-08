import type { GuessRequest } from '~/schemas/game/guess.schema'
import type { GuessValidationError } from '~/types/game/guess/guess-error.types'
import { NUXT_API_ROUTES } from '~/constants/api/routes'
import { MAX_GUESSES } from '~/constants/app/validation'
import { GuessRequestSchema, GuessResultSchema } from '~/schemas/game/guess.schema'

/**
 * Handles guess submission logic. Manages validation, API calls,
 * and game state updates when a user submits a guess.
 */
export function useGuessSubmission() {
  const gameStore = useGameStore()

  const guessSubmitting = ref(false)
  const submittedGuess = ref('')

  /**
   * Validates the guess payload against the schema.
   * @param payload The guess request payload
   * @returns Validation result with error code if invalid
   */
  function validateGuess(payload: GuessRequest):
    | { success: true, data: GuessRequest }
    | { success: false, error: GuessValidationError } {
    const result = GuessRequestSchema.safeParse(payload)

    if (!result.success) {
      const issueCode = result.error.issues[0]?.code
      if (issueCode === 'too_small') {
        return { success: false, error: 'empty' }
      }
      else if (issueCode === 'too_big') {
        return { success: false, error: 'tooLong' }
      }
      else {
        return { success: false, error: 'schemaError' }
      }
    }

    return { success: true as const, data: result.data }
  }

  /**
   * Submits a guess to the API and updates game state.
   * Handles game finalization if the guess is correct or max guesses reached.
   * @param guessText The guess text to submit
   * @param stopTimer Callback to stop the game timer
   * @returns Error code if submission fails, null if successful
   */
  async function submitGuess(
    guessText: string,
    stopTimer: () => number,
  ): Promise<'serverInvalid' | 'serverError' | null> {
    const activeGame = gameStore.activeGame
    if (!activeGame)
      return null

    const payload: GuessRequest = {
      newGuess: guessText,
      previousGuesses: activeGame.guesses.map(g => g.text),
      puzzleDate: activeGame.puzzleDate,
    }

    const validation = validateGuess(payload)
    if (!validation.success) {
      throw new Error(validation.error)
    }

    guessSubmitting.value = true
    submittedGuess.value = guessText

    try {
      console.log('SENDING', validation.data)

      const apiResult = await apiClient(GuessResultSchema, NUXT_API_ROUTES.GUESS, {
        method: 'POST',
        body: validation.data,
      })

      gameStore.addGuess({
        text: submittedGuess.value,
        correct: apiResult.correct,
        hint: apiResult.hint,
      })

      if (apiResult.answer) {
        gameStore.setFinalAnswer(apiResult.answer)
      }

      if (apiResult.correct || activeGame.guesses.length >= MAX_GUESSES) {
        const finalTime = stopTimer()
        gameStore.setCompletionTime(finalTime)
        gameStore.setElapsedTime(finalTime)
        gameStore.finalizeGameResult()
        gameStore.submitPuzzleResult()
      }

      return null
    }
    catch (error: any) {
      console.error('Error calling API:', error)
      await delay(500)

      if (error.statusCode === 429 || error.statusCode === 503) {
        return null
      }

      if (error?.data?.code === 'INVALID_INPUT') {
        return 'serverInvalid'
      }
      else {
        return 'serverError'
      }
    }
    finally {
      guessSubmitting.value = false
    }
  }

  return {
    guessSubmitting,
    submittedGuess,
    validateGuess,
    submitGuess,
  }
}
