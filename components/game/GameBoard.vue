<script setup lang="ts">
import type { AudioStatus } from '~/types/ui/audio.types'
import GuessInput from './GuessInput.vue'

const gameStore = useGameStore()
const userStore = useUserStore()
const uiStore = useUiStore()

const audioStatus = ref<AudioStatus>('loading')

const activeGame = computed(() => gameStore.activeGame)
const isGameDisabled = computed(() => gameStore.isGameDisabled)

const isGuessingDisabled = computed(() => {
  return isGameDisabled.value || audioStatus.value !== 'ready'
})

const { formattedTime, start, stop } = useTimer({
  initialElapsedTime: activeGame.value?.elapsedTime ?? 0,
  onSave: time => gameStore.setElapsedTime(time),
})

const {
  initialize,
  cleanup,
  handlePuzzleReady,
} = useGameLifecycle(stop, start, isGuessingDisabled)

const {
  guessSubmitting,
  submittedGuess,
  validateGuess,
  submitGuess,
} = useGuessSubmission()

const guessInputRef = ref<InstanceType<typeof GuessInput> | null>(null)

/**
 * Handles guess submission from the input component.
 * Validates, submits to API, and handles errors.
 */
async function handleGuess(guessText: string) {
  if (isGuessingDisabled.value || !activeGame.value)
    return

  const payload = {
    newGuess: guessText,
    previousGuesses: activeGame.value.guesses.map(g => g.text),
    puzzleDate: activeGame.value.puzzleDate,
  }

  const validation = validateGuess(payload)
  if (!validation.success) {
    guessInputRef.value?.setInput(guessText, validation.error)
    return
  }

  guessInputRef.value?.clearInput()

  const error = await submitGuess(guessText, stop)

  await nextTick()

  if (error) {
    guessInputRef.value?.setInput(guessText, error)
  }

  guessInputRef.value?.focusIfAllowed()
}

/**
 * Starts the timer when audio is ready, if no modal is open.
 */
function onPuzzleReady() {
  handlePuzzleReady()
}

/**
 * Shows the tutorial modal on first play
 */
function handleShowTutorial() {
  if (!userStore.hasPlayedBefore) {
    uiStore.showModal('gameTutorial')
    userStore.hasPlayedBefore = true
  }
}

onMounted(() => {
  initialize()
  handleShowTutorial()
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div v-if="activeGame && activeGame.audioUrl" class="w-full flex flex-col flex-grow">
    <GameHeader
      :active-game="activeGame"
      :timer="formattedTime"
    />
    <div class="mt-4 w-full flex justify-center">
      <AudioPlayer
        v-model:status="audioStatus"
        :src="activeGame?.audioUrl"
        @ready="onPuzzleReady"
      />
    </div>
    <GuessInput
      ref="guessInputRef"
      :is-disabled="isGuessingDisabled"
      :is-submitting="guessSubmitting"
      @submit="handleGuess"
    />
    <GuessList
      :guesses="activeGame.guesses"
      :is-disabled="isGuessingDisabled"
      :is-submitting="guessSubmitting"
      :submitted-guess="submittedGuess"
    />
    <NavigationGrid />
  </div>
</template>
