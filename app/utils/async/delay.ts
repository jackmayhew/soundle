/**
 * A simple promise-based delay. Useful for ensuring a minimum display time
 * for loading states, preventing UI flickers on fast connections.
 *
 * @param ms - The number of milliseconds to wait.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
