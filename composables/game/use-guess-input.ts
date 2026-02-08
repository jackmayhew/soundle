import type { GuessError } from '~/types/game/guess/guess-error.types'

/**
 * Manages guess input state and errors.
 * Handles input value, error messages, and shake animation.
 */
export function useGuessInput() {
  const guessInput = ref('')
  const currentGuessError = ref<GuessError | null>(null)

  const errorMessages = {
    empty: '',
    tooLong: '100 characters max.',
    schemaError: 'An unexpected error occurred.',
    serverInvalid: 'Invalid guess.',
    serverError: 'Server error. Please try again.',
  }

  const displayMessage = computed(() => {
    return currentGuessError.value ? errorMessages[currentGuessError.value] : ''
  })

  /**
   * Clears the current error state.
   */
  function clearError() {
    currentGuessError.value = null
  }

  return {
    guessInput,
    currentGuessError,
    displayMessage,
    clearError,
  }
}
