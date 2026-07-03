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
    /**
     * Returns the state of the puzzle currently in play.
     * Prioritizes an archive session if one is active, otherwise defaults to the daily game.
     */
    activeGame(state): GameInstance | null {
      // if an archive game has been loaded, it's the active one
      if (state.archiveGame) {
        return state.archiveGame
      }
      // otherwise, the daily game is the active one
      return state.dailyGame
    },

    /**
     * Global flag to prevent user input. Returns true if the max guess
     * limit is reached or if the game has already concluded.
     */
    isGameDisabled(): boolean {
      const game = this.activeGame
      if (!game)
        return true
      return game.guesses.length >= MAX_GUESSES || game.result !== 'pending'
    },
  },

  actions: {
    /**
     * Resets the daily game state if the player's local system date
     * has changed since the last session.
     */
    initializeDailyGame() {
      const todayString = getTodayString()

      // if the persisted date is not today, reset the daily game completely
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

    /**
     * Initializes a temporary session for a past puzzle.
     * Redirects to the results view if the puzzle has already been completed.
     */
    startArchiveGame(puzzleDate: string) {
      if (puzzleDate === this.dailyGame.puzzleDate) {
        this.startDailyGame()
        return
      }

      const historyStore = useHistoryStore()

      // Use historyStore to check the calendar and navigate
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

    /**
     * Fetches puzzle metadata and audio assets from the API.
     * Includes a forced minimum delay to prevent UI flickering on fast connections.
     */
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

    /**
     * Records a new guess attempt, triggers a result re-calculation,
     * and notifies other open tabs to synchronize their state.
     */
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

    /**
     * Track how many times the user played the audio clip.
     */
    incrementListenCount() {
      const game = this.activeGame
      if (!game || this.isGameDisabled)
        return
      game.listenCount++
    },

    /**
     * Stores the correct solution for the active puzzle. This is typically
     * called after a game concludes to allow for answer reveal logic.
     */
    setFinalAnswer(answer: string) {
      if (this.activeGame) {
        this.activeGame.answer = answer
      }
    },

    /**
     * Internal logic to evaluate the current guess list and
     * determine if the game state is a win, loss, or still pending.
     */
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

    /**
     * Submits the final game result to the backend.
     *
     * This is a "fire and forget" operation. It also handles creating an anonymous
     * user record in the database if one doesn't already exist for this device.
     */
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

      // Fire and forget - no response validation needed
      $fetch(NUXT_API_ROUTES.SUBMIT_RESULTS, {
        method: 'POST',
        body: payload,
      }).catch(err => console.error('Failed to submit result:', err))
    },

    /**
     * Persists the current duration of the active daily game session.
     * Archive games do not track elapsed time.
     */
    setElapsedTime(time: number) {
      if (!this.archiveGame) {
        this.dailyGame.elapsedTime = time
      }
    },

    /**
     * Records the final clock time for a finished puzzle. This value
     * is used for backend result submission and user stats.
     */
    setCompletionTime(time: number) {
      const game = this.activeGame
      if (game) {
        game.completionTime = time
      }
    },

    /**
     * The primary transition action. Commits the current game to
     * permanent history, updates player streaks, and moves to the results view.
     */
    finalizeGameResult() {
      const game = this.activeGame
      if (!game)
        return

      const historyStore = useHistoryStore()
      const statsStore = useStatsStore()

      // 1. Save to permanent record
      historyStore.saveGameToHistory(game)

      // 2. Update streak only if it's today's puzzle
      if (game.puzzleDate === getTodayString()) {
        statsStore.updateStreak()
      }

      // 3. Show the results screen
      historyStore.viewResults(game.puzzleDate)
    },

    /**
     * Clears archive context and initializes the standard daily puzzle session.
     */
    startDailyGame() {
      this.initializeDailyGame()

      // Reset status synchronously so the component mounts in a loading state
      if (this.dailyGame.loadingStatus === 'error') {
        this.dailyGame.loadingStatus = 'loading'
      }

      this.archiveGame = null
      const uiStore = useUiStore()
      uiStore.setView('game')
    },

    /**
     * Manually restores the store from asynchronous storage.
     * Used to bypass timing issues between the persistence plugin and the Nuxt lifecycle.
     */
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
