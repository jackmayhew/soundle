<script setup lang="ts">
import { PartyPopper } from 'lucide-vue-next'

const uiStore = useUiStore()
</script>

<template>
  <div class="flex flex-col items-center text-center">
    <div class="mb-2 p-4 rounded-full bg-yellow-primary/70 ">
      <PartyPopper :size="42" :stroke-width="1.5" />
    </div>

    <ModalHeader text="Welcome!" />

    <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
      Soundle is simple: listen to the mystery sound and guess what it is. Here’s a quick guide to get you started.
    </p>

    <BasicButton
      size="md"
      @click="uiStore.hideModal()"
    >
      Skip Tutorial
    </BasicButton>
  </div>
</template>
