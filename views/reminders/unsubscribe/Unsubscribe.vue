<script setup lang="ts">
const unsubscribeStore = useUnsubscribeStore()

// ?unsubscribeId=4573191e-355b-4648-86c3-a2edc595cd8c

function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && unsubscribeStore.id) {
    unsubscribeStore.fetchSettingsById()
  }
}

onMounted(async () => {
  document.addEventListener('visibilitychange', handleVisibilityChange)

  if (unsubscribeStore.id) {
    await nextTick()
    await unsubscribeStore.fetchSettingsById()
    await unsubscribeStore.performUnsubscribe()
  }
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="flex flex-col px-4 pb-4 h-full">
    <Transition name="view-fade" mode="out-in">
      <div :key="unsubscribeStore.fetchStatus" class="min-h-full flex flex-col">
        <LoadingView
          v-if="unsubscribeStore.fetchStatus === 'loading'"
          title="Loading..."
          message="Loading your settings. Please wait..."
        />
        <UnsubscribeSettings
          v-else-if="unsubscribeStore.fetchStatus === 'success'"
        />
        <ErrorView
          v-else
          message="We couldn't load your settings. Please try again."
          @retry="unsubscribeStore.fetchSettingsById()"
        />
      </div>
    </Transition>
  </div>
</template>
