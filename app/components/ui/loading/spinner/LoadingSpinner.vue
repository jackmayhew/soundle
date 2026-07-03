<script setup lang="ts">
const props = withDefaults(defineProps<{
  height?: string
  width?: string
  borderWidth?: string
  borderColor?: string
  position?: 'absolute' | 'inline'
  marginClass?: string
  srText?: string
}>(), {
  height: 'h-5',
  width: 'w-5',
  borderWidth: 'border-4',
  borderColor: 'border-black-primary',
  position: 'absolute',
  marginClass: '',
  srText: 'Loading...',
})

const sizeClass = computed(() => `${props.height} ${props.width}`)
const borderClass = computed(() => `${props.borderWidth} ${props.borderColor}`)
const spinnerBaseClasses = 'border-t-transparent dark:border-t-transparent rounded-full animate-spin'
</script>

<template>
  <!-- MODE 1: The absolute overlay for buttons, toggles, etc. (DEFAULT) -->
  <span
    v-if="position === 'absolute'"
    class="absolute inset-0 flex items-center justify-center"
    role="status"
  >
    <div
      :class="[spinnerBaseClasses, sizeClass, borderClass]"
    />
    <span class="sr-only">Loading...</span>
  </span>

  <!-- MODE 2: The simple inline spinner for use inside other components -->
  <div
    v-else
    class="inline-block"
    :class="[spinnerBaseClasses, sizeClass, borderClass, marginClass]"
    role="status"
  >
    <span class="sr-only">
      {{ srText }}
    </span>
  </div>
</template>
