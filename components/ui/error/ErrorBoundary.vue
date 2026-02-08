<script setup lang="ts">
function handleError(error: unknown) {
  const { $posthog } = useNuxtApp()
  const err = error as Error

  if ($posthog) {
    $posthog.capture('$exception', {
      $exception_type: err.name || 'VueError',
      $exception_message: err.message,
      $exception_stack: err.stack,
      location: 'ErrorBoundary',
    })
  }
}
</script>

<template>
  <NuxtErrorBoundary @error="handleError">
    <slot />
    <template #error="{ clearError }">
      <div class="text-center p-4 min-h-full flex flex-col items-center justify-center">
        <div class="mb-1 text-5xl">
          ⚠️
        </div>
        <h2 class="main-title-ref text-4xl font-coop mb-1 text-light-text-primary dark:text-dark-text-primary" tabindex="-1">
          Error.
        </h2>
        <p class="text-sm text-gray-600 mb-2 text-light-text-secondary dark:text-dark-text-secondary">
          Something went wrong. Please try again.
        </p>
        <BasicButton
          variant="green"
          @click="clearError"
        >
          Try Again
        </BasicButton>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>
