<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  loading?: boolean
}>(), {
  loading: false,
})
</script>

<template>
  <fieldset
    class="w-full border-3 border-light-border-primary dark:border-dark-border-primary rounded-lg p-2 text-left relative"
    :class="{ 'cursor-not-allowed': loading }"
  >
    <legend class="px-2 text-xl font-coop ml-2 text-light-text-primary dark:text-dark-text-primary z-10">
      {{ title }}
    </legend>
    <slot />
  </fieldset>
</template>
