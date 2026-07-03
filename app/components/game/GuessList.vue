<script setup lang="ts">
import type { GuessResult } from '~/types/game/guess/guess-result.types'
import { MAX_GUESSES } from '~/constants/app/validation'

defineProps<{
  guesses: GuessResult[]
  isDisabled: boolean
  isSubmitting: boolean
  submittedGuess: string
}>()

const activeHintIndex = ref<number | null>(null)

function toggleHint(index: number) {
  activeHintIndex.value = activeHintIndex.value === index ? null : index
}

function closeHint() {
  activeHintIndex.value = null
}
</script>

<template>
  <ol class="grid grid-rows-6 gap-1 my-4">
    <li
      v-for="(guess, index) in guesses"
      :key="`guess-${index}`"
      class="h-fit flex items-center gap-2 min-w-0 transition-all duration-300 ease-in-out"
      :class="{ 'opacity-50 pointer-events-none': isDisabled }"
    >
      <div class="flex-shrink-0 border-3 rounded-md border-light-border-primary dark:border-dark-border-primary bg-white-primary dark:bg-dark-game-background text-light-text-primary dark:text-dark-text-primary aspect-square h-7 flex items-center justify-center text-sm font-extrabold">
        {{ index + 1 }}
      </div>
      <span class="text-lg text-light-text-primary dark:text-dark-text-primary flex-1 truncate min-w-0 uppercase font-medium">
        {{ guess.text }}
      </span>
      <GuessHint
        v-if="guess.hint"
        :hint="guess.hint"
        hint-component-size="small"
        :is-open="activeHintIndex === index"
        @toggle="toggleHint(index)"
        @close="closeHint"
      />
      <!-- Typically hidden as results view is shown after correct guess.
          Will render when multiple tabs sync a win state. -->
      <GuessResultIcon :correct="guess.correct" />
    </li>
    <li
      v-for="(_, index) in (MAX_GUESSES - guesses.length)"
      :key="`empty-${index}`"
      class="h-fit flex items-center gap-2 min-w-0 transition-all duration-300 ease-in-out"
      :class="{ 'opacity-50': isDisabled }"
    >
      <div class="flex-shrink-0 border-3 rounded-md border-light-border-primary dark:border-dark-border-primary bg-white-primary dark:bg-dark-game-background text-light-text-primary dark:text-dark-text-primary aspect-square h-7 flex items-center justify-center text-sm font-extrabold">
        {{ guesses.length + index + 1 }}
      </div>
      <!-- optimistic -->
      <template v-if="isSubmitting && index === 0">
        <div class="flex items-center gap-3 opacity-50 min-w-0">
          <span class="text-lg flex-1 truncate min-w-0 uppercase text-light-text-primary dark:text-dark-text-primary font-medium">
            {{ submittedGuess }}
          </span>
          <div class="flex-shrink-0 flex gap-0.5">
            <div class="h-1.5 w-1.5 bg-light-text-primary dark:bg-dark-text-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div class="h-1.5 w-1.5 bg-light-text-primary dark:bg-dark-text-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div class="h-1.5 w-1.5 bg-light-text-primary dark:bg-dark-text-primary rounded-full animate-bounce" />
          </div>
        </div>
      </template>
      <div v-else class="select-none">
        &nbsp;
      </div>
    </li>
  </ol>
</template>
