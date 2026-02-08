import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGameStore } from '~/stores/game/index'

describe('game store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    // Set a fixed time (noon UTC) to avoid date-flipping issues
    vi.setSystemTime(new Date('2026-01-09T12:00:00Z'))
  })

  it('initializes with correct default state', () => {
    const store = useGameStore()
    expect(store.dailyGame.result).toBe('pending')
    expect(store.dailyGame.guesses).toEqual([])
  })

  it('should reset daily game when date changes', () => {
    const store = useGameStore()
    const todayString = new Date().toISOString().split('T')[0]

    // Set up old game state
    store.dailyGame.puzzleDate = '2024-01-01'
    store.dailyGame.guesses = [{ text: 'test', correct: false, hint: null }]

    store.initializeDailyGame()

    expect(store.dailyGame.guesses).toEqual([])
    expect(store.dailyGame.result).toBe('pending')
    expect(store.dailyGame.puzzleDate).toBe(todayString)
  })

  it('should mark game as won when correct guess added', () => {
    const store = useGameStore()
    store.addGuess({ text: 'correct answer', correct: true, hint: null })
    expect(store.dailyGame.result).toBe('win')
  })

  it('should mark game as lost after max guesses', () => {
    const store = useGameStore()
    for (let i = 0; i < 6; i++) {
      store.addGuess({ text: 'wrong', correct: false, hint: null })
    }
    expect(store.dailyGame.result).toBe('loss')
    expect(store.dailyGame.guesses.length).toBe(6)
  })

  it('isGameDisabled should be true if game is won or lost', () => {
    const store = useGameStore()

    store.addGuess({ text: 'win', correct: true, hint: null })
    expect(store.isGameDisabled).toBe(true)

    store.dailyGame.result = 'pending'
    store.dailyGame.guesses = Array.from({ length: 6 }, () => ({ text: 'fail', correct: false, hint: null }))
    store.updateResult()
    expect(store.isGameDisabled).toBe(true)
  })
})
