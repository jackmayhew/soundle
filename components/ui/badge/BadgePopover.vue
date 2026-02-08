<script setup lang="ts">
import type { PopoverPosition } from '~/components/ui/popover/Popover.vue'

defineOptions({
  inheritAttrs: false,
})

withDefaults(defineProps<{
  color: 'orange' | 'yellow' | 'purple'
  disabled?: boolean
  popoverWidth?: string
  popoverPosition: PopoverPosition
  popoverTextAlign?: string
}>(), {
  popoverWidth: 'w-full',
})

const showPopover = ref(false)
const popoverContainer = ref<HTMLElement | null>(null)
</script>

<template>
  <div ref="popoverContainer" class="w-full">
    <BadgeButton
      :color="color"
      :active="showPopover"
      :disabled="disabled"
      width="w-full"
      v-bind="$attrs"
      @click="showPopover = !showPopover"
    >
      <!-- Slot for the button's icon -->
      <slot />
    </BadgeButton>

    <Popover
      :show="showPopover"
      :ignore-refs="popoverContainer ? [popoverContainer] : []"
      :position="popoverPosition"
      :width="popoverWidth"
      :text-align="popoverTextAlign"
      @close="showPopover = false"
    >
      <!-- Slot for the popover's content -->
      <slot name="content" />
    </Popover>
  </div>
</template>
