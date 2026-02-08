<script setup lang="ts">
import { Lightbulb } from 'lucide-vue-next'

defineProps<{
  hint: string | null | undefined
}>()

const showPuzzleHint = ref(false)
const hintContainer = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div ref="hintContainer">
    <BadgeButton
      label="Hint"
      color="purple"
      :active="showPuzzleHint"
      :disabled="!hint"
      aria-label="Show hint"
      @click="showPuzzleHint = !showPuzzleHint"
    >
      <BaseIcon
        :icon="Lightbulb"
        :size="18"
      />
    </BadgeButton>
    <Popover
      :show="showPuzzleHint"
      :ignore-refs="hintContainer ? [hintContainer] : []"
      position="top-right"
      width="w-full"
      @close="showPuzzleHint = false"
    >
      <div v-if="hint" class="text-sm">
        {{ hint }}
      </div>
    </Popover>
  </div>
</template>
