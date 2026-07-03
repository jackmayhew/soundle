<script setup lang="ts">
const reminderSettingsStore = useReminderSettingsStore()

function handleSignupSuccess(emailFromForm: string) {
  reminderSettingsStore.handleSignupSuccess(emailFromForm)
}
</script>

<template>
  <div class="h-full flex flex-col items-center relative w-full pb-4">
    <div class="mb-4 text-center text-light-text-secondary dark:text-dark-text-secondary">
      Get daily puzzle reminders and hints straight to your inbox.
    </div>
    <RemindersSignupForm @success="handleSignupSuccess" />
  </div>
</template>
