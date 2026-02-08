<script setup>
import { AudioLines, Headphones, Volume2 } from 'lucide-vue-next'

const uiStore = useUiStore()

const squareRefs = ref([])
const { activeState } = useGridTicker([AudioLines, Headphones, Volume2])
const { playGridAnimation } = useGridIntro()

onMounted(() => {
  playGridAnimation(squareRefs.value)
})
</script>

<template>
  <div class="flex items-center justify-center h-48 mb-2" aria-hidden="true">
    <div class="bg-yellow-primary rounded-xl p-4 border-3 border-black-primary">
      <div class="grid grid-cols-3 gap-1.5">
        <div
          v-for="index in 9"
          :key="index"
          :ref="el => squareRefs[index - 1] = el"
          class="w-10 h-10 rounded-md border-3 border-black-primary flex items-center justify-center transition-colors duration-200"
          :class="{
            'bg-white-primary': activeState.index !== index - 1,
            'opacity-0': uiStore.isInitialLoad,
            [activeState.color]: activeState.index === index - 1,
            'jello': activeState.index === index - 1,
          }"
        >
          <BaseIcon
            v-if="activeState.index === index - 1"
            :icon="activeState.icon"
            class="fade-in select-none w-6 h-6"
            :stroke-width="3"
          />
        </div>
      </div>
    </div>
  </div>
</template>
