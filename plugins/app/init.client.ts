export default defineNuxtPlugin(async (_nuxtApp) => {
  // 1. Initialize stores and composables
  const gameStore = useGameStore()
  const userStore = useUserStore()
  const statsStore = useStatsStore()
  const historyStore = useHistoryStore()

  // 2. Run synchronous initializers
  initializeTabSync()

  // 3. Hydrate state from storage
  // Blocks app rendering until complete, ensuring no flash of unhydrated state
  await Promise.all([
    gameStore.hydrateState(),
    statsStore.hydrateState(),
    historyStore.hydrateState(),
    userStore.hydrateState(),
  ])

  // 4. Run post-hydration logic
  userStore.initializeAnonymousId()
  statsStore.checkStreakOnAppLoad()
  gameStore.initializeDailyGame()
})
