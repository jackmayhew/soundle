<script setup lang="ts">
import { BarChart3, Lightbulb, Timer } from 'lucide-vue-next'
import { TUTORIAL_GAME } from '~/constants/game/tutorial'

const gameStore = useGameStore()

const { formattedTime, start } = useTimer({
  initialElapsedTime: TUTORIAL_GAME?.elapsedTime ?? 0,
  onSave: time => gameStore.setElapsedTime(time),
})

onMounted(async () => {
  await delay(1000)
  start()
})
</script>

<template>
  <div class="flex flex-col items-center text-center w-full">
    <ModalHeader text="Your Tools." />

    <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3">
      Use these tools to track your progress and get help if you're stuck.
    </p>

    <div class="flex gap-2 justify-center mx-auto mb-3 relative">
      <GameStat
        label="Diff"
        color="orange"
        :disabled="false"
        popover-position="top-left"
      >
        <template #badge-content>
          <div class="flex items-center justify-center">
            <span class="-mt-1">
              {{ TUTORIAL_GAME.difficulty }}
            </span>
            <span class="mx-0.5">/</span>
            <span class="-mb-1">5</span>
          </div>
        </template>
        <template #icon>
          <BaseIcon :icon="BarChart3" :size="18" />
        </template>
        <template #content>
          <span class="text-[13px]">
            Difficulty:
            {{ TUTORIAL_GAME.difficulty }}/5
          </span>
        </template>
      </GameStat>

      <GameStat
        label="Time"
        color="yellow"
        :value="formattedTime"
        stat-width="w-[36px] xs-370:w-[68px]"
        popover-position="top-center"
      >
        <template #icon>
          <BaseIcon :icon="Timer" :size="18" />
        </template>
        <template #content>
          <div class="text-[13px]">
            Time: {{ formattedTime }}
          </div>
        </template>
      </GameStat>

      <GameStat
        label="Hint"
        color="purple"
        value=""
        :disabled="false"
        :always-popover="true"
        popover-position="top-right"
      >
        <template #icon>
          <BaseIcon :icon="Lightbulb" :size="18" />
        </template>
        <template #content>
          <span class="text-[13px] xs-370:text-sm">
            {{ TUTORIAL_GAME.hint }}
          </span>
        </template>
      </GameStat>
    </div>

    <p class="text-xs text-light-text-secondary/60 mb-1">
      Every puzzle has a <strong>Difficulty</strong> rating. <br>
    </p>
    <p class="text-xs text-light-text-secondary/60 mb-1">
      Move quickly, the <strong>Timer</strong> is running! <br>
    </p>
    <p class="text-xs text-light-text-secondary/60 mb-1">
      Use the <strong>Hint</strong> if you get stuck.
    </p>

    <p class="mt-4 text-xs italic text-light-text-secondary/60">
      Next: Ready to play.
    </p>
  </div>
</template>
