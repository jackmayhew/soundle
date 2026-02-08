<script setup lang="ts">
import { CircleCheckBig, Send } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  status: 'idle' | 'submitting' | 'success' | 'error'
  idleText?: string
  submittingText?: string
  successText?: string
}>(), {
  idleText: 'Submit',
  submittingText: 'Submitting',
  successText: 'Success!',
})

const isDisabled = computed(() =>
  props.status === 'submitting' || props.status === 'success',
)
</script>

<template>
  <div class="mt-5">
    <StatefulButton
      type="submit"
      size="lg"
      :loading="status === 'submitting'"
      :success="status === 'success'"
      :disabled="isDisabled"
    >
      Submit
      <BaseIcon
        :icon="Send"
        :size="18"
        :stroke-width="2.5"
      />

      <template #success>
        Success!
        <BaseIcon
          :icon="CircleCheckBig"
          :size="18"
          :stroke-width="2.5"
        />
      </template>

      <!-- No error state needed -->
    </StatefulButton>
  </div>
</template>
