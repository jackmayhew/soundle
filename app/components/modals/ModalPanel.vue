<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core'

const model = defineModel<boolean>()

const modalPanel = ref<HTMLElement | null>(null)
const contentWrapper = ref<HTMLElement | null>(null)
const previouslyFocusedElement = ref<HTMLElement | null>(null)

const titleId = 'modal-title'

// --- HEIGHT ANIMATION LOGIC ---
const { previousHeight } = useModalHeightAnimation(modalPanel, contentWrapper)

onMounted(() => {
  if (modalPanel.value)
    previousHeight.value = modalPanel.value.offsetHeight
})

// --- CLOSING LOGIC ---
onKeyStroke('Escape', () => {
  model.value = false
})

onClickOutside(modalPanel, () => {
  model.value = false
})

// --- FOCUS MANAGEMENT LOGIC ---
watch(model, async (isActive) => {
  if (isActive) {
    previouslyFocusedElement.value = document.activeElement as HTMLElement
    await nextTick()
    modalPanel.value?.focus()
    // Reset height tracker when opening
    if (modalPanel.value)
      previousHeight.value = modalPanel.value.offsetHeight
  }
  else {
    previouslyFocusedElement.value?.focus()
  }
})

function handleFocusTrap(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !modalPanel.value)
    return

  const focusableElements = modalPanel.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
  )
  if (focusableElements.length === 0) {
    e.preventDefault()
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  // Shift + Tab
  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      e.preventDefault()
      lastElement?.focus()
    }
  }
  // Tab
  else {
    if (document.activeElement === lastElement) {
      e.preventDefault()
      firstElement?.focus()
    }
  }
}
</script>

<template>
  <div
    ref="modalPanel"
    tabindex="-1"
    class="relative w-full my-auto max-w-sm border-3 border-light-border-primary dark:border-dark-border-primary bg-light-game-background dark:bg-dark-game-background rounded-2xl p-6 text-center focus:outline-none"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    @keydown="handleFocusTrap"
    @click.stop
  >
    <CloseButton class="absolute top-3 right-3 h-6 w-6 z-10" @click="model = false" />
    <div ref="contentWrapper" class="w-full">
      <slot />
    </div>
  </div>
</template>
