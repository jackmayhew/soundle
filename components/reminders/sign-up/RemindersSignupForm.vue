<script setup lang="ts">
import type { EmailReminderRequest } from '~/schemas/reminders/email-reminder.schema'
import { Send } from 'lucide-vue-next'
import { NUXT_API_ROUTES } from '~/constants/api/routes'
import { EmailReminderRequestSchema, EmailReminderResponseSchema } from '~/schemas/reminders/email-reminder.schema'

const emit = defineEmits<{
  success: [email: string]
}>()

const userStore = useUserStore()

const { isShaking, triggerShake: setErrorShake } = useShake()

const email = ref('')
const formState = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const includeHint = ref(true)
const errorMessage = ref('')

const hasShownError = ref(false)

const emailInputRef = ref<{ focus: () => void } | null>(null)

async function handleSubmit() {
  errorMessage.value = ''

  try {
    email.value = email.value.trim()

    const payload: EmailReminderRequest = {
      email: email.value,
      includeHint: includeHint.value,
      anonymousId: userStore.anonymousId,
    }

    const validation = EmailReminderRequestSchema.safeParse(payload)

    if (!validation.success) {
      formState.value = 'error'
      errorMessage.value = 'Please enter a valid email.'
      if (hasShownError.value)
        setErrorShake()
      hasShownError.value = true
      emailInputRef.value?.focus()
      return
    }

    formState.value = 'loading'

    await apiClient(EmailReminderResponseSchema, NUXT_API_ROUTES.CREATE_REMINDER, {
      method: 'POST',
      body: payload,
    })

    formState.value = 'success'
    emit('success', email.value)
  }

  catch (error: any) {
    await delay(500)
    console.error('Error submitting email:', error)
    formState.value = 'error'

    if (error.data?.message) {
      errorMessage.value = error.data.message
    }
    else {
      errorMessage.value = 'An unexpected error occurred. Please try again.'
    }
  }
}

function clearError() {
  formState.value = 'idle'
}
</script>

<template>
  <form
    class="flex flex-col gap-3 relative w-full"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <label for="email-input" class="sr-only">Your Email</label>
    <BaseInput
      id="email-input"
      ref="emailInputRef"
      v-model="email"
      type="email"
      placeholder="you@example.com"
      :disabled="formState === 'loading'"
      :has-error="formState === 'error'"
      required
      aria-describedby="email-error"
      @input="clearError()"
    />
    <div :class="{ 'cursor-not-allowed': formState === 'loading' }">
      <StatefulButton
        type="submit"
        :loading="formState === 'loading'"
      >
        Submit
        <BaseIcon
          :icon="Send"
          :size="18"
          :stroke-width="2.5"
        />
      </StatefulButton>
    </div>
    <p
      v-if="errorMessage"
      id="email-error"
      class="text-red-error text-xs font-bold text-center"
      :class="{ shake: isShaking }"
      aria-live="polite"
    >
      {{ errorMessage }}
    </p>
  </form>
</template>
