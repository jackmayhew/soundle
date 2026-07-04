import type { SubmitResultRequest } from '~/schemas/results/submit-result.schema'
import type { GameInstance } from '~/types/game/game.types'
import type { GuessResult } from '~/types/game/guess/guess-result.types'
import { defineStore } from 'pinia'
import { notifyTabsOfUpdate } from '~/composables/browser/use-tab-sync'
import { NUXT_API_ROUTES } from '~/constants/api/routes'
import { MAX_GUESSES } from '~/constants/app/validation'
import { PublicPuzzleDataSchema } from '~/schemas/game/puzzle.schema'
import { useHistoryStore } from '~/stores/game/history'
import { useStatsStore } from '~/stores/stats/user-stats'
import { useUiStore } from '~/stores/ui'
import { useUserStore } from '~/stores/user'
import { getHydratedState } from '~/utils/browser/hydration'
import { persistentStorage } from '~/utils/browser/storage'
import { getTodayString } from '~/utils/date/getters'

export const useGameStore = defineStore('game', {
  state: () => ({
    dailyGame: {
      guesses: [],
      listenCount: 0,
      result: 'pending',
      puzzleDate: getTodayString(),
      audioUrl: '',
      hint: '',
      answer: '',
      loadingStatus: 'loading',
      difficulty: null,
      puzzleNumber: null,
      elapsedTime: 0,
      completionTime: 0,
    } as GameInstance,
    archiveGame: null as GameInstance | null,
  }),

  getters: {
    activeGame(state): GameInstance | null {
      if (state.archiveGame) {
        return state.archiveGame
      }
      return state.dailyGame
    },

    isGameDisabled(): boolean {
      const game = this.activeGame
      if (!game)
        return true
      return game.guesses.length >= MAX_GUESSES || game.result !== 'pending'
    },
  },

  actions: {
    initializeDailyGame() {
      const todayString = getTodayString()

      if (this.dailyGame.puzzleDate !== todayString) {
        this.dailyGame = {
          guesses: [],
          listenCount: 0,
          result: 'pending',
          puzzleDate: todayString,
          audioUrl: '',
          hint: '',
          answer: '',
          loadingStatus: 'loading',
          difficulty: null,
          puzzleNumber: null,
          elapsedTime: 0,
          completionTime: 0,
        }
      }
    },

    startArchiveGame(puzzleDate: string) {
      if (puzzleDate === this.dailyGame.puzzleDate) {
        this.startDailyGame()
        return
      }

      const historyStore = useHistoryStore()

      if (historyStore.getGameByDate(puzzleDate)) {
        historyStore.viewResults(puzzleDate)
        return
      }

      this.archiveGame = {
        puzzleDate,
        guesses: [],
        listenCount: 0,
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

      const uiStore = useUiStore()
      uiStore.setView('game')
    },

    async loadActivePuzzleData() {
      const game = this.activeGame
      if (!game || game.loadingStatus === 'success') {
        return
      }

      game.loadingStatus = 'loading'

      try {
        const response = await withMinDelay(
          apiClient(
            PublicPuzzleDataSchema,
            NUXT_API_ROUTES.PUZZLE(game.puzzleDate),
          ),
          200,
        )

        if (this.activeGame) {
          this.activeGame.audioUrl = response.audioUrl
          this.activeGame.hint = response.hint
          this.activeGame.loadingStatus = 'success'
          this.activeGame.difficulty = response.difficulty
          this.activeGame.puzzleNumber = response.puzzleNumber
        }
      }
      catch (error) {
        console.error('Failed to load puzzle data:', error)
        if (this.activeGame) {
          await delay(500)
          this.activeGame.loadingStatus = 'error'
        }
      }
    },

    addGuess(GuessResult: GuessResult) {
      const game = this.activeGame
      if (!game || this.isGameDisabled)
        return

      game.guesses.push(GuessResult)
      this.updateResult()

      const statsStore = useStatsStore()
      const historyStore = useHistoryStore()

      notifyTabsOfUpdate({
        dailyGame: this.dailyGame,
        archiveGame: this.archiveGame,
        calendar: historyStore.calendar,
        streakData: statsStore.streakData,
      })
    },

    incrementListenCount() {
      const game = this.activeGame
      if (!game || this.isGameDisabled)
        return
      game.listenCount++
    },

    setFinalAnswer(answer: string) {
      if (this.activeGame) {
        this.activeGame.answer = answer
      }
    },

    updateResult() {
      const game = this.activeGame
      if (!game)
        return

      const hasWon = game.guesses.some(g => g.correct)
      if (hasWon) {
        game.result = 'win'
        return
      }

      if (game.guesses.length >= MAX_GUESSES) {
        game.result = 'loss'
      }
    },

    async submitPuzzleResult() {
      const game = this.activeGame

      if (!game || !game.completionTime)
        return

      const userStore = useUserStore()

      const MAX_TIME_MS = 600000 // 10 min cap to avoid skewed stats

      const payload: SubmitResultRequest = {
        puzzleDate: game.puzzleDate,
        won: game.result === 'win',
        guessCount: game.guesses.length,
        listenCount: game.listenCount,
        time: Math.min(game.completionTime, MAX_TIME_MS),
        anonymousId: userStore.anonymousId,
      }

      console.log('submitPuzzleResult in store', payload)

      // Result submission should not block the player from seeing results.
      $fetch(NUXT_API_ROUTES.SUBMIT_RESULTS, {
        method: 'POST',
        body: payload,
      }).catch(err => console.error('Failed to submit result:', err))
    },

    setElapsedTime(time: number) {
      if (!this.archiveGame) {
        this.dailyGame.elapsedTime = time
      }
    },

    setCompletionTime(time: number) {
      const game = this.activeGame
      if (game) {
        game.completionTime = time
      }
    },

    finalizeGameResult() {
      const game = this.activeGame
      if (!game)
        return

      const historyStore = useHistoryStore()
      const statsStore = useStatsStore()
      historyStore.saveGameToHistory(game)
      if (game.puzzleDate === getTodayString()) {
        statsStore.updateStreak()
      }
      historyStore.viewResults(game.puzzleDate)
    },

    startDailyGame() {
      this.initializeDailyGame()

      // Keep the game view mounted in its loading state after a retry.
      if (this.dailyGame.loadingStatus === 'error') {
        this.dailyGame.loadingStatus = 'loading'
      }

      this.archiveGame = null
      const uiStore = useUiStore()
      uiStore.setView('game')
    },

    async hydrateState() {
      const state = await getHydratedState<any>('game')
      if (state) {
        this.$patch(state)
      }
    },
  },

  persist: {
    storage: import.meta.client ? persistentStorage : undefined,
    paths: ['dailyGame'],
  } as any,
})
