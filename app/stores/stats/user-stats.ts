import type { UserStatistics } from '~/types/stats/user-stats.types'
import { defineStore } from 'pinia'
import { useHistoryStore } from '~/stores/game/history'
import { useGameStore } from '~/stores/game/index'
import { persistentStorage } from '~/utils/browser/storage'
import { getTodayString } from '~/utils/date/getters'
import { calculateUserStats } from '~/utils/stats/user-stats-calculations'

export const useStatsStore = defineStore('stats', {
  state: () => ({
    streakData: {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: '',
    },
  }),

  getters: {
    stats(): UserStatistics {
      const historyStore = useHistoryStore()
      return calculateUserStats(historyStore.calendar, this.streakData)
    },
  },

  actions: {
    updateStreak() {
      const gameStore = useGameStore()
      const game = gameStore.activeGame
      if (!game)
        return

      const today = getTodayString()
      if (game.result === 'loss') {
        this.streakData.currentStreak = 0
        this.streakData.lastPlayedDate = today
        return
      }
      const last = this.streakData.lastPlayedDate

      if (!last) {
        this.streakData.currentStreak = 1
        this.streakData.longestStreak = 1
      }
      else if (last === today) {
        return
      }
      else {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        if (last === yesterdayStr) {
          this.streakData.currentStreak++
        }
        else {
          this.streakData.currentStreak = 1
        }
      }

      this.streakData.lastPlayedDate = today
      if (this.streakData.currentStreak > this.streakData.longestStreak) {
        this.streakData.longestStreak = this.streakData.currentStreak
      }
    },

    checkStreakOnAppLoad() {
      const last = this.streakData.lastPlayedDate
      if (!last)
        return

      const today = getTodayString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (last !== today && last !== yesterdayStr) {
        this.streakData.currentStreak = 0
      }
    },

    async hydrateState() {
      const state = await getHydratedState<any>('stats')
      if (state)
        this.$patch(state)
    },
  },

  persist: {
    storage: import.meta.client ? persistentStorage : undefined,
    paths: ['streakData'],
  } as any,
})
