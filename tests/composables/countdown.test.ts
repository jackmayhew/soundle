import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, effectScope, ref } from 'vue'
import { useCountdown } from '~/composables/ui/use-countdown'

describe('useCountdown composable', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Mock Date.now to a fixed point
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should initialize with 0 if no timestamp provided', () => {
    const scope = effectScope()
    const target = computed(() => undefined)
    const { remainingSeconds } = scope.run(() => useCountdown(target))!

    expect(remainingSeconds.value).toBe(0)
    scope.stop()
  })

  it('should calculate correct initial remaining seconds', () => {
    const scope = effectScope()
    // 30 seconds into the future
    const target = computed(() => Date.now() + 30000)
    const { remainingSeconds } = scope.run(() => useCountdown(target))!

    expect(remainingSeconds.value).toBe(30)
    scope.stop()
  })

  it('should decrement every second', () => {
    const scope = effectScope()
    const target = computed(() => Date.now() + 10000)
    const { remainingSeconds } = scope.run(() => useCountdown(target))!

    expect(remainingSeconds.value).toBe(10)

    vi.advanceTimersByTime(2000)
    expect(remainingSeconds.value).toBe(8)

    scope.stop()
  })

  it('should trigger onFinished and stop at zero', () => {
    const scope = effectScope()
    const onFinished = vi.fn()
    const target = computed(() => Date.now() + 2000)

    const { remainingSeconds } = scope.run(() => useCountdown(target, onFinished))!

    vi.advanceTimersByTime(2000)

    expect(remainingSeconds.value).toBe(0)
    expect(onFinished).toHaveBeenCalledTimes(1)

    // Ensure it doesn't go negative
    vi.advanceTimersByTime(1000)
    expect(remainingSeconds.value).toBe(0)

    scope.stop()
  })

  it('should react to timestamp changes', async () => {
    const scope = effectScope()
    const timestamp = ref<number | undefined>(Date.now() + 10000)
    const target = computed(() => timestamp.value)

    const { remainingSeconds } = scope.run(() => useCountdown(target))!
    expect(remainingSeconds.value).toBe(10)

    // Update timestamp to 60s in future
    timestamp.value = Date.now() + 60000
    // Wait for watcher/reactivity
    await Promise.resolve()

    expect(remainingSeconds.value).toBe(60)
    scope.stop()
  })
})
