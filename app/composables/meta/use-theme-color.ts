export function useThemeColor() {
  const colorMode = useColorMode()

  function initializeThemeColor() {
    watch(() => colorMode.value, (newMode) => {
      let meta = document.querySelector('meta[name="theme-color"]')
      const color = newMode === 'dark' ? '#121212' : '#ECF0F1'

      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'theme-color')
        meta.setAttribute('content', color)
        document.head.appendChild(meta)
      }
      else {
        meta.setAttribute('content', color)
      }
    })
  }

  return {
    initializeThemeColor,
  }
}
