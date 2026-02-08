<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  loading?: boolean
  success?: boolean
  error?: boolean
  variant?: 'yellow' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), {
  variant: 'yellow',
  size: 'md',
})

const sizeClasses = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-[48px] px-4 text-base',
  lg: 'h-[56px] px-4 text-lg',
}

const baseClasses = 'relative w-full rounded-lg border-3 border-light-border-primary dark:border-dark-border-primary font-extrabold flex items-center justify-center gap-2 transition-all duration-300 ease-in-out'

const colorClasses = computed(() => {
  if (props.error)
    return 'bg-red-primary text-white'
  if (props.success)
    return 'bg-green-primary'
  if (props.loading)
    return 'bg-yellow-secondary'

  return props.variant === 'yellow'
    ? 'bg-yellow-primary hover:bg-yellow-secondary text-black-primary'
    : 'bg-transparent hover:bg-gray-100 dark:bg-dark-game-background dark:text-dark-text-primary dark:border-dark-border-primary dark:hover:bg-dark-background dark:hover:text-dark-text-secondary'
})
</script>

<template>
  <BaseButton
    v-bind="$attrs"
    :disabled="disabled || loading || success || error"
    :class="[
      baseClasses,
      sizeClasses[size],
      colorClasses,
    ]"
  >
    <div :class="{ 'opacity-0': loading }" class="flex items-center justify-center gap-2">
      <slot v-if="!success && !error" />
      <slot v-else-if="success" name="success" />
      <slot v-else-if="error" name="error" />
    </div>

    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  </BaseButton>
</template>
