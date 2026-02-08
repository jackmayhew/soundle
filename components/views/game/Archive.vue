<script setup lang="ts">
const gameStore = useGameStore()
const historyStore = useHistoryStore()

function handleDateClick(date: string) {
  if (historyStore.getGameByDate(date)) {
    historyStore.viewResults(date)
  }
  else {
    gameStore.startArchiveGame(date)
  }
}
</script>

<template>
  <div class="px-4 pb-4">
    <Header
      title="Archive."
      subtitle="Catch up on past puzzles."
      size="lg"
      margin-class="mb-4"
    >
      <dl class="flex justify-center mt-2 font-medium text-light-text-secondary dark:text-dark-text-secondary">
        <div class="flex gap-4">
          <div class="w-1/2 flex gap-1 text-sm justify-center items-center">
            <dt aria-hidden="true" class="bg-white-primary dark:bg-dark-game-background border-3 rounded border-light-border-primary dark:border-dark-border-primary aspect-square h-5" />
            <dd>Unplayed</dd>
          </div>
          <div class="w-1/2 flex gap-1 text-sm justify-center items-center">
            <dt aria-hidden="true" class="bg-blue-primary border-3 rounded border-light-border-primary dark:border-dark-border-primary aspect-square h-5" />
            <dd>Played</dd>
          </div>
        </div>
      </dl>
    </Header>
    <section
      v-for="(dates, month) in historyStore.archiveByMonth"
      :key="month"
      class="mb-4"
      :aria-labelledby="`month-${month.replace(/\s+/g, '-')}`"
    >
      <h2
        :id="`month-${month.replace(/\s+/g, '-')}`"
        class="text-lg font-black mb-2 text-light-text-primary dark:text-dark-text-primary"
      >
        {{ month }}
      </h2>
      <div class="grid grid-cols-7 gap-1 xs-300:gap-1.5 xs-350:gap-2">
        <BaseButton
          v-for="date in dates"
          :key="date"
          class="aspect-square rounded-lg font-extrabold border-3 border-light-border-primary dark:border-dark-border-primary text-[15px] sm:text-base transition-all duration-300 ease-in-out"
          :class="{
            'bg-blue-primary text-black-primary': historyStore.getGameByDate(date),
            'bg-white-primary dark:bg-dark-game-background text-light-text-primary dark:text-dark-text-primary hover:bg-blue-tertiary': !historyStore.getGameByDate(date),
          }"
          :aria-label="`Puzzle from ${new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`"
          @click="handleDateClick(date)"
        >
          {{ new Date(`${date}T12:00:00Z`).getDate() }}
        </BaseButton>
      </div>
    </section>
  </div>
</template>
