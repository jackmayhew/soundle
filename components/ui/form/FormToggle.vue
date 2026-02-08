<script setup lang="ts">
const props = withDefaults(defineProps<{
  id: string
  label: string
  checked?: boolean
  loading?: boolean
  disabled?: boolean
  preventDefault?: boolean
}>(), {
  checked: false,
  loading: false,
  disabled: false,
  preventDefault: false,
})

const emit = defineEmits<{
  click: [event: Event]
}>()

function handleClick(event: Event) {
  if (props.preventDefault)
    event.preventDefault()
  emit('click', event)
}

const labelClasses = computed(() => ({
  'cursor-pointer': !props.disabled,
  'pointer-events-none opacity-50': props.disabled,
}))
</script>

<template>
  <div class="relative" :class="{ 'cursor-not-allowed': disabled }">
    <label
      :for="id"
      class="flex items-center justify-between text-sm font-semibold"
      :class="labelClasses"
      :tabindex="disabled ? -1 : 0"
      @keydown.space="handleClick"
      @keydown.enter="handleClick"
    >
      <span class="select-none text-light-text-secondary dark:text-dark-text-secondary">
        {{ label }}
      </span>
      <div class="relative">
        <input
          :id="id"
          type="checkbox"
          class="sr-only peer"
          :checked="checked"
          :disabled="disabled"
          tabindex="-1"
          @click="handleClick"
        >
        <div class="w-10 h-6 bg-white-primary border-3 border-light-border-primary dark:border-dark-border-primary rounded-full peer peer-checked:bg-green-primary" />
        <div class="absolute left-1 top-1 w-4 h-4 bg-white-primary border-3 border-light-border-primary dark:border-dark-border-primary rounded-full transition-transform peer-checked:translate-x-full" />
        <div
          v-if="loading"
          class="absolute inset-0 cursor-not-allowed rounded-full skeleton-overlay"
        />
      </div>
    </label>
  </div>
</template>
