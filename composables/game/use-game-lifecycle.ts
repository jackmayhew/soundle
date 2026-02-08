import { watchOnce } from '@vueuse/core'

/**
 * Composable for managing game lifecycle events.
 * Handles timer pause/resume on visibility changes, modal opens, and page unload.
 */
export function useGameLifecycle(
  stopTimer: () => number,
  startTimer: (initialTime?: number) => void,
  isGuessingDisabled: Ref<boolean>,
) {
  const gameStore = useGameStore()
  const uiStore = useUiStore()

  let pausedTime = 0

  /**
   * Pauses the game timer and stores the elapsed time.
   */
  function handlePause() {
    pausedTime = stopTimer()
    if (!gameStore.archiveGame) {
      gameStore.setElapsedTime(pausedTime)
    }
  }

  /**
   * Resumes the game timer if no modal is active.
   */
  function handleResume() {
    if (!uiStore.activeModal) {
      startTimer(pausedTime)
    }
  }

  /**
   * Starts the timer when puzzle is ready, but only if no modal is open.
   * Prevents timer from starting if a modal was opened before audio loaded.
   */
  function handlePuzzleReady() {
    if (!uiStore.activeModal) {
      startTimer()
    }
  }

  /**
   * Handles visibility change events (tab switching).
   * Pauses timer when tab is hidden, resumes when visible.
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      handlePause()
    }
    else {
      handleResume()
    }
  }

  /**
   * Saves elapsed time before page unload.
   */
  function handleBeforeUnload() {
    gameStore.setElapsedTime(stopTimer())
  }

  /**
   * Sets up watchers for modal state and game result changes.
   */
  function setupWatchers() {
    // Pause timer when a modal is opened
    watch(() => uiStore.activeModal, (modal) => {
      if (modal) {
        const pausedTime = stopTimer()

        // Start/resume timer when modal is closed
        watchOnce(() => uiStore.activeModal, () => {
          if (!isGuessingDisabled.value)
            startTimer(pausedTime)
        })
      }
    })

    // Stop timer when game is over (used if multiple tabs open)
    watch(() => gameStore.activeGame?.result, (newResult) => {
      if (newResult === 'win' || newResult === 'loss') {
        stopTimer()
      }
    })
  }

  /**
   * Initializes all lifecycle handlers and watchers.
   */
  function initialize() {
    setupWatchers()
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  /**
   * Cleans up event listeners.
   */
  function cleanup() {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  return {
    initialize,
    cleanup,
    handlePuzzleReady,
  }
}
