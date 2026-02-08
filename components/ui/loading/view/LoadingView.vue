<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message?: string
}>(), {
  title: 'Loading...',
  message: 'Please wait a moment.',
})
</script>

<template>
  <div class="h-full flex flex-1 items-center justify-center relative">
    <div class="text-center">
      <LoadingSpinner
        position="inline"
        height="h-12"
        width="w-12"
        margin-class="mb-2"
        border-width="border-4"
        border-color="border-light-text-primary dark:border-dark-text-primary"
      />
      <h1 class="main-title-ref text-4xl font-coop mb-1 text-light-text-primary dark:text-dark-text-primary" tabindex="-1">
        {{ title }}
      </h1>
      <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary">
        {{ message }}
      </p>
    </div>
  </div>
</template>
