import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGameStore } from '~/stores/game/index'
import { useStatsStore } from '~/stores/stats/user-stats'

const MOCKED_TODAY = '2025-11-15'
const MOCKED_YESTERDAY = '2025-11-14'
const MOCKED_TWO_DAYS_AGO = '2025-11-13'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.useFakeTimers()
  vi.setSystemTime(new Date(`${MOCKED_TODAY}T10:00:00Z`))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('statsStore.updateStreak', () => {
  it('should initialize streak on first game win', () => {
    const gameStore = useGameStore()
    const statsStore = useStatsStore()

    gameStore.dailyGame.puzzleDate = MOCKED_TODAY
    gameStore.dailyGame.result = 'win'

    statsStore.updateStreak()

    expect(statsStore.streakData.currentStreak).toBe(1)
    expect(statsStore.streakData.longestStreak).toBe(1)
    expect(statsStore.streakData.lastPlayedDate).toBe(MOCKED_TODAY)
  })

  it('should not update streak when playing same day twice', () => {
    const gameStore = useGameStore()
    const statsStore = useStatsStore()

    statsStore.streakData = {
      currentStreak: 1,
      longestStreak: 1,
      lastPlayedDate: MOCKED_TODAY,
    }

    gameStore.dailyGame.puzzleDate = MOCKED_TODAY
    gameStore.dailyGame.result = 'win'

    statsStore.updateStreak()

    expect(statsStore.streakData.currentStreak).toBe(1)
  })

  it('should increment streak when playing consecutive days', () => {
    const gameStore = useGameStore()
    const statsStore = useStatsStore()

    statsStore.streakData = {
      currentStreak: 1,
      longestStreak: 1,
      lastPlayedDate: MOCKED_YESTERDAY,
    }

    gameStore.dailyGame.puzzleDate = MOCKED_TODAY
    gameStore.dailyGame.result = 'win'

    statsStore.updateStreak()

    expect(statsStore.streakData.currentStreak).toBe(2)
    expect(statsStore.streakData.longestStreak).toBe(2)
  })

  it('should reset streak to 1 when winning after missing a day', () => {
    const gameStore = useGameStore()
    const statsStore = useStatsStore()

    statsStore.streakData = {
      currentStreak: 5,
      longestStreak: 5,
      lastPlayedDate: MOCKED_TWO_DAYS_AGO,
    }

    gameStore.dailyGame.puzzleDate = MOCKED_TODAY
    gameStore.dailyGame.result = 'win'

    statsStore.updateStreak()

    expect(statsStore.streakData.currentStreak).toBe(1)
    expect(statsStore.streakData.longestStreak).toBe(5)
  })

  it('should reset streak to 0 on loss', () => {
    const gameStore = useGameStore()
    const statsStore = useStatsStore()

    statsStore.streakData = {
      currentStreak: 5,
      longestStreak: 5,
      lastPlayedDate: MOCKED_YESTERDAY,
    }

    gameStore.dailyGame.puzzleDate = MOCKED_TODAY
    gameStore.dailyGame.result = 'loss'

    statsStore.updateStreak()

    expect(statsStore.streakData.currentStreak).toBe(0)
    expect(statsStore.streakData.lastPlayedDate).toBe(MOCKED_TODAY)
  })
})

describe('statsStore.checkStreakOnAppLoad', () => {
  it('should RESET streak to 0 if a day was missed', () => {
    const statsStore = useStatsStore()

    statsStore.streakData = {
      currentStreak: 5,
      longestStreak: 5,
      lastPlayedDate: MOCKED_TWO_DAYS_AGO,
    }

    statsStore.checkStreakOnAppLoad()

    expect(statsStore.streakData.currentStreak).toBe(0)
  })

  it('should NOT change streak if last played was yesterday', () => {
    const statsStore = useStatsStore()

    statsStore.streakData = {
      currentStreak: 5,
      longestStreak: 5,
      lastPlayedDate: MOCKED_YESTERDAY,
    }

    statsStore.checkStreakOnAppLoad()

    expect(statsStore.streakData.currentStreak).toBe(5)
  })

  it('should NOT change streak if last played was today', () => {
    const statsStore = useStatsStore()

    statsStore.streakData = {
      currentStreak: 5,
      longestStreak: 5,
      lastPlayedDate: MOCKED_TODAY,
    }

    statsStore.checkStreakOnAppLoad()

    expect(statsStore.streakData.currentStreak).toBe(5)
  })
})
