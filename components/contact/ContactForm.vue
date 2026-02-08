<script setup lang="ts">
import { NUXT_API_ROUTES } from '~/constants/api/routes'
import { ContactRequestSchema, ContactResponseSchema } from '~/schemas/contact/contact.schema'

const form = ref({
  honeypot: '',
  email: '',
  message: '',
})

const emailInputRef = ref<{ focus: () => void } | null>(null)
const messageInputRef = ref<{ focus: () => void } | null>(null)

const errors = ref<Record<string, string | undefined>>({})
const submissionStatus = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')

function focusFirstError() {
  if (errors.value.email) {
    emailInputRef.value?.focus()
  }
  else if (errors.value.message) {
    messageInputRef.value?.focus()
  }
}

function clearError(field: 'email' | 'message') {
  if (errors.value[field]) {
    errors.value[field] = undefined
  }
}

async function handleSubmit() {
  submissionStatus.value = 'idle'
  errors.value = {}

  form.value.email = form.value.email.trim()
  form.value.message = form.value.message.trim()

  const result = ContactRequestSchema.safeParse(form.value)

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    errors.value = {
      email: fieldErrors.email?.[0],
      message: fieldErrors.message?.[0],
    }

    await nextTick()

    focusFirstError()

    return
  }

  // honeypot
  if (form.value.honeypot) {
    console.warn('Honeypot field filled. Likely a bot.')
    submissionStatus.value = 'success'
    return
  }

  // if (document.activeElement && 'blur' in document.activeElement) {
  //   (document.activeElement as HTMLElement).blur()
  // }

  submissionStatus.value = 'submitting'

  try {
    await apiClient(ContactResponseSchema, NUXT_API_ROUTES.CONTACT, {
      method: 'POST',
      body: result.data,
    })

    submissionStatus.value = 'success'
    form.value = {
      email: '',
      message: '',
      honeypot: '',
    }

    setTimeout(() => {
      submissionStatus.value = 'idle'
    }, 3000)
  }
  catch (error: any) {
    await delay(500)
    console.error('Contact form submission failed:', error)

    if (error.statusCode === 429 || error.statusCode === 503) {
      submissionStatus.value = 'idle'
      return
    }

    submissionStatus.value = 'error'
  }
}
</script>

<template>
  <form class="flex flex-col gap-1 flex-grow justify-center" novalidate @submit.prevent="handleSubmit">
    <!-- Honeypot -->
    <div class="absolute w-px h-px overflow-hidden -left-[5000px]">
      <label for="honeypot-name">Name</label>
      <input
        id="honeypot-name"
        v-model="form.honeypot"
        type="text"
        name="honeypot-name"
        tabindex="-1"
        autocomplete="off"
      >
    </div>

    <FormInput
      id="email"
      ref="emailInputRef"
      v-model="form.email"
      label="Your Email"
      type="email"
      placeholder="you@example.com"
      :error="errors.email"
      required
      @input="clearError('email')"
    />

    <FormTextarea
      id="message"
      ref="messageInputRef"
      v-model="form.message"
      label="Message"
      placeholder="Questions, concerns, or feedback..."
      :rows="6"
      :error="errors.message"
      required
      class="mt-4"
      @input="clearError('message')"
    />

    <ContactFormButton :status="submissionStatus" />

    <!-- Screen reader announcements -->
    <span class="sr-only" aria-live="polite" role="status">
      <p v-if="submissionStatus === 'success'">
        Form submitted successfully. We'll get back to you as soon as possible!
      </p>
      <p v-else-if="submissionStatus === 'error'">
        Form submission failed. Unexpected error. Please try again.
      </p>
    </span>

    <!-- Visual feedback -->
    <p v-if="submissionStatus === 'success'" class="text-green-700 text-sm text-center mt-1 font-bold">
      Success. We'll get back to you shortly!
    </p>
    <p v-else-if="submissionStatus === 'error'" class="text-red-error text-sm text-center mt-1 font-bold">
      Unexpected error. Please try again.
    </p>
  </form>
</template>
