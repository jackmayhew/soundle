<script setup lang="ts">
import type { ViewType } from '~/types/ui/ui.types'
import { Bell, ChartNoAxesCombined, FileQuestionMark, Mail } from 'lucide-vue-next'

const uiStore = useUiStore()

function navigateTo(view: ViewType) {
  uiStore.setView(view)
  uiStore.hideModal()
}

const menuItems = [
  { label: 'My Stats', action: () => navigateTo('userStats'), icon: ChartNoAxesCombined },
  { label: 'Reminders', action: () => navigateTo('reminders'), icon: Bell },
  { label: 'How to Play', action: () => navigateTo('howToPlay'), icon: FileQuestionMark },
  { label: 'Contact', action: () => navigateTo('contact'), icon: Mail },
]
</script>

<template>
  <div>
    <ModalHeader text="Options." class="mb-4" />
    <div class="flex flex-col gap-2.5 text-light-text-secondary dark:text-dark-text-secondary select-none">
      <ThemeToggle />
      <hr class="border-gray-300 dark:border-neutral-600 transition-colors duration-300">
      <BaseButton
        v-for="item in menuItems"
        :key="item.label"
        class="group flex justify-between items-center w-full transition-colors duration-300"
        @click="item.action"
      >
        <span class="font-semibold">{{ item.label }}</span>
        <BaseIcon
          :icon="item.icon"
          :size="20"
          class="text-light-text-secondary dark:text-dark-text-secondary options-icon"
        />
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.options-icon {
  transition: transform 300ms ease;
}

@media (hover: hover) {
  .group:hover .options-icon {
      transform: rotate(7deg);
  }
}
</style>
