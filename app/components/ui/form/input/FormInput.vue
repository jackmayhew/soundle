<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  label: string
  modelValue: string
  type?: 'text' | 'email'
  placeholder?: string
  error?: string
  required?: boolean
}>(), {
  type: 'text',
  placeholder: '',
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': []
}>()

const baseInputRef = ref<{ focus: () => void } | null>(null)

function focus() {
  baseInputRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="relative text-light-text-primary dark:text-dark-text-primary">
    <label :for="id" class="block text-sm font-semibold mb-1">
      {{ label }}
      <span v-if="required">*</span>
    </label>
    <BaseInput
      :id="id"
      ref="baseInputRef"
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :has-error="!!error"
      :required="required"
      :aria-describedby="error ? `${id}-error` : undefined"
      @update:model-value="emit('update:modelValue', $event)"
      @input="emit('input')"
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
