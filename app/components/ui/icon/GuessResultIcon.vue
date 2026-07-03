<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'

withDefaults(defineProps<{
  correct: boolean
  iconSize?: number
  containerSize?: string
}>(), {
  iconSize: 16,
  containerSize: 'h-6',
})
</script>

<template>
  <span
    class="flex items-center justify-center aspect-square border-3 rounded-md border-light-border-primary dark:border-dark-border-primary"
    :class="[correct ? 'bg-green-primary' : 'bg-red-primary', containerSize]"
    :aria-label="correct ? 'Correct' : 'Incorrect'"
  >
    <BaseIcon
      v-if="correct"
      :icon="Check"
      :size="iconSize"
    />
    <BaseIcon
      v-else
      :icon="X"
      :size="iconSize"
    />
  </span>
</template>
