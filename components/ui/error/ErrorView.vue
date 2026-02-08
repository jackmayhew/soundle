<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
  buttonText?: string
}>(), {
  message: 'Something went wrong. Please try again.',
  buttonText: 'Retry',
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="relative flex flex-col flex-1 items-center justify-center">
    <CloseButton
      class="absolute top-4 right-0 h-6 w-6"
      @click="useUiStore().setView('menu')"
    />
    <div class="text-center max-w-sm">
      <div class="mb-1 text-5xl">
        ⚠️
      </div>
      <h1 class="main-title-ref text-4xl font-coop text-light-text-primary dark:text-dark-text-primary" tabindex="-1">
        Error.
      </h1>
      <p class="text-sm text-gray-600 mb-3 text-light-text-secondary dark:text-dark-text-secondary">
        {{ message }}
      </p>
      <BaseButton
        class="px-5 bg-green-primary hover:bg-green-secondary dark:hover:bg-green-tertiary border-3 border-light-border-primary dark:border-dark-border-primary rounded-md font-bold h-[46px] text-lg transition-all duration-300 ease-in-out"
        @click="emit('retry')"
      >
        {{ buttonText }}
      </BaseButton>
    </div>
  </div>
</template>
