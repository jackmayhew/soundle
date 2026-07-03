<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'yellow' | 'black'
}>(), {
  variant: 'yellow',
})

const variantClasses = {
  yellow: 'bg-yellow-primary hover:bg-black-primary hover:text-white-primary dark:hover:bg-dark-game-background',
  black: 'dark:bg-dark-game-background dark:text-dark-text-primary dark:border-dark-border-primary hover:bg-black-primary hover:text-white-primary dark:hover:bg-dark-background dark:hover:text-dark-text-secondary',
}
</script>

<template>
  <BaseButton
    type="button"
    :class="variantClasses[variant]"
    class="font-black text-lg border-3 border-light-border-primary dark:border-dark-border-primary w-[200px] h-[48px] rounded-full text-black-primary transition-all duration-300 ease-in-out"
    v-bind="$attrs"
  >
    <slot />
  </BaseButton>
</template>
