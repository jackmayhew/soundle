<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const currentStep = ref(1)
const TOTAL_SLIDES = 6

const { currentStepComponent } = useTutorialComponent(currentStep)

function nextSlide() {
  if (currentStep.value < TOTAL_SLIDES)
    currentStep.value++
}

function prevSlide() {
  if (currentStep.value > 1)
    currentStep.value--
}
</script>

<template>
  <Transition name="inner-modal" mode="out-in">
    <div :key="currentStep" class="flex flex-col h-full">
      <div class="flex-grow flex flex-col items-center pb-4">
        <component :is="currentStepComponent" />
      </div>

      <!-- Navigation Footer -->
      <div class="mt-auto flex items-center justify-between pt-4 border-t border-light-border-primary dark:border-dark-border-primary">
        <BaseButton
          :disabled="currentStep === 1"
          class="disabled:opacity-30 bg-yellow-primary hover:bg-yellow-secondary  border-3 border-light-border-primary dark:border-dark-border-primary text-black-primary rounded-lg font-bold flex items-center justify-center transition-all duration-200 ease-in-out"
          aria-label="Previous slide"
          @click="prevSlide"
        >
          <ChevronLeft :size="24" />
        </BaseButton>

        <span class="text-2xl font-bold font-coop select-none text-light-text-secondary dark:text-dark-text-secondary">
          {{ currentStep }} / {{ TOTAL_SLIDES }}
        </span>

        <BaseButton
          :disabled="currentStep === TOTAL_SLIDES"
          class="disabled:opacity-30 bg-yellow-primary hover:bg-yellow-secondary  border-3 border-light-border-primary dark:border-dark-border-primary text-black-primary rounded-lg font-bold flex items-center justify-center transition-all duration-200 ease-in-out"
          aria-label="Next slide"
          @click="nextSlide"
        >
          <ChevronRight :size="24" />
        </BaseButton>
      </div>
    </div>
  </Transition>
</template>
