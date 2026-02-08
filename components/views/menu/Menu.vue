<script setup lang="ts">
const gameStore = useGameStore()
const uiStore = useUiStore()
const historyStore = useHistoryStore()

const puzzleNumber = usePuzzleNumber(() => gameStore.dailyGame.puzzleDate)

const gridRef = ref<ComponentPublicInstance | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subTitleRef = ref<HTMLElement | null>(null)
const buttonsRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

const { playMenuAnimation } = useMenuIntro()

onMounted(() => {
  playMenuAnimation([
    gridRef.value?.$el,
    titleRef.value,
    subTitleRef.value,
    buttonsRef.value,
    footerRef.value,
  ])
})
</script>

<template>
  <div class="flex flex-col p-4 min-h-full justify-center">
    <MenuGrid ref="gridRef" />
    <div class="text-center mb-4">
      <h1
        ref="titleRef"
        tabindex="-1"
        class="main-title-ref text-4xl xs-350:text-5xl font-coop text-light-text-primary dark:text-dark-text-primary will-change-[opacity,transform]"
      >
        Soundle.
      </h1>
      <p ref="subTitleRef" class="mt-2 text-light-text-secondary dark:text-dark-text-secondary will-change-[opacity,transform]">
        A daily audio puzzle.
        <br>
        Can you guess the sound?
      </p>
    </div>
    <div class="flex flex-col gap-2s justify-center items-center">
      <div
        ref="buttonsRef"
        class="flex flex-col gap-2 justify-center items-center will-change-[opacity,transform]"
      >
        <MenuButton
          v-if="gameStore.dailyGame.result === 'pending'"
          variant="yellow"
          @click="gameStore.startDailyGame()"
        >
          Play
        </MenuButton>
        <MenuButton
          v-else
          variant="yellow"
          @click="historyStore.viewResults(gameStore.dailyGame.puzzleDate)"
        >
          Play
        </MenuButton>
        <MenuButton
          variant="black"
          @click="uiStore.setView('archive')"
        >
          Archive
        </MenuButton>
      </div>
      <div ref="footerRef" class="mt-3 text-center text-light-text-secondary dark:text-dark-text-secondary transition-colors duration-300 will-change-[opacity,transform]">
        <p v-if="puzzleNumber" class="text-sm">
          Puzzle #{{ puzzleNumber }}
        </p>
        <div class="flex flex-col gap-0.5 text-light-text-secondary dark:text-dark-text-secondary mt-1 transition-colors duration-300 w-fit mx-auto">
          <BaseButton
            class="text-xs italic underline"
            aria-label="Open settings options"
            @click="uiStore.showModal('options')"
          >
            Options
          </BaseButton>
        </div>
      </div>
      <!-- <BaseButton @click="() => { throw new Error('Frontend Crash Test') }">
        Click to Crash
      </BaseButton> -->
    </div>
  </div>
</template>
