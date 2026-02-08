import type { UserStatistics } from '~/types/stats/user-stats.types'
import { defineStore } from 'pinia'
import { useHistoryStore } from '~/stores/game/history'
import { useGameStore } from '~/stores/game/index'
import { persistentStorage } from '~/utils/browser/storage'
import { getTodayString } from '~/utils/date/getters'
import { calculateUserStats } from '~/utils/stats/user-stats-calculations'

export const useStatsStore = defineStore('stats', {
  /**
   * Persistent streak data. We keep this separate from the game history
   * to allow for rapid lookups and simpler streak validation logic.
   */
  state: () => ({
    streakData: {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: '',
    },
  }),

  getters: {
  /**
   * Reactive statistics profile. Aggregates historical calendar data
   * from the historyStore and combines it with current streak state.
   */
    stats(): UserStatistics {
      const historyStore = useHistoryStore()
      return calculateUserStats(historyStore.calendar, this.streakData)
    },
  },

  actions: {
    /**
     * Updates the current streak based on the active game's outcome.
     * Logic follows the standard "daily puzzle" rule: wins increment,
     * losses reset to 0, and playing the same day twice is ignored.
     */
    updateStreak() {
      const gameStore = useGameStore()
      const game = gameStore.activeGame
      if (!game)
        return

      const today = getTodayString()

      // 1. Handle Loss
      if (game.result === 'loss') {
        this.streakData.currentStreak = 0
        this.streakData.lastPlayedDate = today
        return
      }

      // 2. Handle Win
      const last = this.streakData.lastPlayedDate

      if (!last) {
        // First game ever
        this.streakData.currentStreak = 1
        this.streakData.longestStreak = 1
      }
      else if (last === today) {
        // Already played today, don't increment
        return
      }
      else {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        if (last === yesterdayStr) {
          // Played yesterday, increment
          this.streakData.currentStreak++
        }
        else {
          // Missed a day, reset to 1
          this.streakData.currentStreak = 1
        }
      }

      this.streakData.lastPlayedDate = today

      // Update personal best
      if (this.streakData.currentStreak > this.streakData.longestStreak) {
        this.streakData.longestStreak = this.streakData.currentStreak
      }
    },

    /**
     * Maintenance check to be run on application start.
     * If the user has missed a full calendar day, the current streak is reset to 0.
     */
    checkStreakOnAppLoad() {
      const last = this.streakData.lastPlayedDate
      if (!last)
        return

      const today = getTodayString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      // If the last game wasn't today AND wasn't yesterday, the streak is dead
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
