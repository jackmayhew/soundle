<script setup lang="ts">
import { ChartNoAxesCombined } from 'lucide-vue-next'

const props = defineProps<{
  puzzleDate: string
}>()

const globalStatsStore = useGlobalStatsStore()
const uiStore = useUiStore()

onMounted(() => {
  globalStatsStore.fetchGlobalStats(props.puzzleDate)
})

function openStatsModal() {
  uiStore.showModal('globalStats')
}
</script>

<template>
  <BadgeButton
    label="Stats"
    color="orange"
    aria-label="View statistics"
    @click="openStatsModal"
  >
    <BaseIcon
      :icon="ChartNoAxesCombined"
      :size="18"
    />
  </BadgeButton>
</template>
