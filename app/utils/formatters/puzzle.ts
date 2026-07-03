/**
 * Creates a standardized title string for a puzzle.
 * Can be configured to produce a short or long version.
 * @param number The puzzle number.
 * @param date The puzzle date string.
 * @param short If true, returns a compact title (e.g., "#12 • Jan 1, 2025").
 */
export function formatPuzzleTitle(
  number?: number | null,
  date?: string | null,
  short: boolean = false,
): string {
  const parts: string[] = []

  if (number)
    parts.push(short ? `#${number}` : `Puzzle #${number}`)

  if (date)
    parts.push(formatDate(date))

  return parts.join(' • ')
}
