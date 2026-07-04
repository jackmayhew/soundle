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
