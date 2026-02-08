<script setup lang="ts">
import { TUTORIAL_AUDIO } from '~/constants/game/tutorial'
</script>

<template>
  <div class="flex flex-col items-center text-center w-full">
    <ModalHeader text="Listen." />

    <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
      Press play to hear the sound. You can listen to it as many times as you need.
    </p>

    <div class="w-full max-w-[200px] mx-auto">
      <AudioPlayer :src="TUTORIAL_AUDIO" />
    </div>

    <p class="mt-4 text-xs italic text-light-text-secondary/60">
      Next: Let's make a guess.
    </p>
  </div>
</template>
