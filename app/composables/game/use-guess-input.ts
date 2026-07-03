import type { GuessError } from '~/types/game/guess/guess-error.types'

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
