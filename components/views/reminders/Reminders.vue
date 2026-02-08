<script setup lang="ts">
const reminderSettingsStore = useReminderSettingsStore()

function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && reminderSettingsStore.settings.isRegistered) {
    reminderSettingsStore.fetchSettings()
  }
}

onBeforeMount(() => {
  reminderSettingsStore.fetchStatus = 'loading'
})

onMounted(async () => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
  await reminderSettingsStore.fetchSettings()
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="flex flex-col px-4 pb-4 h-full">
    <Transition name="view-fade" mode="out-in">
      <div :key="reminderSettingsStore.fetchStatus" class="min-h-full flex flex-col">
        <LoadingView
          v-if="reminderSettingsStore.fetchStatus === 'loading'"
          title="Loading..."
          message="Fetching your preferences. Please wait..."
        />
        <RemindersManager
          v-else-if="reminderSettingsStore.fetchStatus === 'success'"
        />
        <ErrorView
          v-else
          message="We couldn't load your settings. Please try again."
          @retry="reminderSettingsStore.fetchSettings()"
        />
      </div>
    </Transition>
  </div>
</template>
