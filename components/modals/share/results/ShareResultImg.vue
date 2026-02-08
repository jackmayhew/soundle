<script setup lang="ts">
import type { GameInstance } from '~/types/game/game.types'
import type { ResultsShareOptions } from '~/types/share/results'

defineProps<{
  result: GameInstance
  options: ResultsShareOptions
}>()
</script>

<template>
  <div id="shareCard" class="bg-[#ECF0F1] p-4 border-3 border-black-primary rounded-2xl text-black-primary w-[250px]">
    <div class="text-center mb-2">
      <h1 class="text-3xl font-coop">
        Soundle.
      </h1>
      <p class="text-xs">
        {{ formatPuzzleTitle(result?.puzzleNumber, result?.puzzleDate, true) }}
      </p>
    </div>
    <h3
      v-if="result.answer"
      class="text-lg font-extrabold text-center uppercase leading-none"
      :class="{ 'blur-sm': !options.showAnswer }"
    >
      {{ result.answer }}.
    </h3>

    <div class="flex gap-2 items-center justify-evenly mt-2">
      <div class="text-center text-xs font-semibold flex flex-col justify-center items-center w-1/4">
        Diff
        <span v-if="result.difficulty" class="border-3 bg-orange-primary rounded-lg border-black-primary h-8 w-full flex items-center justify-center text-sm leading-none">
          <span class="font-bold -mt-1">{{ result.difficulty }}</span>
          <span class="mx-0.5">/</span>
          <span class="font-bold -mb-1">5</span>
        </span>
        <span v-else class="font-bold border-3 bg-white-primary rounded-lg border-black-primary h-8 w-full flex items-center justify-center text-sm leading-none">
          N/A
        </span>
      </div>
      <div class="text-center text-xs font-semibold flex flex-col justify-center items-center w-1/4">
        Time
        <div class="whitespace-nowrap border-3 h-8 px-3 bg-yellow-primary border-black-primary rounded-lg text-sm font-bold flex items-center justify-center">
          <span>{{ result.completionTime ? formatPuzzleTime(result.completionTime) : 'N/A' }}</span>
        </div>
      </div>
      <div class="text-center text-xs font-semibold flex flex-col justify-center items-center w-1/4">
        Guesses
        <span class="whitespace-nowrap border-3 bg-blue-primary rounded-lg border-black-primary h-8 w-full flex items-center justify-center text-sm leading-none">
          {{ result.guesses.length || 'N/A' }}
        </span>
      </div>
    </div>
    <!-- using padding on list (instead of space) to allow blur on truncated elements (safari bug) -->
    <div class="my-4">
      <div v-for="n in 6" :key="`row-${n}`" class="flex items-center w-full relative">
        <span class="flex-shrink-0 border-3 bg-white-primary rounded-md border-black-primary h-[1.4rem] w-[1.4rem] flex items-center justify-center text-xs font-semibold">
          {{ n }}
        </span>
        <template v-if="result.guesses[n - 1]">
          <div class="flex-grow overflow-hidden">
            <div
              class="truncate uppercase text-left w-full py-0.5 pr-1 pl-2 text-base"
              :class="{ 'blur-sm': !options.showGuesses }"
            >
              {{ result.guesses[n - 1]!.text }}
            </div>
          </div>

          <div class="flex-shrink-0d">
            <GuessResultIcon
              :correct="result.guesses[n - 1]!.correct"
              :icon-size="14"
              container-size="h-[1.4rem]"
            />
          </div>
        </template>
        <template v-else>
          <span class="flex-grow p-0.5">&nbsp;</span>
        </template>
      </div>
    </div>

    <div class="text-center">
      <p class="font-coop">
        soundle.game
      </p>
    </div>
  </div>
</template>
