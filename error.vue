<script setup lang="ts">
import { gsap } from 'gsap'

const handleError = () => clearError({ redirect: '/' })

const gameWrapperRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!gameWrapperRef.value)
    return
  gsap.to(gameWrapperRef.value, {
    duration: 1,
    delay: 0.3,
    opacity: 1,
    ease: 'power3.out',
  })
})
</script>

<template>
  <main
    class="bg-background h-dvh selection:bg-yellow-primary selection:text-selection-text
    flex flex-col justify-center items-center p-2 overflow-hidden transition-colors duration-300"
  >
    <div
      ref="gameWrapperRef"
      class="will-change-opacity w-full h-full max-w-[350px] max-h-[600px] border-light-border-primary dark:border-dark-border-primary border-3 rounded-2xl relative overflow-hidden opacity-0"
    >
      <div
        role="region"
        aria-label="App Content"
        class="game-container h-full w-full overflow-y-scroll flex flex-col justify-center items-center text-center p-4"
      >
        <div class="text-5xl">
          ⚠️
        </div>
        <h1 class="main-title-ref text-5xl font-bold text-light-text-primary dark:text-dark-text-primary font-coop">
          Page Not Found.
        </h1>
        <p class="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
          The page you're looking for doesn't exist.
        </p>
        <div class="mt-3 w-full">
          <BasicButton
            variant="green"
            @click="handleError"
          >
            Go Home
          </BasicButton>
        </div>
      </div>
    </div>
  </main>
</template>
