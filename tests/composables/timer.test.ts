import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useTimer } from '~/composables/game/use-timer'

describe('timer composable', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should start at 0 and format correctly', () => {
    const scope = effectScope()
    const { formattedTime } = scope.run(() => useTimer())!
    expect(formattedTime.value).toBe('00:00')
    scope.stop()
  })

  it('should start from initial elapsed time', () => {
    const scope = effectScope()
    const { formattedTime } = scope.run(() => useTimer({ initialElapsedTime: 65000 }))!
    expect(formattedTime.value).toBe('01:05')
    scope.stop()
  })

  it('should update elapsed time when running', () => {
    const scope = effectScope()
    const { formattedTime, start } = scope.run(() => useTimer())!
    start()
    vi.advanceTimersByTime(5000)
    expect(formattedTime.value).toBe('00:05')
    scope.stop()
  })

  it('should call onSave callback at intervals', () => {
    const scope = effectScope()
    const onSave = vi.fn()
    const { start } = scope.run(() => useTimer({ onSave, saveInterval: 1000 }))!
    start()
    vi.advanceTimersByTime(3000)
    expect(onSave).toHaveBeenCalledTimes(3)
    scope.stop()
  })

  it('should return final time when stopped', () => {
    const scope = effectScope()
    const { start, stop } = scope.run(() => useTimer())!
    start()
    vi.advanceTimersByTime(10000)
    const finalTime = stop()
    expect(finalTime).toBeGreaterThanOrEqual(10000)
    scope.stop()
  })

  it('should format hours correctly', () => {
    const scope = effectScope()
    const { formattedTime } = scope.run(() => useTimer({ initialElapsedTime: 3661000 }))!
    expect(formattedTime.value).toBe('1:01:01')
    scope.stop()
  })
})
