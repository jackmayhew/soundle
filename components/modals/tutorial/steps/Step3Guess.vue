<script setup lang="ts">
import { TUTORIAL_BAD_GUESS, TUTORIAL_CORRECT_GUESS } from '~/constants/game/tutorial'

const displayedGuess = ref('')
const isTyping = ref(true)

onMounted(async () => {
  await delay(1000)
  let currentIndex = 0
  const typingSpeed = 80

  const typeEffect = setInterval(() => {
    if (currentIndex < TUTORIAL_CORRECT_GUESS.length) {
      displayedGuess.value += TUTORIAL_CORRECT_GUESS[currentIndex]
      currentIndex++
    }
    else {
      clearInterval(typeEffect)
      isTyping.value = false
    }
  }, typingSpeed)
})
</script>

<template>
  <div class="flex flex-col items-center text-center w-full">
    <ModalHeader text="Guessing." />
    <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
      Type your guess in the box. <br>
      Remember:
      <span class="font-bold text-light-text-primary dark:text-dark-text-primary text-black">
        Be specific!
      </span>
    </p>
    <div class="w-full mx-auto relative group">
      <input
        v-model="displayedGuess"
        readonly
        type="text"
        :placeholder="isTyping ? 'Type your guess...' : ''"
        class="w-full h-12 px-2 text-base font-medium rounded-lg border-3 border-light-border-primary dark:border-dark-border-primary bg-white-primary dark:bg-dark-game-background text-light-text-primary dark:text-dark-text-primary focus:outline-none cursor-default"
      >
    </div>
    <div class="mt-4 space-y-1">
      <p class="text-xs text-light-text-secondary dark:text-dark-text-secondary">
        <span class="text-red-700 font-bold">Bad:</span> "{{ TUTORIAL_BAD_GUESS }}"
      </p>
      <p class="text-xs text-light-text-secondary dark:text-dark-text-secondary">
        <span class="text-green-800 font-bold">Good:</span> "{{ TUTORIAL_CORRECT_GUESS }}"
      </p>
    </div>
    <p class="mt-4 text-xs italic text-light-text-secondary dark:text-dark-text-secondary">
      Next: Results and hints.
    </p>
  </div>
</template>
