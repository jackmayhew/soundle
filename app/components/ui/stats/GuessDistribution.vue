<script setup lang="ts">
import type { GuessDistribution } from '~/types/stats/user-stats.types'

defineProps<{
  distribution: GuessDistribution[]
  containerAriaLabel: string
  getItemAriaLabel: (dist: GuessDistribution) => string
}>()
</script>

<template>
  <div class="space-y-2" role="region" :aria-label="containerAriaLabel">
    <div class="text-sm font-bold text-light-text-primary dark:text-dark-text-primary text-center">
      Guess Distribution
    </div>
    <div
      v-for="dist in distribution"
      :key="dist.guess"
      class="flex items-center gap-2"
      role="img"
      :aria-label="getItemAriaLabel(dist)"
    >
      <span
        class="flex-shrink-0 border-3 border-light-border-primary dark:border-dark-border-primary rounded-md text-light-text-primary dark:text-dark-text-primary aspect-square h-6 flex items-center justify-center text-sm font-extrabold"
        aria-hidden="true"
      >
        {{ dist.guess }}
      </span>
      <div
        class="flex-grow rounded dark:border-2 h-6 relative overflow-hidden bg-gray-200 dark:bg-transparent dark:border-dark-border-primary"
        aria-hidden="true"
      >
        <div
          class="bg-green-tertiary h-full transition-all duration-300"
          :style="{ width: `${dist.percentage}%` }"
        />
        <span class="absolute text-center right-1 top-1/2 -translate-y-1/2 text-xs font-extrabold text-light-text-primary dark:text-dark-text-primary bg-gray-200 dark:bg-dark-game-background min-w-4 px-1 rounded">
          {{ dist.count }}
        </span>
      </div>
    </div>
  </div>
</template>
