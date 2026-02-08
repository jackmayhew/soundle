<script setup lang="ts">
withDefaults(defineProps<{
  text: string
  needsSr?: boolean
  srText?: string
  size?: 'default' | 'lg'
  tabindex?: string
}>(), {
  needsSr: false,
  size: 'default',
})

const titleRef = ref<HTMLElement>()
defineExpose({ titleRef })

const baseClasses = 'font-coop text-light-text-primary dark:text-dark-text-primary font-bold mb-2'
const titleClasses = {
  default: 'text-2xl xs-300:text-3.5xl',
  lg: 'text-2xl xs-300:text-2.5xl xs-350:text-3.5xl',
}
</script>

<template>
  <template v-if="needsSr">
    <h3 ref="titleRef" :class="[baseClasses, titleClasses[size]]" :tabindex="tabindex">
      {{ text }}
    </h3>
    <h3 id="modal-title" class="sr-only">
      {{ srText }}
    </h3>
  </template>
  <h3 v-else id="modal-title" ref="titleRef" :class="[baseClasses, titleClasses[size]]" :tabindex="tabindex">
    {{ text }}
  </h3>
</template>
