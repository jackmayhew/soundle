<script setup lang="ts">
import type { GameInstance } from '~/types/game/game.types'
import type { ResultsShareOptions } from '~/types/share/results'
import { CircleX, Copy, CopyCheck } from 'lucide-vue-next'

const props = defineProps<{
  result: GameInstance | null
  options: ResultsShareOptions
  disableCopy: boolean
}>()

const { copied, copyError, performCopy } = useCopyAction()

function handleCopy() {
  if (!props.result)
    return

  const text = generateResultShareText(props.result, {
    showAnswer: props.options.showAnswer,
    showGuesses: props.options.showGuesses,
  })

  performCopy(text)
}
</script>

<template>
  <StatefulButton
    variant="ghost"
    :success="copied"
    :error="copyError"
    :disabled="!result || disableCopy"
    @click="handleCopy"
  >
    Copy Text
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
</template>
