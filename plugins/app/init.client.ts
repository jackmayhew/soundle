export default defineNuxtPlugin(async (_nuxtApp) => {
  // Stores and composables
  const gameStore = useGameStore()
  const userStore = useUserStore()
  const statsStore = useStatsStore()
  const historyStore = useHistoryStore()

  // Synchronous initializers
  initializeTabSync()

  // Hydrate state from storage
  await Promise.all([
    gameStore.hydrateState(),
    statsStore.hydrateState(),
    historyStore.hydrateState(),
    userStore.hydrateState(),
  ])

  // Run post-hydration logic
  userStore.initializeAnonymousId()
  statsStore.checkStreakOnAppLoad()
  gameStore.initializeDailyGame()
})
