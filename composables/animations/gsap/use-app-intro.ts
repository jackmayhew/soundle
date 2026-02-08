import { gsap } from 'gsap'

/**
 * Initial app fade-in animation.
 * Animates the game wrapper opacity on first load.
 */
export function useAppIntro() {
  const uiStore = useUiStore()

  /**
   * Animates the game wrapper element with a fade-in effect.
   * Marks the initial load as complete when animation finishes.
   * @param element The element to animate
   */
  function playIntroAnimation(element: HTMLElement | null) {
    if (!element)
      return

    gsap.to(element, {
      duration: 1,
      delay: 0.3,
      opacity: 1,
      ease: 'power3.out',
      onComplete: () => {
        uiStore.markInitialLoadComplete()
      },
    })
  }

  return {
    playIntroAnimation,
  }
}
