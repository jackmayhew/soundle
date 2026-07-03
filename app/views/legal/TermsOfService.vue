<script setup lang="ts">
const uiStore = useUiStore()
const contactEmail = 'hello@soundle.game'

const sections = [
  {
    title: 'Use of the Service:',
    content: `<p>Soundle is a "guess the sound" game provided for your personal, non-commercial use. You agree not to misuse the Service, including but not limited to, attempting to disrupt its servers, reverse-engineer the game, or submit malicious data.</p>`,
  },
  {
    title: 'Intellectual Property:',
    content: `<p>The Service and its original content, features, and functionality are and will remain the exclusive property of Soundle and its licensors.</p>`,
  },
  {
    title: 'Disclaimer of Warranties:',
    content: `<p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the service will be uninterrupted, secure, or error-free.</p>`,
  },
  {
    title: 'Limitation of Liability:',
    content: `<p>In no event shall Soundle, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use, the Service.</p>`,
  },
  {
    title: 'Governing Law:',
    content: `<p>These Terms shall be governed in accordance with the laws of British Columbia, Canada, without regard to its conflict of law provisions.</p>`,
  },
  {
    title: 'Contact Us:',
    content: `<p>If you have any questions about these Terms, please contact us at <a href="mailto:${contactEmail}" class="underline">${contactEmail}</a>.</p>`,
  },
]
</script>

<template>
  <div class="flex flex-col px-4 pb-4">
    <Header
      title="Terms."
      subtitle="Updated: December 22, 2025."
      margin-class="mb-4"
    />

    <div class="flex-1 space-y-6 text-left text-sm text-light-text-secondary dark:text-dark-text-secondary">
      <section v-for="(section, index) in sections" :key="index">
        <div class="flex gap-2 items-center mb-2">
          <div class="flex-shrink-0 border-3 bg-white-primary dark:bg-light-game-background dark:bg-dark-game-background text-light-text-primary dark:text-dark-text-primary rounded border-light-border-primary dark:border-dark-border-primary aspect-square h-6 flex items-center justify-center text-sm font-bold">
            {{ index + 1 }}
          </div>
          <h2 class="font-bold text-base text-light-text-primary dark:text-dark-text-primary">
            {{ section.title }}
          </h2>
        </div>
        <div class="space-y-3" v-html="section.content" />
      </section>
    </div>

    <div class="mt-8">
      <BasicButton
        variant="green"
        @click="uiStore.setView('menu')"
      >
        Got it!
      </BasicButton>
    </div>
  </div>
</template>
