import { toPng } from 'html-to-image'

interface UseImageShareOptions {
  elementId: string
  fileName: string
}

export function useImageShare({ elementId, fileName }: UseImageShareOptions) {
  const { isMobile } = useDevice()
  const { trackException } = useTrackException()
  const isGenerating = ref(false)
  const generationError = ref(false)
  const showPreview = ref(false)
  const imageDataUrl = ref('')
  const imageIsDownloading = ref(false)
  const imageDownloadSuccess = ref(false)
  const shareError = ref(false)
  const isWebShareSupported = ref(false)

  onMounted(() => {
    if (isMobile.value && 'share' in navigator) {
      isWebShareSupported.value = true
    }
  })

  async function getFontEmbedCSS(fontUrl: string, fontFamily: string, fontWeight: string | number = 'normal') {
    const response = await fetch(fontUrl)
    const blob = await response.blob()
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    return `@font-face { font-family: '${fontFamily}-Embedded'; src: url(${dataUrl}); font-weight: ${fontWeight}; }`
  }

  function dataURLtoFile(dataurl: string, filename: string): File | null {
    const arr = dataurl.split(',')
    if (!arr[0] || !arr[1])
      return null
    const mimeMatch = arr[0].match(/:(.*?);/)
    const mime = mimeMatch ? mimeMatch[1] : 'image/png'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) u8arr[n] = bstr.charCodeAt(n)
    return new File([u8arr], filename, { type: mime })
  }

  async function generateImage() {
    isGenerating.value = true
    generationError.value = false
    const cardElement = document.getElementById(elementId)

    if (!cardElement) {
      console.error(`Element #${elementId} not found.`)
      generationError.value = true
      isGenerating.value = false
      return
    }

    try {
      const fonts = [
        { url: '/fonts/share-results/Inter.ttf', name: 'Inter', weight: 400 },
        { url: '/fonts/share-results/Inter-Black.woff2', name: 'Inter', weight: 900 },
        { url: '/fonts/share-results/Crumb.woff', name: 'Crumb' },
      ]

      const fontCssArray = await Promise.all(fonts.map(f => getFontEmbedCSS(f.url, f.name, f.weight)))
      const embeddedFontCSS = `${fontCssArray.join('')}
        #${elementId} { font-family: 'Inter-Embedded', sans-serif !important; }
        #${elementId} .font-crumb { font-family: 'Crumb-Embedded', sans-serif !important; }`

      const styleEl = document.createElement('style')
      styleEl.id = 'temp-embedded-fonts'
      styleEl.textContent = embeddedFontCSS
      document.head.appendChild(styleEl)

      await document.fonts.ready
      await delay(300)

      const options = {
        quality: 0.95,
        pixelRatio: 4,
        fontEmbedCSS: embeddedFontCSS,
        style: { borderRadius: '1rem', border: '3px solid #000' },
      }

      // html-to-image needs a warm-up pass for embedded fonts/layout to settle.
      await toPng(cardElement, options)
      const dataUrl = await toPng(cardElement, options)

      document.getElementById('temp-embedded-fonts')?.remove()
      imageDataUrl.value = dataUrl

      await new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Image load failed'))
        img.src = dataUrl
      })

      showPreview.value = true
    }
    catch (error: any) {
      trackException('ImageGenError', error)
      await delay(500)
      generationError.value = true
      setTimeout(() => {
        generationError.value = false
      }, 1500)
    }
    finally {
      isGenerating.value = false
      document.getElementById('temp-embedded-fonts')?.remove()
    }
  }

  async function shareImage() {
    if (isWebShareSupported.value) {
      const file = dataURLtoFile(imageDataUrl.value, fileName)
      if (!file || !navigator.canShare?.({ files: [file] })) {
        shareError.value = true
        return
      }
      imageIsDownloading.value = true
      try {
        await navigator.share({ files: [file], title: 'Soundle', text: 'Check this out!' })
        imageDownloadSuccess.value = true
      }
      catch {
        console.log('Share cancelled')
      }
      finally {
        imageIsDownloading.value = false
        setTimeout(() => {
          imageDownloadSuccess.value = false
        }, 1500)
      }
    }
    else {
      imageIsDownloading.value = true
      const link = document.createElement('a')
      link.href = imageDataUrl.value
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => {
        imageIsDownloading.value = false
        imageDownloadSuccess.value = true
        setTimeout(() => {
          imageDownloadSuccess.value = false
        }, 1500)
      }, 500)
    }
  }

  const ariaLiveMessage = computed(() => {
    if (isGenerating.value)
      return 'Generating image...'
    if (generationError.value)
      return 'Image generation failed.'
    if (imageIsDownloading.value)
      return 'Processing...'
    if (imageDownloadSuccess.value)
      return 'Success!'
    if (shareError.value)
      return 'Sharing failed.'
    return ''
  })

  return {
    isGenerating,
    generationError,
    showPreview,
    imageDataUrl,
    imageIsDownloading,
    imageDownloadSuccess,
    shareError,
    isWebShareSupported,
    ariaLiveMessage,
    generateImage,
    shareImage,
  }
}
