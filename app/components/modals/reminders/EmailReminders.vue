<script setup lang="ts">
const uiStore = useUiStore()

const isSuccess = ref(false)
const successTitleRef = ref<HTMLElement | null>(null)

async function handleSuccess() {
  isSuccess.value = true
  await nextTick()
  successTitleRef.value?.focus()
}
</script>

<template>
  <Transition name="inner-modal" mode="out-in">
    <!-- Form -->
    <div v-if="!isSuccess">
      <ModalHeader text="Reminders." />
      <p class="mb-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
        Get daily puzzle reminders and hints straight to your inbox.
      </p>
      <RemindersSignupForm @success="handleSuccess" />
    </div>

    <!-- Success -->
    <div v-else>
      <ModalHeader
        ref="successTitleRef"
        text="Success!"
        tabindex="-1"
      />
      <p class="mb-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
        We'll send you daily puzzle reminders and hints. Unsubscribe anytime.
      </p>
      <BasicButton
        size="md"
        @click="uiStore.hideModal()"
      >
        Got It!
      </BasicButton>
    </div>
  </Transition>
</template>
