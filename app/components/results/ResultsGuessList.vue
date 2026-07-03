<script setup lang="ts">
import type { GuessResult } from '~/types/game/guess/guess-result.types'
import { MAX_GUESSES } from '~/constants/app/validation'

defineProps<{
  guesses: GuessResult[]
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
  <ol class="my-4 space-y-1">
    <li
      v-for="n in MAX_GUESSES"
      :key="`row-${n}`"
      class="flex items-center gap-2 w-full"
    >
      <span class="flex-shrink-0 border-3 border-light-border-primary dark:border-dark-border-primary bg-white-primary dark:bg-dark-game-background rounded-md text-light-text-primary dark:text-dark-text-primary aspect-square h-6 flex items-center justify-center text-sm font-extrabold">
        {{ n }}
      </span>
      <template v-if="guesses[n - 1]">
        <span class="flex-grow truncate uppercase text-[17px] text-light-text-primary dark:text-dark-text-primary font-medium">
          {{ guesses[n - 1]!.text }}
        </span>
        <div class="flex-shrink-0 flex gap-2">
          <GuessHint
            v-if="guesses[n - 1]?.hint"
            :hint="guesses[n - 1]?.hint"
            hint-component-size="small"
            :is-open="activeHintIndex === n"
            @toggle="toggleHint(n)"
            @close="closeHint"
          />
          <GuessResultIcon :correct="guesses[n - 1]!.correct" />
        </div>
      </template>
      <template v-else>
        <span class="flex-grow select-none">&nbsp;</span>
      </template>
    </li>
  </ol>
</template>
