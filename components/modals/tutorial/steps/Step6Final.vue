<script setup lang="ts">
const uiStore = useUiStore()

const btnText = computed(() => uiStore.view === 'game' ? 'Play Game!' : 'Close Tutorial')
</script>

<template>
  <div class="flex flex-col items-center text-center w-full">
    <ModalHeader text="Have Fun!" />
    <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
      You're all set. There are two ways to enjoy Soundle:
    </p>
    <div class="grid grid-cols-1 gap-4 w-full mb-4">
      <div class="flex items-start gap-2">
        <div class="text-center">
          <h4 class="font-black font-coop text-lg uppercase">
            Daily Soundle.
          </h4>
          <p class="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            New puzzles released daily at midnight. Compete with everyone!
          </p>
        </div>
      </div>
      <div class="flex items-start gap-2">
        <div class="text-center">
          <h4 class="font-black font-coop text-lg uppercase">
            The Archive.
          </h4>
          <p class="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            Missed a day? Head to the archive and play any puzzle you want.
          </p>
        </div>
      </div>
    </div>
    <BasicButton
      size="md"
      @click="uiStore.hideModal()"
    >
      {{ btnText }}
    </BasicButton>
  </div>
</template>
