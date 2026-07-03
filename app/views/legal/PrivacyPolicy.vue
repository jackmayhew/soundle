<script setup lang="ts">
const uiStore = useUiStore()
const contactEmail = 'hello@soundle.game'

const sections = [
  {
    title: 'Information We Collect:',
    content: `
      <p><strong>Anonymous ID:</strong> When you first visit, we store a random, anonymous ID in your browser's local storage. This helps us keep track of your game statistics (like your win streak) without knowing who you are.</p>
      <p><strong>Game Results:</strong> We collect your game results (guesses, win/loss status, completion time) and associate them with your anonymous ID to calculate your personal and global statistics.</p>
      <p><strong>Email Address (Optional):</strong> If you voluntarily sign up for daily reminders, we collect and store your email address.</p>
    `,
  },
  {
    title: 'How We Use Your Information:',
    content: `
      <ul class="list-disc list-inside space-y-2">
        <li>To provide and improve the game.</li>
        <li>To calculate and display your personal and global game statistics.</li>
        <li>To send you daily game reminders, if you have opted in.</li>
        <li>To respond to your inquiries if you contact us.</li>
      </ul>
    `,
  },
  {
    title: 'Data Sharing:',
    content: `<p>We do not sell, trade, or rent your personal information. We only share data with essential third-party services that help us operate the game, such as our hosting and email providers.</p>`,
  },
  {
    title: 'Your Rights & Choices:',
    content: `
      <p><strong>Email Reminders:</strong> You can unsubscribe from daily reminders at any time by clicking the "unsubscribe" link in the bottom of every email.</p>
      <p><strong>Data Deletion:</strong> You can request the deletion of your email address and associated data by contacting us at <a href="mailto:${contactEmail}" class="underline">${contactEmail}</a>.</p>
    `,
  },
]
</script>

<template>
  <div class="flex flex-col px-4 pb-4">
    <Header
      title="Privacy."
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
