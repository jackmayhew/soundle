<script setup lang="ts">
import type { PopoverPosition } from '~/components/ui/popover/Popover.vue'

withDefaults(defineProps<{
  label: string
  color: 'orange' | 'yellow' | 'purple'
  value?: string | number
  statWidth?: string
  disabled?: boolean
  alwaysPopover?: boolean
  ariaLabel?: string
  popoverWidth?: string
  popoverPosition: PopoverPosition
  popoverTextAlign?: string
}>(), {
  statWidth: 'w-[36px] xs-370:w-[39px]',
  disabled: false,
  alwaysPopover: false,
  popoverTextAlign: 'center',
})
</script>

<template>
  <div :class="[statWidth]" class="text-center text-xs xs-370:text-sm">
    <span class="text-light-text-primary dark:text-dark-text-primary font-bold">
      {{ label }}
    </span>

    <!-- Static Badge (for larger screens) -->
    <Badge
      v-if="!alwaysPopover"
      :value="value"
      :color="color"
      class="hidden xs-370:flex"
      padding="px-1"
    >
      <slot name="badge-content" />
    </Badge>

    <!-- Popover Button (for small screens, or always (if specified)) -->
    <BadgePopover
      :class="alwaysPopover ? 'flex' : 'flex xs-370:hidden'"
      :color="color"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :popover-width="popoverWidth"
      :popover-position="popoverPosition"
      :popover-text-align="popoverTextAlign"
    >
      <!-- Pass through the icon slot -->
      <slot name="icon" />
      <!-- Pass through the content slot -->
      <template #content>
        <slot name="content" />
      </template>
    </BadgePopover>
  </div>
</template>
