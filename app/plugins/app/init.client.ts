export default defineNuxtPlugin(async (_nuxtApp) => {
  const gameStore = useGameStore()
  const userStore = useUserStore()
  const statsStore = useStatsStore()
  const historyStore = useHistoryStore()
  initializeTabSync()
  await Promise.all([
    gameStore.hydrateState(),
    statsStore.hydrateState(),
    historyStore.hydrateState(),
    userStore.hydrateState(),
  ])
  userStore.initializeAnonymousId()
  statsStore.checkStreakOnAppLoad()
  gameStore.initializeDailyGame()
})
