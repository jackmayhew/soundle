/**
 * Centralized constants for URL query parameters.
 * Defines the keys used for query parameters throughout the application.
 */

export const URL_QUERY_PARAMS = {
  /** Key for the shared puzzle date parameter (e.g., `?puzzleDate=2025-10-27`). */
  PUZZLE_DATE: 'puzzleDate',

  /** Key for the legal view parameter being used (e.g., `?legal=privacy`). */
  LEGAL_VIEW: 'legal',

  /** Key for the user-specific unsubscribe ID (e.g., `?unsubscribeId=...`). */
  UNSUBSCRIBE_ID: 'unsubscribeId',
} as const
