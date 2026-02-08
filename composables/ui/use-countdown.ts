import type { ComputedRef } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { ref, watch } from 'vue'

/**
 * Manages a reactive 1-second interval countdown based on a target timestamp.
 * Used primarly for countdown in rate limit and service unavailable modals.
 * @param targetTimestamp - Reactive computed Unix timestamp (ms) for the countdown end.
 * @param onFinished - Optional callback triggered when the countdown reaches zero.
 * @returns Reactive `remainingSeconds` until the target is reached.
 */
export function useCountdown(
  targetTimestamp: ComputedRef<number | null | undefined>,
  onFinished?: () => void,
) {
  const remainingSeconds = ref(0)

  // Interval logic
  const { pause, resume } = useIntervalFn(() => {
    if (!targetTimestamp.value) {
      remainingSeconds.value = 0
      pause()
      return
    }

    const diff = Math.ceil((targetTimestamp.value - Date.now()) / 1000)

    if (diff <= 0) {
      remainingSeconds.value = 0
      pause()
      onFinished?.()
    }
    else {
      remainingSeconds.value = diff
    }
  }, 1000, {
    immediate: false,
    immediateCallback: true,
  })

  // Watch the timestamp: if it exists, start/resume. If not, stop.
  watch(targetTimestamp, (newVal) => {
    if (newVal) {
      resume()
    }
    else {
      remainingSeconds.value = 0
      pause()
    }
  }, { immediate: true })

  return {
    remainingSeconds,
  }
}
