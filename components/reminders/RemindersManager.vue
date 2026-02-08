<script setup lang="ts">
const reminderSettingsStore = useReminderSettingsStore()

const headerText = computed(() =>
  reminderSettingsStore.settings.isRegistered
    ? 'Daily puzzle reminders.'
    : 'Sign up for reminders.',
)
</script>

<template>
  <Header
    title="Reminders."
    :subtitle="headerText"
    margin-class="mb-4"
  />
  <div class="mb-4 text-8xl text-center">
    📥
  </div>
  <Transition name="view-fade" mode="out-in">
    <RemindersSettings v-if="reminderSettingsStore.fetchStatus === 'success' && reminderSettingsStore.settings.isRegistered" />
    <RemindersSignup v-else />
  </Transition>
</template>
