<script setup lang="ts">
const uiStore = useUiStore()

const retryAfter = computed(() => uiStore.appStatus.serviceUnavailable.retryAfter)

const { remainingSeconds } = useCountdown(retryAfter, () => {
  uiStore.clearServiceUnavailable()
})

const isActive = computed(() => remainingSeconds.value > 0)
const formattedTime = computed(() => formatDuration(remainingSeconds.value))

const ariaLiveMessage = computed(() =>
  isActive.value
    ? `The service is unavailable. Please try again in ${formattedTime.value}`
    : 'The service may be available now.',
)
</script>

<template>
  <div>
    <ModalHeader text="App Error." />

    <div class="text-center">
      <Transition name="inner-modal" mode="out-in">
        <div v-if="isActive">
          <p class="text-sm mb-1 text-light-text-secondary dark:text-dark-text-secondary">
            We're having some temporary issues. Please check back in a bit.
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

    <span class="sr-only" aria-live="polite" role="status">
      {{ ariaLiveMessage }}
    </span>
  </div>
</template>
