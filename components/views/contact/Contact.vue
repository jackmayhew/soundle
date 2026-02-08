<script setup lang="ts">
import { Mail, Twitter } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col px-4 pb-4">
    <Header
      title="Contact."
      subtitle="Questions, concerns, or feedback?<br>Send us a message!"
      blur-position="-bottom-[10px] h-[10px]"
    />
    <div class="text-center mb-4 shrink-0">
      <div class="mt-[4px] flex flex-col justify-center items-center gap-1 text-sm text-light-text-primary dark:text-dark-text-primary">
        <a
          href="mailto:support@soundle.game"
          class="group flex items-center gap-1"
        >
          <BaseIcon
            :icon="Mail"
            :size="18"
            class="contact-icon"
          />
          <span class="font-medium">hello@soundle.game</span>
        </a>
        <a
          href="https://twitter.com/soundle"
          target="_blank"
          class="group flex items-center gap-1"
        >
          <BaseIcon
            :icon="Twitter"
            :size="18"
            class="contact-icon"
          />
          <span class="font-medium">soundlegame</span>
          <span class="sr-only">(twitter profile opens in a new tab)</span>
        </a>
      </div>
    </div>
    <ContactForm />
  </div>
</template>

<style scoped>
.contact-icon {
  transition: transform 300ms ease;
}

@media (hover: hover) {
  .group:hover .contact-icon {
      transform: rotate(-10deg) scale(1);
  }
}
</style>
