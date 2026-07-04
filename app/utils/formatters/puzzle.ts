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
