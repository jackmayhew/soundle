import { delay } from '~/utils/async/delay'

export async function withMinDelay<T>(promise: Promise<T>, ms: number): Promise<T> {
  const [apiResult] = await Promise.allSettled([promise, delay(ms)])

  if (apiResult.status === 'rejected') {
    throw apiResult.reason
  }

  return apiResult.value
}
