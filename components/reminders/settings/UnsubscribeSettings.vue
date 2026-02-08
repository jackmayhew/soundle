<script setup lang="ts">
/**
 * Component for managing email reminder preferences accessed via unsubscribe link.
 * Allows users who clicked an unsubscribe link in their email to modify their reminder settings.
 */

const unsubscribeStore = useUnsubscribeStore()

function handleSubscriptionClick(event: Event) {
  event.preventDefault()
  if (unsubscribeStore.updateStatus === 'loading')
    return

  const willSubscribe = !unsubscribeStore.settings.isSubscribed

  if (willSubscribe) {
    unsubscribeStore.updateSettingsById({ isActive: true })
  }
  else {
    const payload: { isActive: boolean, includeHint?: boolean } = { isActive: false }
    if (unsubscribeStore.settings.includeHint)
      payload.includeHint = false
    unsubscribeStore.updateSettingsById(payload)
  }
}

function handleHintClick(event: Event) {
  event.preventDefault()
  if (unsubscribeStore.updateStatus === 'loading' || !unsubscribeStore.settings.isSubscribed)
    return

  const willEnableHints = !unsubscribeStore.settings.includeHint
  unsubscribeStore.updateSettingsById({ includeHint: willEnableHints })
}
</script>

<template>
  <Header
    title="Reminders."
    subtitle="Daily puzzle reminders."
    margin-class="mb-4"
  />
  <div class="mb-4 text-8xl text-center">
    📥
  </div>
  <div class="h-full flex flex-col items-center relative pb-4">
    <div v-if="unsubscribeStore.settings.email" class="mb-2 text-light-text-primary dark:text-dark-text-primary text-center leading-snug truncate w-full">
      Managing preferences for: <br>
      <span class="underline text-sm text-light-text-secondary dark:text-dark-text-secondary">
        {{ unsubscribeStore.settings.email }}
      </span>
    </div>
    <div v-else class="mb-2 text-light-text-primary dark:text-dark-text-primary">
      Manage your prefrences below.
    </div>
    <FormGroup
      title="Options"
      :loading="unsubscribeStore.updateStatus === 'loading'"
    >
      <FormToggle
        id="isSubscribed"
        label="Recieve Daily Reminders"
        :checked="unsubscribeStore.settings.isSubscribed"
        :loading="unsubscribeStore.updatingSettings.includes('isSubscribed')"
        :disabled="unsubscribeStore.updateStatus === 'loading'"
        :prevent-default="true"
        class="mb-1"
        @click="handleSubscriptionClick"
      />
      <FormToggle
        id="includeHint"
        label="Include Puzzle Hints"
        :checked="unsubscribeStore.settings.includeHint"
        :loading="unsubscribeStore.updatingSettings.includes('includeHint')"
        :disabled="!unsubscribeStore.settings.isSubscribed || unsubscribeStore.updateStatus === 'loading'"
        :prevent-default="true"
        @click="handleHintClick"
      />
    </FormGroup>
    <div
      v-if="unsubscribeStore.updateStatus === 'error' || unsubscribeStore.unsubscribeResult === 'error'"
      class="mt-2 text-red-error text-xs font-bold text-center"
    >
      Failed to update settings. Please try again.
    </div>
    <div
      v-else-if="unsubscribeStore.unsubscribeResult === 'success'"
      class="mt-2 text-green-700 text-xs font-bold text-center"
    >
      Successfully unsubscribed.
    </div>
  </div>
</template>
