<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(defineProps<{
  variant?: 'yellow' | 'green' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: Component
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'yellow',
  size: 'lg',
  loading: false,
  type: 'button',
})

const baseClasses = 'border-3 border-light-border-primary dark:border-dark-border-primary'

const variantClasses = {
  green: 'bg-green-primary hover:bg-green-secondary dark:hover:bg-green-tertiary text-black-primary',
  yellow: 'bg-yellow-primary hover:bg-yellow-secondary text-black-primary',
  ghost: 'bg-transparent hover:bg-gray-100 dark:bg-dark-game-background dark:text-dark-text-primary dark:hover:bg-dark-background dark:hover:text-dark-text-secondary',
}

const sizeClasses = {
  sm: 'h-10 w-full px-4 text-sm',
  md: 'h-[48px] w-full px-4 text-base',
  lg: 'h-[56px] w-full px-4 text-lg',
}
</script>

<template>
  <BaseButton
    :type="type"
    :disabled="disabled || loading"
    :class="[
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      { 'pointer-events-none': loading },
    ]"
    class="relative rounded-lg font-extrabold transition-colors flex items-center justify-center gap-2 transition-all duration-300 ease-in-out"
    v-bind="$attrs"
  >
    <div :class="{ 'opacity-0': loading }" class="flex items-center justify-center gap-2">
      <slot />
      <BaseIcon v-if="icon" :icon="icon" :size="18" />
    </div>
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  </BaseButton>
</template>
