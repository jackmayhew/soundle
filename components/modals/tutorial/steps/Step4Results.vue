<script setup lang="ts">
import { TUTORIAL_GUESSES } from '~/constants/game/tutorial'

const activeHintIndex = ref<number | null>(null)

function toggleHint(index: number) {
  activeHintIndex.value = activeHintIndex.value === index ? -1 : index
}

onMounted(async () => {
  await delay(1000)
  activeHintIndex.value = 0
})
</script>

<template>
  <div class="flex flex-col items-center text-center w-full">
    <ModalHeader text="Hints." />

    <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
      Incorrect guesses earn you a hint.
      Use that feedback to refine your next guess and win the game!
    </p>

    <ul class="w-full list-none p-0 m-0 space-y-3">
      <li
        v-for="(guess, index) in TUTORIAL_GUESSES"
        :key="index"
        class="h-fit flex items-center gap-2 min-w-0 transition-all duration-300 ease-in-out"
      >
        <div class="flex-shrink-0 border-3 rounded-md border-light-border-primary dark:border-dark-border-primary bg-white-primary dark:bg-dark-game-background text-light-text-primary dark:text-dark-text-primary aspect-square h-7 flex items-center justify-center text-sm font-extrabold">
          {{ index + 1 }}
        </div>

        <span class="text-lg flex-1 truncate min-w-0 uppercase font-medium text-left 'text-light-text-primary dark:text-dark-text-primary">
          {{ guess.text }}
        </span>

        <GuessHint
          v-if="guess.hint"
          :hint="guess.hint"
          hint-component-size="small"
          :is-open="activeHintIndex === index"
          @toggle="toggleHint(index)"
          @close="activeHintIndex = -1"
        />

        <GuessResultIcon :correct="guess.correct" />
      </li>
    </ul>

    <p class="mt-6 text-xs italic text-light-text-secondary/60">
      Next: Meet your toolkit.
    </p>
  </div>
</template>
