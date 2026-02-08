<script setup lang="ts">
import type { ResultsShareOptions } from '~/types/share/results'
import { ArrowLeft, CircleCheckBig, CircleX, ImageDown, ImagePlus, X } from 'lucide-vue-next'

const gameStore = useGameStore()
const historyStore = useHistoryStore()
const { isMobile } = useDevice()

const shareOptions = ref<ResultsShareOptions>({
  showAnswer: false,
  showGuesses: false,
})

const fileName = `soundle-results-${historyStore.resultsDate}.png`

const {
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
} = useImageShare({
  elementId: 'shareCard',
  fileName,
})

const resultData = computed(() => {
  if (historyStore.resultsDate)
    return historyStore.getGameByDate(historyStore.resultsDate)
  if (gameStore.dailyGame.result !== 'pending')
    return gameStore.dailyGame
  return null
})

const previewImageButtonText = computed(() => generationError.value ? 'Error! Try again.' : isGenerating.value ? 'Generating' : 'Generate Image')

const downloadImageButtonText = computed(() => {
  if (shareError.value)
    return 'Share Failed'
  if (imageDownloadSuccess.value)
    return 'Success!'
  return isWebShareSupported.value ? 'Share Image' : 'Download Image'
})

const instructionText = computed(() => isMobile.value
  ? 'Long-press the image to save it, or use the share button below.'
  : 'Right-click the image to save it, or use the button below.')
</script>

<template>
  <div>
    <span class="sr-only" aria-live="polite" role="status">
      {{ ariaLiveMessage }}
    </span>

    <!-- Off-screen capture target -->
    <div class="fixed top-0 left-0 h-0 overflow-hidden">
      <ShareResultImg
        v-if="resultData"
        :result="resultData"
        :options="shareOptions"
      />
    </div>

    <Transition name="inner-modal" mode="out-in">
      <!-- VIEW 1: Options -->
      <div v-if="!showPreview">
        <ModalHeader text="Share It!" />
        <p class="mb-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Share your score and challenge your friends.
        </p>

        <FormGroup title="Options" class="mb-4">
          <FormToggle
            id="withAnswerToggle"
            label="Include Puzzle Answer"
            :checked="shareOptions.showAnswer"
            @click="shareOptions.showAnswer = !shareOptions.showAnswer"
          />
          <FormToggle
            id="withGuessesToggle"
            label="Include Your Guesses"
            class="mt-1"
            :checked="shareOptions.showGuesses"
            @click="shareOptions.showGuesses = !shareOptions.showGuesses"
          />
        </FormGroup>

        <div class="flex flex-col gap-2">
          <StatefulButton :loading="isGenerating" :error="generationError" :disabled="!resultData" @click="generateImage">
            {{ previewImageButtonText }}
            <BaseIcon :icon="ImagePlus" :size="18" :stroke-width="2.5" />
            <template #error>
              {{ previewImageButtonText }}
              <BaseIcon :icon="CircleX" :size="18" :stroke-width="2.5" />
            </template>
          </StatefulButton>

          <CopyResultsButton :result="resultData" :options="shareOptions" :disable-copy="isGenerating" />
        </div>
      </div>

      <!-- VIEW 2: Preview & Actions -->
      <div v-else>
        <BaseButton
          class="flex items-center justify-center text-light-text-secondary dark:text-dark-text-secondary absolute top-3 left-3 h-6 w-6 group"
          aria-label="Back to share options"
          @click="showPreview = false"
        >
          <ArrowLeft class="arrow-back" :size="16" />
        </BaseButton>

        <ModalHeader text="Preview." needs-sr sr-text="Preview of shareable image" />
        <p class="mb-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {{ instructionText }}
        </p>

        <img
          :src="imageDataUrl"
          alt="Your soundle puzzle results"
          class="results-img w-2/3 mx-auto mb-4"
        >

        <div :class="{ 'cursor-not-allowed': imageDownloadSuccess || imageIsDownloading }">
          <StatefulButton
            :loading="imageIsDownloading"
            :success="imageDownloadSuccess"
            :error="shareError"
            @click="shareImage"
          >
            {{ downloadImageButtonText }}
            <BaseIcon :icon="ImageDown" :size="18" :stroke-width="2.5" />

            <template #success>
              {{ downloadImageButtonText }}
              <BaseIcon :icon="CircleCheckBig" :size="18" :stroke-width="2.5" />
            </template>

            <template #error>
              {{ downloadImageButtonText }}
              <BaseIcon :icon="X" :size="18" :stroke-width="2.5" />
            </template>
          </StatefulButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.results-img {
  -webkit-user-drag: none;
  -webkit-touch-callout: default;
}

.arrow-back {
  transition: transform 300ms ease-in-out;
  will-change: transform;
}

@media (hover: hover) {
  .group:hover .arrow-back { transform: translateX(-0.125rem); }
}
</style>
