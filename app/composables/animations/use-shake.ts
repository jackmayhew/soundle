import { ref } from 'vue'

export function useShake(duration = 500) {
  const isShaking = ref(false)

  function triggerShake() {
    if (isShaking.value)
      return

    isShaking.value = true
    setTimeout(() => {
      isShaking.value = false
    }, duration)
  }

  return {
    isShaking,
    triggerShake,
  }
}
