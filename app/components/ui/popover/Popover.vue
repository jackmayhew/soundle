<script setup lang="ts">
import { onClickOutside, onKeyStroke, useEventListener } from '@vueuse/core'

export type PopoverPosition = 'top-right' | 'top-left' | 'top-center'

const props = withDefaults(defineProps<{
  show: boolean
  position?: PopoverPosition
  width?: string
  borderRadius?: string
  textAlign?: string
  ignoreRefs?: (Ref<HTMLElement | null> | HTMLElement)[]
}>(), {
  position: 'top-right',
  width: 'w-auto',
  borderRadius: 'rounded-lg',
  textAlign: 'text-left',
  ignoreRefs: () => [],
})

const emit = defineEmits<{
  close: []
}>()

const popoverRef = ref<HTMLElement | null>(null)

const ignoreList = computed(() => {
  const list: (Ref<HTMLElement | null> | HTMLElement | null)[] = [popoverRef]
  if (props.ignoreRefs) {
    list.push(...props.ignoreRefs)
  }
  return list
})

onClickOutside(
  popoverRef,
  () => {
    if (props.show) {
      emit('close')
    }
  },
  { ignore: ignoreList },
)

onKeyStroke('Escape', () => {
  if (props.show) {
    emit('close')
  }
})

useEventListener(window, 'resize', () => {
  if (props.show) {
    emit('close')
  }
})

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top-center':
      return 'top-full mt-1 left-1/2 -translate-x-1/2'
    case 'top-left':
      return 'top-full mt-1 left-0'
    case 'top-right':
    default:
      return 'top-full mt-1 right-0'
  }
})

const transitionName = computed(() => {
  switch (props.position) {
    case 'top-center':
      return 'popover-center'
    case 'top-left':
      return 'popover-left'
    case 'top-right':
    default:
      return 'popover-right'
  }
})
</script>

<template>
  <Transition :name="transitionName">
    <div
      v-if="show"
      ref="popoverRef"
      class="absolute border-3 p-2 shadow-lg z-50 text-left text-sm text-light-text-primary
      bg-white-primary border-light-border-primary dark:bg-dark-popover-bg dark:text-dark-text-primary
      dark:border-dark-background whitespace-normal font-bold"
      :class="[positionClasses, width, borderRadius, textAlign]"
    >
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.popover-left-enter-active,
.popover-left-leave-active {
  transform-origin: top left;
  transition: transform 0.3s cubic-bezier(0.53, 0.05, 0.23, 1.15), opacity 0.25s cubic-bezier(0.53, 0.05, 0.23, 0.99);
}

.popover-left-enter-from,
.popover-left-leave-to {
  opacity: 0;
  transform: scale(0);
}

.popover-left-enter-to,
.popover-left-leave-from {
  opacity: 1;
  transform: scale(1);
}

.popover-center-enter-active,
.popover-center-leave-active {
  transform-origin: top center;
  transition: transform 0.3s cubic-bezier(0.53, 0.05, 0.23, 1.15), opacity 0.25s cubic-bezier(0.53, 0.05, 0.23, 0.99);
}

.popover-center-enter-from,
.popover-center-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0);
}

.popover-center-enter-to,
.popover-center-leave-from {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.popover-right-enter-active,
.popover-right-leave-active {
  transform-origin: top right;
  transition: transform 0.3s cubic-bezier(0.53, 0.05, 0.23, 1.15), opacity 0.25s cubic-bezier(0.53, 0.05, 0.23, 0.99);
}

.popover-right-enter-from,
.popover-right-leave-to {
  opacity: 0;
  transform: scale(0);
}

.popover-right-enter-to,
.popover-right-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
