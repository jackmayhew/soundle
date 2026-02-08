<script setup lang="ts">
import type { GuessError } from '~/types/game/guess/guess-error.types'

const props = defineProps<{
  isDisabled: boolean
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  submit: [guess: string]
}>()

const { focusInput } = useFocus()

const {
  guessInput,
  currentGuessError,
  displayMessage,
  clearError,
} = useGuessInput()

const { isShaking: guessInputIsShaking, triggerShake: setErrorShake } = useShake()

const inputRef = ref<HTMLInputElement | null>(null)

/**
 * Handles guess submission.
 * Validates input is not empty and emits to parent.
 */
function handleSubmit() {
  if (props.isDisabled || props.isSubmitting)
    return

  currentGuessError.value = null

  if (!guessInput.value.trim()) {
    currentGuessError.value = 'empty'
    setErrorShake()
    focusInput(inputRef)
    return
  }

  emit('submit', guessInput.value)
}

/**
 * Sets the input value and optionally an error.
 * Used by parent to restore input on API errors.
 */
function setInput(value: string, error: GuessError | null = null) {
  guessInput.value = value
  if (error) {
    currentGuessError.value = error
  }
}

/**
 * Clears the input value.
 */
function clearInput() {
  guessInput.value = ''
}

/**
 * Focuses the input field if not on mobile and no modal is active.
 */
function focusIfAllowed() {
  const uiStore = useUiStore()
  if (uiStore.currentAppStatus === 'operational') {
    focusInput(inputRef)
  }
}

defineExpose({
  setInput,
  clearInput,
  focusIfAllowed,
})
</script>

<template>
  <form
    class="flex gap-2 items-end"
    novalidate
    :disabled="isDisabled"
    @submit.prevent="handleSubmit"
  >
    <span class="sr-only" aria-live="polite" role="status">
      <span v-if="isSubmitting">Submitting guess...</span>
    </span>
    <div class="flex-grow pt-4 relative">
      <label for="guess-input" class="sr-only">Type your guess</label>
      <span
        id="guess-error"
        class="absolute top-0 left-0 text-xs text-red-error font-semibold"
        aria-live="polite"
      >
        {{ displayMessage }}
        <span v-if="currentGuessError === 'empty'" class="sr-only">
          Guess cannot be empty.
        </span>
      </span>
      <BaseInput
        id="guess-input"
        ref="inputRef"
        v-model="guessInput"
        type="text"
        placeholder="Type your guess..."
        :disabled="isDisabled || isSubmitting"
        :has-error="!!currentGuessError && currentGuessError !== 'empty'"
        :maxlength="100"
        aria-describedby="guess-error"
        class="disabled:cursor-not-allowed"
        :class="{
          'shake': guessInputIsShaking,
          'opacity-50': isDisabled,
        }"
        @keydown="clearError"
      />
    </div>
    <div :class="{ 'cursor-not-allowed': isDisabled || isSubmitting }">
      <BaseButton
        type="submit"
        class="relative p-2 px-4 bg-yellow-primary h-fit rounded-lg text-black-primary
        border-3 border-light-border-primary dark:border-dark-border-primary font-bold transition-all duration-300 ease-in-out hover:bg-yellow-secondary"
        :class="{
          'opacity-50 pointer-events-none': isDisabled,
          'pointer-events-none bg-yellow-secondary': isSubmitting,
        }"
        :disabled="isDisabled || isSubmitting"
      >
        <span :class="{ 'opacity-0': isSubmitting }">
          Guess
        </span>
        <LoadingSpinner v-if="isSubmitting" />
      </BaseButton>
    </div>
  </form>
</template>
