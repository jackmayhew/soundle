import { useClipboard } from '@vueuse/core'
import { ref } from 'vue'

export function useCopyAction(errorTimeout = 1500) {
  const { copy, copied } = useClipboard()
  const copyError = ref(false)

  async function performCopy(text: string) {
    copyError.value = false
    try {
      await copy(text)
    }
    catch (e) {
      console.error('Failed to copy to clipboard:', e)
      copyError.value = true
      setTimeout(() => {
        copyError.value = false
      }, errorTimeout)
    }
  }

  return {
    copied,
    copyError,
    performCopy,
  }
}
