<script setup lang="ts">
const uiStore = useUiStore()
</script>

<template>
  <ModalHeader text="Error." />
  <p class="text-sm mb-2 text-light-text-primary dark:text-dark-text-primary">
    Something went wrong. Please close the popup and try again.
  </p>
  <BasicButton
    size="md"
    @click="uiStore.hideModal()"
  >
    Close
  </BasicButton>
</template>
