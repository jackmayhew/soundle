<script setup lang="ts">
const gameStore = useGameStore()
const uiStore = useUiStore()

function handlePlayDaily() {
  uiStore.hideModal()
  gameStore.startDailyGame()
}
</script>

<template>
  <ModalHeader
    text="Whoops!"
    needs-sr
    sr-text="Share puzzle not found."
  />
  <p class="text-sm mb-2 text-light-text-primary dark:text-dark-text-primary">
    We couldn't find that puzzle. The link might be old or broken.
  </p>
  <BasicButton
    size="md"
    @click="handlePlayDaily"
  >
    Play Daily Puzzle
  </BasicButton>
</template>
