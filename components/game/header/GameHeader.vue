<script setup lang="ts">
import type { GameInstance } from '~/types/game/game.types'
import { BarChart3, Lightbulb, Timer } from 'lucide-vue-next'

const props = defineProps<{
  activeGame?: GameInstance
  timer?: string | null
}>()

const difficulty = computed(() => props.activeGame?.difficulty)
const hint = computed(() => props.activeGame?.hint)
</script>

<template>
  <div class="flex pt-4 sticky top-0 bg-light-game-background dark:bg-dark-game-background pb-2 z-[100]">
    <div class="w-1/2">
      <h1
        class="main-title-ref text-[2rem] flex items-center font-coop leading-none text-light-text-primary dark:text-dark-text-primary"
        tabindex="-1"
      >
        Soundle.
      </h1>
      <span class="text-xs absolute text-light-text-secondary dark:text-dark-text-secondary">
        {{ formatPuzzleTitle(activeGame?.puzzleNumber, activeGame?.puzzleDate, true) }}
      </span>
    </div>
    <div class="w-1/2 flex justify-end">
      <div class="flex gap-1 relative">
        <GameStat
          label="Diff"
          color="orange"
          :disabled="!difficulty"
          aria-label="Show difficulty"
          popover-position="top-left"
        >
          <template #badge-content>
            <div v-if="difficulty" class="flex items-center justify-center">
              <span class="-mt-1">{{ difficulty }}</span>
              <span class="mx-0.5">/</span>
              <span class="-mb-1">5</span>
            </div>
            <span v-else>N/A</span>
          </template>
          <template #icon>
            <BaseIcon
              :icon="BarChart3"
              :size="18"
            />
          </template>
          <template #content>
            <span class="text-[13px]">Difficulty:
              <span class="whitespace-nowrap">
                <span>{{ difficulty }}</span>
                <span class="mx-[1px]">/</span>
                <span>5</span>
              </span>
            </span>
          </template>
        </GameStat>
        <GameStat
          label="Time"
          color="yellow"
          :value="timer || 'N/A'"
          :disabled="!timer"
          stat-width="w-[36px] xs-370:w-[68px]"
          aria-label="Show timer"
          popover-position="top-center"
        >
          <template #icon>
            <BaseIcon
              :icon="Timer"
              :size="18"
            />
          </template>
          <template #content>
            <div class="text-[13px]">
              Time: {{ timer || 'N/A' }}
            </div>
          </template>
        </GameStat>
        <GameStat
          label="Hint"
          color="purple"
          value=""
          :disabled="!hint"
          :always-popover="true"
          aria-label="Show hint"
          popover-position="top-right"
        >
          <template #icon>
            <BaseIcon
              :icon="Lightbulb"
              :size="18"
            />
          </template>
          <template #content>
            <span class="text-[13px] xs-370:text-sm">{{ hint }}</span>
          </template>
        </GameStat>
      </div>
    </div>
    <HeaderBlur />
  </div>
</template>
