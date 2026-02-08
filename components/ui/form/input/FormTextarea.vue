<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  label: string
  modelValue: string
  placeholder?: string
  rows?: number
  error?: string
  required?: boolean
}>(), {
  placeholder: '',
  rows: 6,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': []
}>()

const { focusInput } = useFocus()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input')
}

function blur() {
  textareaRef.value?.blur()
}

function focus() {
  focusInput(textareaRef.value)
}

defineExpose({ focus, blur })
</script>

<template>
  <div class="relative text-light-text-primary dark:text-dark-text-primary">
    <label :for="id" class="block text-sm font-semibold mb-1">
      {{ label }}<span v-if="required">*</span>
    </label>
    <textarea
      :id="id"
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :aria-required="required"
      :aria-describedby="error ? `${id}-error` : undefined"
      :aria-invalid="!!error"
      class="align-top text-base resize-none w-full p-2 bg-light-input-background dark:bg-dark-input-background border-light-border-primary dark:border-dark-border-primary border-3 rounded-lg focus:outline-none focus:ring-2 font-medium"
      :class="{ 'focus-visible:ring-red-error': error }"
      @input="handleInput"
    />
    <p
      v-if="error"
      :id="`${id}-error`"
      class="text-red-error text-xs absolute mt-0.5 font-semibold"
      aria-live="polite"
    >
      {{ error }}
    </p>
  </div>
</template>
