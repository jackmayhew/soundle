import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Manages the rhythmic animation state for MainMenu 9-cell grid.
 *
 * Sets up an interval to randomly activate a square every 2000ms, assigning
 * a random color and icon while preventing immediate repetition. The active
 * state persists for 1000ms before resetting.
 *
 * @param {any[]} icons - Array of icon components to cycle through.
 */
export function useGridTicker(icons: any[]) {
  const uiStore = useUiStore()

  const activeState = ref({
    index: null as number | null,
    color: undefined as string | undefined,
    icon: null as any,
  })

  let animationInterval: ReturnType<typeof setInterval> | null = null
  let clearTimeoutId: ReturnType<typeof setTimeout> | null = null
  let lastSquare: number | null = null
  let lastIcon: any = null

  function animateSquare() {
    // Select Square (No Repeat)
    let newIndex = Math.floor(Math.random() * 9)
    while (newIndex === lastSquare) {
      newIndex = Math.floor(Math.random() * 9)
    }
    lastSquare = newIndex

    // Select Color
    const colors = [
      'bg-accent-blue',
      'bg-accent-orange',
      'bg-accent-red',
      'bg-accent-lavender',
      'bg-accent-rose',
      'bg-accent-sage',
    ]

    const newColor = colors[Math.floor(Math.random() * colors.length)]

    // Select Icon (No Repeat)
    let newIcon = icons[Math.floor(Math.random() * icons.length)]
    while (newIcon === lastIcon && icons.length > 1) {
      newIcon = icons[Math.floor(Math.random() * icons.length)]
    }
    lastIcon = newIcon

    activeState.value = {
      index: newIndex,
      color: newColor,
      icon: newIcon,
    }

    clearTimeoutId = setTimeout(() => {
      activeState.value = { index: null, color: undefined, icon: null }
    }, 1300)
  }

  onMounted(async () => {
    if (uiStore.isInitialLoad)
      await delay(2000)
    else
      await delay(1000)
    animateSquare()
    animationInterval = setInterval(animateSquare, 2000)
  })

  onUnmounted(() => {
    if (animationInterval)
      clearInterval(animationInterval)
    if (clearTimeoutId)
      clearTimeout(clearTimeoutId)
  })

  return { activeState }
}
