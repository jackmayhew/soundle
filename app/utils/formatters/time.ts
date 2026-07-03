/**
 * Formats a duration in milliseconds into a standard MM:SS or HH:MM:SS string.
 * @param ms The duration in milliseconds.
 */
export function formatPuzzleTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Formats seconds into a human-readable duration (e.g., "1m 32s", "1m", or "32s")
 * Used for rate limits or friendly UI messages.
 */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (minutes > 0)
    parts.push(`${minutes}m`)
  if (seconds > 0 || minutes === 0)
    parts.push(`${seconds}s`)

  return parts.join(' ')
}
