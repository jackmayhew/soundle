import { gsap } from 'gsap'

/**
 * Animates the MenuGrid squares on initial load.
 */
export function useGridIntro() {
  const uiStore = useUiStore()

  /**
   * Animates grid squares with a staggered pop-in effect.
   * Only runs on initial app load.
   * @param elements Array of grid square HTML elements
   */
  function playGridAnimation(elements: (HTMLElement | null)[]) {
    if (!uiStore.isInitialLoad)
      return

    const validElements = elements.filter((el): el is HTMLElement => el !== null)
    if (validElements.length === 0)
      return

    const tl = gsap.timeline()

    tl.fromTo(
      validElements,
      { opacity: 0, scale: 0.9, y: 10 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.05,
        delay: 0.5,
      },
    )
  }

  return { playGridAnimation }
}
