<script setup lang="ts">
import { CircleX, Copy, CopyCheck } from 'lucide-vue-next'
import { SITE_URL } from '~/constants/app/config'

const gameStore = useGameStore()

const { copied, copyError, performCopy } = useCopyAction()

function handleCopy() {
  if (!gameStore.activeGame)
    return

  const url = generatePuzzleUrl(gameStore.activeGame.puzzleDate, SITE_URL)
  performCopy(url)
}

const ariaLiveMessage = computed(() => {
  if (copied.value)
    return 'Copied to clipboard.'
  if (copyError.value)
    return 'Error copying link.'
  return ''
})
</script>

<template>
  <div>
    <ModalHeader text="Share It!" />
    <p class="mb-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
      Challenge your friends to see who's got the better ear.
    </p>
    <StatefulButton
      :success="copied"
      :error="copyError"
      size="md"
      @click="handleCopy"
    >
      Copy Link
      <BaseIcon
        :icon="Copy"
        :size="18"
        :stroke-width="2.5"
      />

      <template #success>
        <span class="font-bold">Copied!</span>
        <BaseIcon
          :icon="CopyCheck"
          :size="18"
          :stroke-width="2.5"
        />
      </template>

      <template #error>
        Error. Try Again
        <BaseIcon
          :icon="CircleX"
          :size="18"
          :stroke-width="2.5"
        />
      </template>
    </StatefulButton>
    <span class="sr-only" aria-live="polite" role="status">
      {{ ariaLiveMessage }}
    </span>
  </div>
</template>
