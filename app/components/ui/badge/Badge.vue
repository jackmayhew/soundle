<script setup lang="ts">
withDefaults(defineProps<{
  value?: string | number
  color: 'orange' | 'yellow' | 'purple'
  label?: string
  height?: string
  textSize?: string
  padding?: string
  labelTextSize?: string
  labelSpacing?: string
  ariaLabel?: string
}>(), {
  height: 'h-8',
  textSize: 'text-sm',
  labelTextSize: 'text-sm',
  labelSpacing: '',
})

const colorClasses = {
  orange: 'bg-orange-primary hover:bg-orange-secondary',
  yellow: 'bg-yellow-primary hover:bg-yellow-secondary',
  purple: 'bg-blue-primary hover:bg-blue-secondary',
}
</script>

<template>
  <div
    class="text-sm font-bold flex flex-col justify-center items-center"
    :aria-label="ariaLabel"
  >
    <span
      v-if="label"
      class="text-light-text-primary dark:text-dark-text-primary"
      :class="[labelSpacing, labelTextSize]"
    >
      {{ label }}
    </span>

    <div
      class="w-full border-3 border-light-border-primary dark:border-dark-border-primary text-black-primary rounded-lg font-bold flex items-center justify-center transition-colors duration-300"
      :class="[colorClasses[color], height, textSize, padding]"
    >
      <slot>
        {{ value }}
      </slot>
    </div>
  </div>
</template>
