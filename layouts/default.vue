<script setup lang="ts">
const { isMobile } = useDevice()

const gameWrapperRef = ref<HTMLElement | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)

setupHead()

const { initializeThemeColor } = useThemeColor()
const { playIntroAnimation } = useAppIntro()

onMounted(() => {
  initializeThemeColor()
  playIntroAnimation(gameWrapperRef.value)
})

provide('scrollContainer', scrollContainer)
</script>

<template>
  <main
    class="bg-background h-dvh selection:bg-yellow-primary selection:text-black-secondary
    flex flex-col justify-center items-center p-2 overflow-hidden transition-colors"
    :class="isMobile === false ? 'duration-300' : 'duration-0'"
  >
    <div
      ref="gameWrapperRef"
      class="will-change-opacity w-full h-full max-w-[350px] max-h-[600px] border-light-border-primary dark:border-dark-border-primary border-3 rounded-2xl relative overflow-hidden opacity-0"
    >
      <div
        ref="scrollContainer"
        role="region"
        aria-label="App Content"
        class="game-container h-full w-full overflow-y-scroll"
      >
        <ErrorBoundary>
          <slot />
        </ErrorBoundary>
        <ModalManager />
      </div>
    </div>
  </main>
</template>
