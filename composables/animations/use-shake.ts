import { ref } from 'vue'

/**
 * Manages the state for a shake animation.
 * @param duration The length of the animation in milliseconds.
 * @returns {object} An object containing `isShaking`,
 * a ref indicating the shake state, and `triggerShake`, a function to trigger the shake animation.
 */
export function useShake(duration = 500) {
  const isShaking = ref(false)

  /**
   * Triggers the shake state and resets it after the specified duration.
   * Prevents overlapping triggers.
   */
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
