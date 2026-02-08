<script setup lang="ts">
import type { HintCodeType } from '~/types/game/hint-code.types'
import { Sparkles } from 'lucide-vue-next'
import { hintMessages } from '~/constants/game/hint-codes'

const props = defineProps<{
  hint?: HintCodeType | null
  hintComponentSize: 'small' | 'large'
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: []
  close: []
}>()

const hintContainer = ref<HTMLElement | null>(null)

const hintMessage = computed(() => {
  return props.hint ? hintMessages[props.hint] : 'There was an error loading this hint.'
})

const uniqueId = computed(() => `hint-popover-${Math.random().toString(36).substring(2, 9)}`)
</script>

<template>
  <div
    ref="hintContainer"
    class="relative inline-block"
    :class="{ 'z-50': isOpen }"
  >
    <BaseButton
      class="hint-btn flex-shrink-0 flex items-center justify-center rounded-md bg-gray-200 text-gray-700
      dark:text-dark-text-secondary dark:bg-dark-game-background dark:border-3 hover:bg-gray-300
      dark:hover:bg-dark-background dark:border-dark-border-primary transition-all duration-300 ease-in-out"
      :class="[
        hintComponentSize === 'large' ? 'h-7 w-7' : 'h-6 w-6',
      ]"
      aria-label="Show hint"
      :aria-expanded="isOpen"
      :aria-controls="uniqueId"
      @click.stop="emit('toggle')"
    >
      <BaseIcon
        :icon="Sparkles"
        :size="hintComponentSize === 'small' ? 14 : 18"
      />
    </BaseButton>
    <Popover
      :show="isOpen"
      :ignore-refs="hintContainer ? [hintContainer] : []"
      position="top-right"
      border-radius="rounded-md"
      width="w-[175px]"
      @close="emit('close')"
    >
      <div :id="uniqueId" class="text-sm">
        {{ hintMessage }}
      </div>
    </Popover>
  </div>
</template>

<style scoped>
.hint-btn {
  -webkit-tap-highlight-color: transparent;
}
</style>
