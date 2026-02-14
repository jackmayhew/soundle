<script setup lang="ts">
// UI State & View Logic
const uiStore = useUiStore()
const { currentComponent } = useAppViewState()
const { isMobile } = useDevice()

// DOM management and animations
const gameWrapperRef = ref<HTMLElement | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)

// Composables
setupHead()
const { initializeUrlHandlers } = useUrlHandlers()
const { initializeThemeColor } = useThemeColor()
const { playIntroAnimation } = useAppIntro()

// View Transition Logic
const {
  stopScrollMomentum,
  setScrollPosition,
  handleFocus,
} = useViewTransition(scrollContainer)

onMounted(() => {
  initializeUrlHandlers()
  initializeThemeColor()
  playIntroAnimation(gameWrapperRef.value)
})
</script>

<template>
  <main
    class="bg-background h-dvh selection:bg-yellow-primary selection:text-black-secondary
    flex flex-col justify-center items-center p-2 overflow-hidden transition-colors"
    :class="isMobile === false ? 'duration-300' : 'duration-0'"
  >
    <!-- Main UI Frame -->
    <div
      ref="gameWrapperRef"
      class="will-change-opacity w-full h-full max-w-[350px] max-h-[600px] border-light-border-primary dark:border-dark-border-primary border-3 rounded-2xl relative overflow-hidden opacity-0"
    >
      <!-- Scrollable Content Area -->
      <div
        ref="scrollContainer"
        role="region"
        aria-label="App Content"
        class="game-container h-full w-full overflow-y-scroll"
      >
        <ErrorBoundary>
          <div class="h-full bg-light-game-background dark:bg-dark-game-background">
            <ClientOnly>
              <Transition
                name="view-fade"
                mode="out-in"
                @before-leave="stopScrollMomentum"
                @before-enter="setScrollPosition"
                @after-enter="handleFocus"
              >
                <!-- Dynamic View Swapper -->
                <div
                  :key="uiStore.view"
                  class="h-full bg-light-game-background dark:bg-dark-game-background will-change-opacity"
                >
                  <component :is="currentComponent" />
                </div>
              </Transition>
            </ClientOnly>
          </div>
        </ErrorBoundary>

        <!-- Global Modals -->
        <ModalManager />
      </div>
    </div>
  </main>
</template>
