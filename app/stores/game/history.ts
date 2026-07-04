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
    calendar: {} as Record<string, Record<string, GameInstance>>,
    resultsDate: '' as string,
  }),

  getters: {
    activeResultData(state): GameInstance | null {
      if (!state.resultsDate)
        return null
      const year = getYearFromDate(state.resultsDate)
      return state.calendar[year]?.[state.resultsDate] ?? null
    },

    archiveByMonth(): Record<string, string[]> {
      const archiveDates = useArchiveDates()

      return archiveDates.reduce((acc, dateString) => {
        const date = new Date(`${dateString}T12:00:00Z`)
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })

        if (!acc[monthYear]) {
          acc[monthYear] = []
        }
        acc[monthYear].unshift(dateString)
        return acc
      }, {} as Record<string, string[]>)
    },
  },

  actions: {
    saveGameToHistory(game: GameInstance) {
      const year = getYearFromDate(game.puzzleDate)
      if (!this.calendar[year]) {
        this.calendar[year] = {}
      }

      this.calendar[year][game.puzzleDate] = { ...game }

      const gameStore = useGameStore()
      const statsStore = useStatsStore()
      notifyTabsOfUpdate({
        dailyGame: gameStore.dailyGame,
        calendar: this.calendar,
        streakData: statsStore.streakData,
      })
    },

    viewResults(date: string) {
      this.resultsDate = date
      const uiStore = useUiStore()
      uiStore.setView('results')
    },

    viewDailyGameResult() {
      const gameStore = useGameStore()
      gameStore.archiveGame = null
      this.viewResults(getTodayString())
    },

    startArchiveGame(puzzleDate: string) {
      const gameStore = useGameStore()
      const uiStore = useUiStore()

      if (puzzleDate === getTodayString()) {
        gameStore.startDailyGame()
        return
      }

      if (this.getGameByDate(puzzleDate)) {
        this.viewResults(puzzleDate)
        return
      }

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

    getGameByDate(date: string): GameInstance | null {
      const year = getYearFromDate(date)
      return this.calendar[year]?.[date] ?? null
    },

    deleteGameFromHistory(date: string) {
      const year = getYearFromDate(date)
      if (this.calendar[year]?.[date]) {
        delete this.calendar[year][date]

        const gameStore = useGameStore()
        const statsStore = useStatsStore()

        notifyTabsOfUpdate({
          dailyGame: gameStore.dailyGame,
          calendar: this.calendar,
          streakData: statsStore.streakData,
        })
      }
    },

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
