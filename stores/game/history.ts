import type { GameInstance } from '~/types/game/game.types'
import { defineStore } from 'pinia'
import { notifyTabsOfUpdate } from '~/composables/browser/use-tab-sync'
import { useArchiveDates } from '~/composables/game/use-archive-dates'
import { useGameStore } from '~/stores/game/index'
import { useStatsStore } from '~/stores/stats/user-stats'
import { useUiStore } from '~/stores/ui'
import { persistentStorage } from '~/utils/browser/storage'
import { getTodayString, getYearFromDate } from '~/utils/date/getters'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    /** Nested: calendar[year][date] = GameInstance. */
    calendar: {} as Record<string, Record<string, GameInstance>>,
    /** Date being viewed in Results view. */
    resultsDate: '' as string,
  }),

  getters: {
    /**
     * Retrieves the full game data for the puzzle currently targeted
     * by the results view.
     */
    activeResultData(state): GameInstance | null {
      if (!state.resultsDate)
        return null
      const year = getYearFromDate(state.resultsDate)
      return state.calendar[year]?.[state.resultsDate] ?? null
    },

    /**
     * Groups all available archive dates by Month and Year.
     * Months are sorted newest-to-oldest at the top level, while
     * days within each month are kept in chronological order for the grid.
     */
    archiveByMonth(): Record<string, string[]> {
      const archiveDates = useArchiveDates()

      return archiveDates.reduce((acc, dateString) => {
        const date = new Date(`${dateString}T12:00:00Z`)
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })

        if (!acc[monthYear]) {
          acc[monthYear] = []
        }
        // add to start of array so dates are in descending order (reverse)
        acc[monthYear].unshift(dateString)
        return acc
      }, {} as Record<string, string[]>)
    },
  },

  actions: {
    /**
     * Records a completed game into the calendar and triggers persistence.
     */
    saveGameToHistory(game: GameInstance) {
      const year = getYearFromDate(game.puzzleDate)
      if (!this.calendar[year]) {
        this.calendar[year] = {}
      }

      // Save a deep copy to the calendar
      this.calendar[year][game.puzzleDate] = { ...game }

      // Sync with other tabs
      const gameStore = useGameStore()
      const statsStore = useStatsStore()
      notifyTabsOfUpdate({
        dailyGame: gameStore.dailyGame,
        calendar: this.calendar,
        streakData: statsStore.streakData,
      })
    },

    /**
     * Switches to the results view for a specific puzzle date.
     */
    viewResults(date: string) {
      this.resultsDate = date
      const uiStore = useUiStore()
      uiStore.setView('results')
    },

    /**
     * Sets the view to today's daily game result.
     */
    viewDailyGameResult() {
      const gameStore = useGameStore()
      gameStore.archiveGame = null
      this.viewResults(getTodayString())
    },

    /**
     * Logic to load an archived game or redirect to results if already played.
     */
    startArchiveGame(puzzleDate: string) {
      const gameStore = useGameStore()
      const uiStore = useUiStore()

      // If user picks today, just start the daily game
      if (puzzleDate === getTodayString()) {
        gameStore.startDailyGame()
        return
      }

      // If already played, just show the results
      if (this.getGameByDate(puzzleDate)) {
        this.viewResults(puzzleDate)
        return
      }

      // Create a fresh archive session in the game store
      gameStore.archiveGame = {
        puzzleDate,
        guesses: [],
        result: 'pending',
        audioUrl: '',
        hint: '',
        answer: '',
        loadingStatus: 'loading',
        difficulty: null,
        puzzleNumber: null,
        elapsedTime: 0,
        completionTime: 0,
      }

      uiStore.setView('game')
    },

    /**
     * Helper to retrieve a specific game from the calendar.
     */
    getGameByDate(date: string): GameInstance | null {
      const year = getYearFromDate(date)
      return this.calendar[year]?.[date] ?? null
    },

    /**
     * Removes a puzzle entry from the calendar. Primarily used to
     * clear out corrupted entries or allow a user to retry a
     * puzzle that failed to load correctly.
     */
    deleteGameFromHistory(date: string) {
      const year = getYearFromDate(date)
      if (this.calendar[year]?.[date]) {
        delete this.calendar[year][date]

        // Sync the deletion to other tabs
        const gameStore = useGameStore()
        const statsStore = useStatsStore()

        notifyTabsOfUpdate({
          dailyGame: gameStore.dailyGame,
          calendar: this.calendar,
          streakData: statsStore.streakData,
        })
      }
    },

    /**
     * Manually restores the store from asynchronous storage.
     * Used to bypass timing issues between the persistence plugin and the Nuxt lifecycle.
     */
    async hydrateState() {
      const state = await getHydratedState<any>('history')
      if (state)
        this.$patch(state)
    },
  },

  persist: {
    storage: import.meta.client ? persistentStorage : undefined,
    paths: ['calendar'],
  } as any,
})
