import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useUserStore } from '~/stores/user'

vi.mock('uuid', () => ({
  v4: () => 'mocked-uuid-1234',
}))

describe('user store', () => {
  // PostHog object that we can spy on
  const mockPosthog = { identify: vi.fn() }

  beforeEach(() => {
    setActivePinia(createPinia())
    mockPosthog.identify.mockClear()

    vi.stubGlobal('useNuxtApp', () => ({
      $posthog: mockPosthog,
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('generates a new anonymousId if one does not exist', () => {
    const store = useUserStore()
    store.initializeAnonymousId()

    expect(store.anonymousId).toBe('mocked-uuid-1234')
    expect(mockPosthog.identify).toHaveBeenCalledWith('mocked-uuid-1234')
  })

  it('does NOT generate a new ID if one already exists in the state', () => {
    const store = useUserStore()
    store.anonymousId = 'existing-uuid-5678'
    store.initializeAnonymousId()

    expect(store.anonymousId).toBe('existing-uuid-5678')
    expect(mockPosthog.identify).toHaveBeenCalledWith('existing-uuid-5678')
  })
})
