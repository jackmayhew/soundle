/**
 * Formats a YYYY-MM-DD string into a human-readable format (e.g., "Jan 1, 2025").
 * Gracefully handles invalid or undefined date strings.
 * @param dateString The date string to format.
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString)
    return 'Unknown date'
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime()))
    return 'Unknown date'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
