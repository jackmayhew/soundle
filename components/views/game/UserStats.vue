<script setup lang="ts">
import { Share2 } from 'lucide-vue-next'

const statsStore = useStatsStore()
const uiStore = useUiStore()

const userStats = computed(() => statsStore.stats)
</script>

<template>
  <div class="flex flex-col px-4 pb-4 min-h-full">
    <Header
      title="My Stats."
      subtitle="Track your streaks and stats."
    />
    <div>
      <div class="text-center mb-4">
        <div class="flex flex-col items-center">
          <span class="text-6xl font-bold font-coop text-light-text-primary dark:text-dark-text-primary">
            {{ userStats.currentStreak }}
          </span>
          <span class="text-sm uppercase text-light-text-secondary dark:text-dark-text-secondary -mt-1">
            Daily Win Streak
          </span>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2 text-center w-full xs-350:w-3/4 mx-auto mb-4">
        <Badge
          label="Plays"
          :value="userStats.totalGames"
          color="orange"
          aria-label="Total games played"
        />
        <Badge
          label="Avg Time"
          :value="formatPuzzleTime(userStats.averageTime)"
          color="yellow"
          aria-label="Average completion time"
        />
        <Badge
          label="Win Rate"
          :value="`${userStats.winRate.toFixed(0)}%`"
          color="purple"
          aria-label="Percentage of games won"
        />
      </div>
      <GuessDistribution
        :distribution="userStats.guessDistribution"
        container-aria-label="Your guess distribution statistics"
        :get-item-aria-label="
          (dist) => `You guessed in ${dist.guess} ${dist.guess === 1 ? 'try' : 'tries'} ${dist.count} times,
          ${dist.percentage.toFixed(1)}% of your games`"
      />
    </div>
    <div class="mt-auto pt-4">
      <BasicButton
        :icon="Share2"
        :icon-stroke-width="2.5"
        @click="uiStore.showModal('share')"
      >
        Share Stats
      </BasicButton>
    </div>
  </div>
</template>
