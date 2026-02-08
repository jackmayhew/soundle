<script setup lang="ts">
withDefaults(defineProps<{
  blurPosition?: string
}>(), {
  blurPosition: '-bottom-[15px] h-[15px]',
})
</script>

<template>
  <div
    :class="blurPosition"
    class="absolute left-0 right-0 pointer-events-none bg-gradient-to-b from-light-background dark:from-dark-background to-transparent -ml-4"
  />
</template>
