<script setup lang="ts">
const gameStore = useGameStore()

const activeGame = computed(() => gameStore.activeGame)
const gameFetchStatus = computed(() => activeGame.value?.loadingStatus ?? 'loading')

onMounted(() => {
  gameStore.loadActivePuzzleData()
})
</script>

<template>
  <Transition name="view-fade" mode="out-in">
    <div :key="gameFetchStatus" class="min-h-full px-4 pb-4 flex flex-col">
      <GameBoard v-if="gameFetchStatus === 'success'" />
      <LoadingView
        v-else-if="gameFetchStatus === 'loading'"
        title="Loading..."
        message="Loading puzzle. Please wait..."
      />
      <ErrorView
        v-else
        message="There was an error loading this puzzle. Please try again."
        @retry="gameStore.loadActivePuzzleData()"
      />
    </div>
  </Transition>
</template>
