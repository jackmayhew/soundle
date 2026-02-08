<script setup lang="ts">
import type { GameInstance } from '~/types/game/game.types'

const props = defineProps<{
  resultData: GameInstance
}>()

const resultMessage = computed(() => {
  if (!props.resultData)
    return 'Results N/A'

  return props.resultData.result === 'win' ? 'Good Game!' : 'Nice try!'
})
</script>

<template>
  <div v-if="resultData" class="flex flex-col flex-grow">
    <h1
      class="main-title-ref text-4xl font-coop uppercase text-center text-light-text-primary dark:text-dark-text-primary"
      tabindex="-1"
    >
      {{ resultMessage }}
    </h1>
    <p class="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
      {{ formatPuzzleTitle(resultData?.puzzleNumber, resultData?.puzzleDate, true) }}
    </p>
    <div class="my-2 w-full flex justify-center">
      <AudioPlayer :src="resultData?.audioUrl" />
    </div>
    <h2 class="text-xl font-extrabold text-center uppercase text-light-text-primary dark:text-dark-text-primary leading-none">
      {{ resultData.answer }}.
    </h2>
    <div class="flex items-center justify-center mt-2">
      <div class="flex gap-2 full relative">
        <ResultsGlobalStats :puzzle-date="resultData.puzzleDate" />
        <Badge
          label="Time"
          :value="resultData.completionTime !== null ? formatPuzzleTime(resultData.completionTime) : 'N/A'"
          color="yellow"
          padding="px-3"
          aria-label="Puzzle completion time"
        />
        <ResultsHint :hint="resultData?.hint" />
      </div>
    </div>
    <ResultsGuessList :guesses="resultData.guesses" />
    <NavigationGrid />
  </div>
</template>
