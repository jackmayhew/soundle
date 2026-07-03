import { gsap } from 'gsap'

export function useAppIntro() {
  const uiStore = useUiStore()

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
