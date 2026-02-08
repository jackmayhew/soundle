<script setup lang="ts">
const globalStatsStore = useGlobalStatsStore()

const stats = computed(() => globalStatsStore.activeGlobalStats)
const loadingState = computed(() => globalStatsStore.activeLoadingState)
</script>

<template>
  <ModalHeader
    text="Global Stats."
    size="lg"
  />

  <Transition name="inner-modal" mode="out-in">
    <div v-if="loadingState === 'loading'" class="text-center text-light-text-secondary dark:text-dark-text-secondary mt-4" >
      <div class="text-center pb-[1.5px]">
        <LoadingSpinner
          position="inline"
          margin-class="mb-2"
          height="h-8"
          width="w-8"
          border-color="border-light-text-primary dark:border-dark-text-primary"
        />
        <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Loading global stats. Please wait a moment...
        </p>
      </div>
    </div>

    <div v-else-if="loadingState === 'error'" class="text-center mt-2">
      <p class="text-light-text-secondary dark:text-dark-text-secondary mb-2 text-sm">
        Failed to load global stats. Please try again.
      </p>
      <BasicButton
        size="md"
        @click="globalStatsStore.fetchGlobalStats()"
      >
        Retry
      </BasicButton>
    </div>

    <div v-else-if="stats" class="space-y-3">
      <p class="text-light-text-secondary dark:text-dark-text-secondary text-sm leading-normal -mt-1">
        See how other players guessed.
      </p>
      <div class="grid grid-cols-3 gap-2 text-center w-full xs-350:w-3/4 mx-auto">
        <Badge
          label="Plays"
          :value="stats.totalPlays ?? 'N/A'"
          color="orange"
          label-spacing="mb-0.5"
          label-text-size="text-xs"
          aria-label="Total games played"
        />
        <Badge
          label="Avg Time"
          :value="stats.averageTime != null ? formatPuzzleTime(stats.averageTime) : 'N/A'"
          color="yellow"
          label-spacing="mb-0.5"
          label-text-size="text-xs"
          aria-label="Average completion time"
        />
        <Badge
          label="Win Rate"
          :value="stats.winRate != null ? `${stats.winRate.toFixed(0)}%` : 'N/A'"
          color="purple"
          label-spacing="mb-0.5"
          label-text-size="text-xs"
          aria-label="Percentage of games won"
        />
      </div>
      <GuessDistribution
        :distribution="stats.guessDistribution"
        container-aria-label="Guess distribution statistics"
        :get-item-aria-label="(dist) => `${dist.count} players guessed in ${dist.guess} ${dist.guess === 1 ? 'try' : 'tries'}, ${dist.percentage.toFixed(1)}% of total`"
      />
    </div>
  </Transition>
</template>
