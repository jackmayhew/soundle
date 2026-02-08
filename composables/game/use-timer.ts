import type { TimerOptions } from '~/types/game/game-timer.types'
import { computed, onScopeDispose, ref } from 'vue'

/**
 * A reactive timer composable for tracking elapsed time.
 * Features separate intervals for UI updates and periodic progress saving,
 * and automatically cleans up intervals on component unmount.
 *
 * @param options Configuration for the timer.
 * @param options.initialElapsedTime The starting time in milliseconds.
 * @param options.onSave A callback function triggered periodically to persist the time.
 * @param options.saveInterval The frequency (in ms) at which the onSave callback is fired.
 */
export function useTimer(options: TimerOptions = {}) {
  const { initialElapsedTime = 0, onSave, saveInterval = 5000 } = options

  const startTime = ref<number | null>(null)
  const elapsedTime = ref(initialElapsedTime)
  let tickInterval: NodeJS.Timeout | null = null
  let saveTimerInterval: NodeJS.Timeout | null = null
  let baseElapsedTime = initialElapsedTime

  const formattedTime = computed(() => {
    const totalSeconds = Math.floor(elapsedTime.value / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  function start(resumeTime?: number) {
    if (tickInterval)
      return
    if (resumeTime !== undefined) {
      baseElapsedTime = resumeTime
    }

    startTime.value = Date.now()

    // Interval for updating the display
    tickInterval = setInterval(() => {
      elapsedTime.value = baseElapsedTime + (Date.now() - (startTime.value ?? 0))
    }, 100)

    // Separate, less frequent interval for saving progress
    if (onSave) {
      saveTimerInterval = setInterval(() => {
        onSave(elapsedTime.value)
      }, saveInterval)
    }
  }

  function stop() {
    if (tickInterval)
      clearInterval(tickInterval)
    if (saveTimerInterval)
      clearInterval(saveTimerInterval)
    tickInterval = null
    saveTimerInterval = null
    if (onSave) {
      onSave(elapsedTime.value)
    }
    return elapsedTime.value
  }

  onScopeDispose(() => {
    stop()
  })

  return { formattedTime, start, stop }
}
