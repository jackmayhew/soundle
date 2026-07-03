import type { Ref } from 'vue'

export function useViewTransition(scrollContainer: Ref<HTMLElement | null> | undefined) {
  function stopScrollMomentum() {
    if (scrollContainer?.value) {
      scrollContainer.value.style.overflowY = 'hidden'
    }
  }

  function setScrollPosition() {
    if (scrollContainer?.value) {
      scrollContainer.value.scrollTop = 0
      scrollContainer.value.style.overflowY = 'scroll'
    }
  }

  function handleFocus() {
    const mainTitle = document.querySelector('.main-title-ref') as HTMLElement | null
    if (mainTitle)
      mainTitle.focus()
  }

  return {
    stopScrollMomentum,
    setScrollPosition,
    handleFocus,
  }
}
