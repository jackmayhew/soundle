<script setup lang="ts">
import type { UserStatistics } from '~/types/stats/user-stats.types'

defineProps<{
  userStats: UserStatistics
}>()
</script>

<template>
  <div id="shareCard" class="bg-[#ECF0F1] p-4 border-3 border-black-primary rounded-2xl text-black-primary w-[250px]">
    <div class="text-center mb-2">
      <h1 class="text-3xl font-coop">
        Soundle.
      </h1>
    </div>
    <div class="text-center mb-3">
      <div class="flex flex-col items-center">
        <span class="text-5xl font-bold font-coop">
          {{ userStats.currentStreak }}
        </span>
        <span class="text-sm uppercase text-black-primary -mt-1">
          Daily Win Streak
        </span>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-2 text-center w-full mx-auto mb-4">
      <div class="text-sm font-bold flex flex-col justify-center items-center">
        <span class="text-xs">
          Plays
        </span>
        <div class="w-full border-3 h-8 bg-orange-primary hover:bg-orange-secondary border-light-border-primary dark:border-dark-border-primary text-black-primary rounded-lg text-sm font-bold flex items-center justify-center transition-colors duration-300">
          {{ userStats.totalGames }}
        </div>
      </div>
      <div class="text-sm font-bold flex flex-col justify-center items-center">
        <span class="text-xs">
          Avg Time
        </span>
        <div class="w-full border-3 h-8 bg-yellow-primary hover:bg-yellow-secondary border-light-border-primary dark:border-dark-border-primary text-black-primary rounded-lg text-sm font-bold flex items-center justify-center transition-colors duration-300">
          {{ formatPuzzleTime(userStats.averageTime) }}
        </div>
      </div>
      <div class="text-sm font-bold flex flex-col justify-center items-center">
        <span class="text-xs">
          Win Rate
        </span>
        <div class="w-full border-3 h-8 bg-blue-primary hover:bg-blue-secondary border-light-border-primary dark:border-dark-border-primary text-black-primary rounded-lg text-sm font-bold flex items-center justify-center transition-colors duration-300">
          {{ userStats.winRate.toFixed(0) }}%
        </div>
      </div>
    </div>

    <div class="space-y-2" role="region" aria-label="Your guess distribution statistics">
      <div class="text-sm font-bold text-center">
        Guess Distribution
      </div>
      <div
        v-for="dist in userStats.guessDistribution"
        :key="dist.guess"
        class="flex items-center gap-2"
        role="img"
        :aria-label="`You guessed in ${dist.guess} ${dist.guess === 1 ? 'try' : 'tries'} ${dist.count} times, ${dist.percentage.toFixed(1)}% of your games`"
      >
        <span
          class="flex-shrink-0 border-3 border-light-border-primary dark:border-dark-border-primary rounded-md aspect-square h-[1.4rem] w-[1.4rem] flex items-center justify-center text-xs font-extrabold"
          aria-hidden="true"
        >
          {{ dist.guess }}
        </span>
        <div
          class="flex-grow rounded h-[1.4rem] relative overflow-hidden bg-gray-200"
          aria-hidden="true"
        >
          <div
            class="bg-green-tertiary h-full transition-all duration-300"
            :style="{ width: `${dist.percentage}%` }"
          />
          <span class="absolute text-center right-1 top-1/2 -translate-y-1/2 text-xs font-extrabold bg-gray-200 w-4 rounded">
            {{ dist.count }}
          </span>
        </div>
      </div>
    </div>
    <div class="text-center mt-4">
      <p class="font-coop">
        soundle.game
      </p>
    </div>
  </div>
</template>
