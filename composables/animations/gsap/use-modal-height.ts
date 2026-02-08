import type { Ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { gsap } from 'gsap'
import { ref } from 'vue'

/**
 * Handles smooth height animation for modal containers when content size changes.
 *
 * @param modalPanel - Ref to the outer modal container (the animating box)
 * @param contentWrapper - Ref to the inner content wrapper (the measured content)
 */
export function useModalHeightAnimation(
  modalPanel: Ref<HTMLElement | null>,
  contentWrapper: Ref<HTMLElement | null>,
) {
  const previousHeight = ref(0)

  useResizeObserver(contentWrapper, (entries) => {
    const entry = entries[0]
    if (!modalPanel.value || !entry)
      return

    const newContentHeight = entry.contentRect.height

    // Calculate total height including padding/borders
    const style = window.getComputedStyle(modalPanel.value)
    const verticalPadding = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)
    const verticalBorder = Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth)

    // const targetHeight = newContentHeight + verticalPadding + verticalBorder
    const targetHeight = Math.ceil(newContentHeight + verticalPadding + verticalBorder)

    // Skip if height hasn't effectively changed
    if (Math.abs(previousHeight.value - targetHeight) < 1) {
      previousHeight.value = targetHeight
      return
    }

    // Lock to old height
    modalPanel.value.style.height = `${previousHeight.value}px`
    modalPanel.value.style.overflow = 'hidden'

    // Animate
    gsap.to(modalPanel.value, {
      height: targetHeight,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        if (modalPanel.value) {
          modalPanel.value.style.height = 'auto'
          modalPanel.value.style.overflow = ''
        }
      },
    })

    previousHeight.value = targetHeight
  })

  return { previousHeight }
}
