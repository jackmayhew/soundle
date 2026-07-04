import { watchOnce } from '@vueuse/core'

export function useGameLifecycle(
  stopTimer: () => number,
  startTimer: (initialTime?: number) => void,
  isGuessingDisabled: Ref<boolean>,
) {
  const gameStore = useGameStore()
  const uiStore = useUiStore()

  let pausedTime = 0

  function handlePause() {
    pausedTime = stopTimer()
    if (!gameStore.archiveGame) {
      gameStore.setElapsedTime(pausedTime)
    }
  }

  function handleResume() {
    if (!uiStore.activeModal) {
      startTimer(pausedTime)
    }
  }

  function handlePuzzleReady() {
    if (!uiStore.activeModal) {
      startTimer()
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      handlePause()
    }
    else {
      handleResume()
    }
  }

  function handleBeforeUnload() {
    gameStore.setElapsedTime(stopTimer())
  }

  function setupWatchers() {
    watch(() => uiStore.activeModal, (modal) => {
      if (modal) {
        const pausedTime = stopTimer()

        watchOnce(() => uiStore.activeModal, () => {
          if (!isGuessingDisabled.value)
            startTimer(pausedTime)
        })
      }
    })

    // Another tab may finish the game and sync the result here.
    watch(() => gameStore.activeGame?.result, (newResult) => {
      if (newResult === 'win' || newResult === 'loss') {
        stopTimer()
      }
    })
  }

  function initialize() {
    setupWatchers()
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

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
