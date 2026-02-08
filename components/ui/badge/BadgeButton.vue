<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  color: 'orange' | 'yellow' | 'purple'
  disabled?: boolean
  active?: boolean
  height?: string
  width?: string
  labelTextSize?: string
  labelSpacing?: string
  ariaLabel?: string
}>(), {
  label: '',
  disabled: false,
  active: false,
  height: 'h-8',
  width: 'w-10',
  labelTextSize: 'text-sm',
  labelSpacing: '',
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const colorMap = {
  orange: {
    base: 'bg-orange-primary',
    hover: 'hover:bg-orange-secondary',
    active: 'bg-orange-secondary',
  },
  yellow: {
    base: 'bg-yellow-primary',
    hover: 'hover:bg-yellow-secondary',
    active: 'bg-yellow-secondary',
  },
  purple: {
    base: 'bg-blue-primary',
    hover: 'hover:bg-blue-secondary',
    active: 'bg-blue-secondary',
  },
}

const buttonClasses = computed(() => {
  const colors = colorMap[props.color]
  return [
    colors.hover,
    props.active ? colors.active : colors.base,
    props.height,
    props.width,
  ]
})
</script>

<template>
  <div class="text-sm flex flex-col justify-center items-center w-full">
    <span
      v-if="label"
      class="text-light-text-primary dark:text-dark-text-primary font-bold"
      :class="[labelSpacing, labelTextSize]"
    >
      {{ label }}
    </span>
    <BaseButton
      class="border-3 rounded-lg border-light-border-primary dark:border-dark-border-primary text-black-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
      :class="buttonClasses"
      :aria-label="ariaLabel"
      :disabled="disabled"
      @click="$emit('click', $event)"
    >
      <slot />
    </BaseButton>
  </div>
</template>
