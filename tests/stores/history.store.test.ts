import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useHistoryStore } from '~/stores/game/history'

vi.mock('~/composables/browser/use-tab-sync', () => ({
  notifyTabsOfUpdate: vi.fn(),
}))

vi.mock('~/composables/game/use-archive-dates', () => ({
  useArchiveDates: () => ['2025-02-01', '2025-01-02', '2025-01-01'],
}))

describe('history store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('saves a game to the correct year and date key', () => {
    const store = useHistoryStore()
    const mockGame = { puzzleDate: '2025-05-20', result: 'win' } as any

    store.saveGameToHistory(mockGame)

    expect(store.calendar['2025']).toBeDefined()
    expect(store.calendar['2025']?.['2025-05-20']?.result).toBe('win')
  })

  it('deletes a specific game and leaves others intact', () => {
    const store = useHistoryStore()
    store.calendar = {
      2025: {
        '2025-01-01': { result: 'win' } as any,
        '2025-01-02': { result: 'loss' } as any,
      },
    }

    store.deleteGameFromHistory('2025-01-01')

    expect(store.calendar['2025']?.['2025-01-01']).toBeUndefined()
    expect(store.calendar['2025']?.['2025-01-02']).toBeDefined()
  })

  it('archiveByMonth should be stable and not mutate on multiple calls', () => {
    const store = useHistoryStore()

    // Call it multiple times to ensure no internal mutation
    const firstCall = { ...store.archiveByMonth }
    const secondCall = { ...store.archiveByMonth }

    expect(firstCall).toEqual(secondCall)
    // Check descending month order (February should be first)
    const months = Object.keys(store.archiveByMonth)
    expect(months[0]).toContain('February')
    expect(months[1]).toContain('January')
  })
})
