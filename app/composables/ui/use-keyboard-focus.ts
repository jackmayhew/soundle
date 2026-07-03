import type { Ref } from 'vue'
import { isRef } from 'vue'

export function useFocus() {
  const { isMobile } = useDevice()

  const focusInput = (input: Ref<HTMLInputElement | HTMLTextAreaElement | null> | HTMLInputElement | HTMLTextAreaElement | null) => {
    const element = isRef(input) ? input.value : input

    if (!element || isMobile.value)
      return

    element.focus()
  }

  return {
    focusInput,
  }
}
