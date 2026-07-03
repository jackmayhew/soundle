import { gsap } from 'gsap'

export function useGridIntro() {
  const uiStore = useUiStore()

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
