import type { Ref } from 'vue'
import { isRef } from 'vue'

/**
 * Composable for programmatically focusing an input element.
 * Skips focus on mobile to prevent the virtual keyboard from opening automatically.
 */
export function useFocus() {
  const { isMobile } = useDevice()

  /**
   * Focuses the provided input element.
   * On mobile, this intentionally does nothing to prevent the
   * keyboard from obscuring the screen before user interaction.
   * @param input A Vue ref to the element, or the element itself.
   */
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
