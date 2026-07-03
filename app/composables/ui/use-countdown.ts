import type { ComputedRef } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { ref, watch } from 'vue'

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
