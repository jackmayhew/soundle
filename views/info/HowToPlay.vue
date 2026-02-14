<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'

const uiStore = useUiStore()

const steps = [
  {
    title: 'Listen to the sound',
    description: 'Hit play and listen to the audio clip.',
  },
  {
    title: 'Make your guess',
    description: 'Think you know it? Type it in! Don\'t worry about exact phrasing, our system is smart enough to understand you.',
  },
  {
    title: 'Be specific',
    description: 'Generic guesses like "Water" or "Car" are often too vague. Try "Pouring water" or "Starting a car" instead.',
  },
  {
    title: 'Get feedback',
    description: 'Guessed wrong? You\'ll get a hint to point you in the right direction.',
    showHint: true,
  },
  {
    title: 'Six tries to win',
    description: 'That\'s all you get! Make them count.',
  },
  {
    title: 'New puzzle daily',
    description: 'New puzzles released daily at midnight. Keep your streak going.',
  },
  {
    title: 'Play past puzzles',
    description: 'Missed a day? Head to the archive and play any puzzle you want.',
  },
]
</script>

<template>
  <div class="flex flex-col px-4 pb-4">
    <Header
      title="How to Play."
      subtitle="Like Wordle, but sounds."
      margin-class="mb-4"
    />
    <ol class="flex-1 space-y-4 text-left">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="flex gap-3 items-start"
      >
        <div class="flex-shrink-0 border-3 bg-white-primary dark:bg-light-game-background dark:bg-dark-game-background text-light-text-primary dark:text-dark-text-primary rounded border-light-border-primary dark:border-dark-border-primary aspect-square h-7 flex items-center justify-center text-sm font-bold">
          {{ index + 1 }}
        </div>
        <div>
          <h2 class="font-bold mb-1 leading-none text-light-text-primary dark:text-dark-text-primary">
            {{ step.title }}.
          </h2>
          <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {{ step.description }}
          </p>
          <div v-if="step.showHint" class="mt-1.5 flex items-center gap-2 relative">
            <div class="text-xs leading-6 font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">
              Look for:
            </div>
            <div
              class="flex-shrink-0 flex items-center justify-center rounded-md bg-gray-200 text-gray-700
              dark:text-dark-text-secondary dark:bg-dark-game-background dark:border-3
              dark:border-dark-border-primary h-6 w-6"
              aria-label="Representation of show hint button"
            >
              <BaseIcon
                :icon="Sparkles"
                :size="14"
              />
            </div>
          </div>
        </div>
      </li>
    </ol>
    <div class="mt-6 flex flex-col gap-2">
      <BasicButton
        variant="ghost"
        @click="uiStore.showModal('gameTutorial')"
      >
        Full Tutorial
      </BasicButton>
      <BasicButton
        @click="uiStore.setView('menu')"
      >
        Got It!
      </BasicButton>
    </div>
  </div>
</template>
