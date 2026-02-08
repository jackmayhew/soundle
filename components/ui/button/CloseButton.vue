<script setup lang="ts">
import { X } from 'lucide-vue-next'

withDefaults(defineProps<{
  iconSize?: number
}>(), {
  iconSize: 16,
})
</script>

<template>
  <BaseButton
    class="flex items-center justify-center bg-red-primary hover:bg-red-secondary
    rounded border-3 border-light-border-primary dark:border-dark-border-primary transition-all duration-300 ease-in-out"
    aria-label="Close"
  >
    <BaseIcon
      :icon="X"
      :size="iconSize"
    />
  </BaseButton>
</template>
