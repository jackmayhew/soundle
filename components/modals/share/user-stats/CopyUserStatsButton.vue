<script setup lang="ts">
import type { UserStatistics } from '~/types/stats/user-stats.types'
import { CircleX, Copy, CopyCheck } from 'lucide-vue-next'

const props = defineProps<{
  result: UserStatistics | null
  disableCopy: boolean
}>()

const { copied, copyError, performCopy } = useCopyAction()

function handleCopy() {
  if (!props.result)
    return

  const text = generateStatsShareText(props.result)
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
      Copied!
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
