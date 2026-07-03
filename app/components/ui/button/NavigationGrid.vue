<script setup lang="ts">
import { Archive, Bell, House, Share2 } from 'lucide-vue-next'

const uiStore = useUiStore()

const navButtons = [
  { label: 'Home', icon: House, action: () => uiStore.setView('menu') },
  { label: 'Archive', icon: Archive, action: () => uiStore.setView('archive') },
  { label: 'Share', icon: Share2, action: () => uiStore.showModal('share'), rotateOn: 'share' },
  { label: 'Reminders', icon: Bell, action: () => uiStore.showModal('emailReminder'), rotateOn: 'emailReminder' },
]
</script>

<template>
  <nav class="grid grid-cols-2 grid-rows-2 gap-2 mt-auto" aria-label="Main navigation">
    <BaseButton
      v-for="btn in navButtons"
      :key="btn.label"
      class="group flex items-center justify-center gap-1.5 p-2 rounded-lg border-3 font-extrabold text-sm transition-all duration-300 ease-in-out bg-light-game-background text-light-text-primary border-light-border-primary dark:bg-dark-game-background dark:text-dark-text-primary dark:border-dark-border-primary hover:bg-yellow-primary hover:text-black-primary dark:hover:bg-dark-background dark:hover:text-dark-text-secondary"
      @click="btn.action"
    >
      {{ btn.label }}
      <BaseIcon
        :icon="btn.icon"
        :size="17"
        :stroke-width="2.5"
        :class="{ 'rotate-[15deg]': btn.rotateOn && uiStore.activeModal === btn.rotateOn }"
        class="group-hover:rotate-[15deg] transition-transform duration-150 ease-in-out"
      />
    </BaseButton>
  </nav>
</template>
