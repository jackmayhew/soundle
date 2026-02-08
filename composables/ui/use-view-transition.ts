import type { Ref } from 'vue'

/**
 * Composable for managing scroll behavior and focus during view transitions.
 * Handles scroll momentum, position reset, and accessibility focus.
 */
export function useViewTransition(scrollContainer: Ref<HTMLElement | null> | undefined) {
  /**
   * Stops scroll momentum by temporarily disabling overflow.
   * Called before the old view leaves to prevent janky scroll behavior during transition.
   */
  function stopScrollMomentum() {
    if (scrollContainer?.value) {
      scrollContainer.value.style.overflowY = 'hidden'
    }
  }

  /**
   * Resets scroll position to top and restores scrolling ability.
   * Called before the new view enters to ensure it starts at the top.
   */
  function setScrollPosition() {
    if (scrollContainer?.value) {
      scrollContainer.value.scrollTop = 0
      scrollContainer.value.style.overflowY = 'scroll'
    }
  }

  /**
   * Focuses the main title element for accessibility.
   * Called after the new view enters to announce the view change to screen readers.
   */
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
