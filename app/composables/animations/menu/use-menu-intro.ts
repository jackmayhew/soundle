import { gsap } from 'gsap'

export function useMenuIntro() {
  const uiStore = useUiStore()

  function playMenuAnimation(elements: (HTMLElement | null)[]) {
    if (!uiStore.isInitialLoad)
      return

    const validElements = elements.filter((el): el is HTMLElement => el !== null)

    if (validElements.length === 0)
      return

    gsap.from(validElements, {
      delay: 0.2,
      duration: 0.4,
      opacity: 0,
      y: 15,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      force3D: true,
    })
  }

  return {
    playMenuAnimation,
  }
}
