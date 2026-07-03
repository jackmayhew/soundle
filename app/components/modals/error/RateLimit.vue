<script setup lang="ts">
const uiStore = useUiStore()

const expiresAt = computed(() => uiStore.appStatus.rateLimit.expiresAt)

const { remainingSeconds } = useCountdown(expiresAt, () => {
  uiStore.clearRateLimited()
})

const isActive = computed(() => remainingSeconds.value > 0)
const formattedTime = computed(() => formatDuration(remainingSeconds.value))

const ariaLiveMessage = computed(() =>
  isActive.value
    ? `Please wait. Try again in ${formattedTime.value}`
    : 'You can try again now.',
)
</script>

<template>
  <div>
    <ModalHeader
      text="Woah!"
      needs-sr
      sr-text="Rate Limit."
    />

    <div class="text-center">
      <Transition name="inner-modal" mode="out-in">
        <div v-if="isActive">
          <p class="text-sm mb-1 text-light-text-secondary dark:text-dark-text-secondary">
            You're doing that a bit too fast. Please wait a moment.
          </p>
          <p class="font-bold text-lg mb-2 text-light-text-secondary dark:text-dark-text-secondary">
            Try again in {{ formattedTime }}
          </p>
          <BasicButton
            size="md"
            @click="uiStore.hideModal()"
          >
            Close
          </BasicButton>
        </div>

        <div v-else>
          <p class="text-sm mb-2 text-light-text-secondary dark:text-dark-text-secondary leading-normal">
            You can try again now.
          </p>
          <BasicButton
            size="md"
            @click="uiStore.hideModal()"
          >
            Close
          </BasicButton>
        </div>
      </Transition>
    </div>

    <!-- Screen reader updates -->
    <span class="sr-only" aria-live="polite" role="status">
      {{ ariaLiveMessage }}
    </span>
  </div>
</template>
