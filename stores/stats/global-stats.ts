import { defineStore } from 'pinia'
import { NUXT_API_ROUTES } from '~/constants/api/routes'
import { GlobalResultsResponseSchema } from '~/schemas/results/global-results.schema'
import { useHistoryStore } from '~/stores/game/history'
import { normalizeGlobalStats } from '~/utils/stats/global-stats-calculations'

export const useGlobalStatsStore = defineStore('globalStats', {
  state: () => ({
    stats: {} as Record<string, ReturnType<typeof normalizeGlobalStats>>, // cache for stats by puzzle date
    loadingStates: {} as Record<string, 'idle' | 'loading' | 'success' | 'error'>,
  }),

  getters: {
    /**
     * Retrieves stats for the puzzle currently being viewed in the Results view.
     */
    activeGlobalStats(state) {
      const historyStore = useHistoryStore()
      const date = historyStore.resultsDate
      return date ? state.stats[date] : null
    },

    /**
     * Retrieves the current loading status for the active results date.
     */
    activeLoadingState(state) {
      const historyStore = useHistoryStore()
      const date = historyStore.resultsDate
      return date ? (state.loadingStates[date] ?? 'idle') : 'idle'
    },
  },

  actions: {
    /**
     * Fetches community-wide statistics for a specific puzzle date.
     * Implements a fallback to 'idle' on 429/503 errors to allow for retries.
     */
    async fetchGlobalStats(puzzleDate?: string) {
      const targetDate = puzzleDate || useHistoryStore().resultsDate

      if (!targetDate || this.loadingStates[targetDate] === 'loading' || this.loadingStates[targetDate] === 'success') {
        return
      }

      const dateKey = targetDate
      this.loadingStates[dateKey] = 'loading'

      try {
        const response = await apiClient(
          GlobalResultsResponseSchema,
          NUXT_API_ROUTES.GLOBAL_RESULTS(dateKey),
        )

        this.stats[dateKey] = normalizeGlobalStats(response)
        this.loadingStates[dateKey] = 'success'
      }
      catch (error: any) {
        // Delay error state to prevent UI flickering on fast failures
        await delay(500)

        // Handle rate limiting or server overload by resetting to idle
        if (error.statusCode === 429 || error.statusCode === 503) {
          this.loadingStates[dateKey] = 'idle'
          return
        }

        console.error('Failed to fetch global stats:', error)
        this.loadingStates[dateKey] = 'error'
      }
    },
  },
})
