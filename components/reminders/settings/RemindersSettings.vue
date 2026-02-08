<script setup lang="ts">
/**
 * Component for managing email reminder preferences within the app.
 * Allows users to configure their puzzle reminder preferences.
 */

const reminderSettingsStore = useReminderSettingsStore()

function handleSubscriptionClick(event: Event) {
  event.preventDefault()
  if (reminderSettingsStore.updateStatus === 'loading')
    return

  const willSubscribe = !reminderSettingsStore.settings.isSubscribed

  if (willSubscribe) {
    reminderSettingsStore.updateSettings({ isActive: true })
  }
  else {
    const payload: { isActive: boolean, includeHint?: boolean } = { isActive: false }
    if (reminderSettingsStore.settings.includeHint)
      payload.includeHint = false
    reminderSettingsStore.updateSettings(payload)
  }
}

function handleHintClick(event: Event) {
  event.preventDefault()
  if (reminderSettingsStore.updateStatus === 'loading' || !reminderSettingsStore.settings.isSubscribed)
    return

  const willEnableHints = !reminderSettingsStore.settings.includeHint
  reminderSettingsStore.updateSettings({ includeHint: willEnableHints })
}
</script>

<template>
  <div class="h-full flex flex-col items-center relative pb-4">
    <div v-if="reminderSettingsStore.settings.email" class="mb-2 text-light-text-primary dark:text-dark-text-primary text-center leading-snug truncate w-full">
      Managing preferences for: <br>
      <span class="underline text-sm text-light-text-secondary dark:text-dark-text-secondary">
        {{ reminderSettingsStore.settings.email }}
      </span>
    </div>
    <div v-else class="mb-2 text-light-text-primary dark:text-dark-text-primary">
      Manage your prefrences below.
    </div>

    <FormGroup
      title="Options"
      :loading="reminderSettingsStore.updateStatus === 'loading'"
    >
      <FormToggle
        id="isSubscribed"
        label="Recieve Daily Reminders"
        :checked="reminderSettingsStore.settings.isSubscribed"
        :loading="reminderSettingsStore.updatingSettings.includes('isSubscribed')"
        :disabled="reminderSettingsStore.updateStatus === 'loading'"
        :prevent-default="true"
        class="mb-1"
        @click="handleSubscriptionClick"
      />

      <FormToggle
        id="includeHint"
        label="Include Puzzle Hints"
        :checked="reminderSettingsStore.settings.includeHint"
        :loading="reminderSettingsStore.updatingSettings.includes('includeHint')"
        :disabled="!reminderSettingsStore.settings.isSubscribed || reminderSettingsStore.updateStatus === 'loading'"
        :prevent-default="true"
        @click="handleHintClick"
      />
    </FormGroup>

    <div v-if="reminderSettingsStore.updateStatus === 'error'" class="mt-2 text-red-error text-xs font-bold text-center">
      Failed to update settings. Please try again.
    </div>
  </div>
</template>
