<script setup lang="ts">
const historyStore = useHistoryStore()
const gameStore = useGameStore()

const resultData = computed(() => {
  if (!historyStore.resultsDate)
    return null

  return historyStore.getGameByDate(historyStore.resultsDate)
})

function replayPuzzle() {
  const invalidDate = historyStore.resultsDate
  if (!invalidDate) {
    console.error('replayPuzzle was called without a valid resultsDate. This should not happen.')
    return
  }

  historyStore.deleteGameFromHistory(invalidDate)
  gameStore.startArchiveGame(invalidDate)
}
</script>

<template>
  <Transition name="view-fade" mode="out-in">
    <div :key="resultData?.puzzleDate" class="min-h-full p-4 flex flex-col">
      <ResultsBoard v-if="resultData" :result-data="resultData" />
      <ErrorView
        v-else
        message="There was an error loading results for this puzzle. Would you like to play it?"
        button-text="Play Puzzle"
        @retry="replayPuzzle"
      />
    </div>
  </Transition>
</template>
