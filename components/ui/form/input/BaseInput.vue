<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  modelValue: string
  type?: 'text' | 'email'
  maxlength?: number
  placeholder?: string
  disabled?: boolean
  hasError?: boolean
  required?: boolean
  ariaDescribedby?: string
}>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  hasError: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': []
}>()

const { focusInput } = useFocus()

const inputRef = ref<HTMLInputElement | null>(null)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input')
}

function blur() {
  inputRef.value?.blur()
}

function focus() {
  focusInput(inputRef.value)
}

defineExpose({ focus, blur })
</script>

<template>
  <input
    :id="id"
    ref="inputRef"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :disabled="disabled"
    :aria-required="required"
    :aria-describedby="ariaDescribedby"
    :aria-invalid="hasError"
    class="w-full p-2 border-3 rounded-lg text-light-text-primary dark:text-dark-text-primary border-light-border-primary dark:border-dark-border-primary bg-light-input-background dark:bg-dark-input-background text-base focus:outline-none font-medium"
    :class="{ 'focus-visible:ring-red-error': hasError }"
    @input="handleInput"
  >
</template>
