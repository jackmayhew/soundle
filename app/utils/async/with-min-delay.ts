import { delay } from '~/utils/async/delay'

/**
 * Wraps a promise to ensure it takes a minimum amount of time to resolve or reject.
 * This is useful for preventing UI loading flickers on fast API calls or errors.
 * It runs the promise and the delay concurrently. If the promise rejects,
 * this function will re-throw the error after the minimum delay has passed.
 *
 * @param promise The promise to execute.
 * @param ms The minimum duration in milliseconds.
 * @returns A promise that resolves with the value of the original promise.
 */
export async function withMinDelay<T>(promise: Promise<T>, ms: number): Promise<T> {
  const [apiResult] = await Promise.allSettled([promise, delay(ms)])

  if (apiResult.status === 'rejected') {
    throw apiResult.reason
  }

  return apiResult.value
}
