<script setup lang="ts">
const uiStore = useUiStore()
const { currentComponent } = useAppViewState()
const scrollContainer = inject<Ref<HTMLElement | null>>('scrollContainer')

const { stopScrollMomentum, setScrollPosition, handleFocus } = useViewTransition(scrollContainer)
</script>

<template>
  <div class="h-full bg-light-game-background dark:bg-dark-game-background">
    <ClientOnly>
      <Transition
        name="view-fade"
        mode="out-in"
        @before-leave="stopScrollMomentum"
        @before-enter="setScrollPosition"
        @after-enter="handleFocus"
      >
        <div
          :key="uiStore.view"
          class="h-full bg-light-game-background dark:bg-dark-game-background will-change-opacity"
        >
          <component :is="currentComponent" />
        </div>
      </Transition>
    </ClientOnly>
  </div>
</template>
