import { useWindowSize } from '@vueuse/core'
import { onMounted, ref } from 'vue'

export function useDevice() {
  const isMobile = ref(false)
  const isIOS = ref(false)
  const { width } = useWindowSize()

  const checkForMobile = () => {
    // Looks for touch capability AND a small screen width.
    // This correctly excludes iPads in landscape mode and touchscreen laptops.
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // We consider anything under 768px (a common tablet breakpoint) to be "mobile-like"
    isMobile.value = hasTouch && width.value < 768
  }

  const checkForIOS = () => {
    const ua = navigator.userAgent

    // 1. Standard check (iPhone, iPod, old iPad)
    const isIosDevice = /iPad|iPhone|iPod/.test(ua)

    // 2. Modern check (iPadOS 13+ or iPhone in Desktop mode reports as Macintosh)
    const isMacWithTouch = ua.includes('Macintosh') && navigator.maxTouchPoints > 0

    isIOS.value = isIosDevice || isMacWithTouch
  }

  // We need to run the check on mount because the navigator object is only available client-side.
  // The watcher ensures it updates on resize (e.g., rotating a tablet).
  onMounted(() => {
    checkForMobile()
    checkForIOS()
    watch(width, checkForMobile)
  })

  return { isMobile, isIOS }
}
