<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  ariaLabel?: string
  ariaPressed?: boolean
  ariaExpanded?: boolean
}>(), {
  type: 'button',
  disabled: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :aria-pressed="ariaPressed"
    :aria-expanded="ariaExpanded"
    class="disabled:cursor-not-allowed"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
