export function useTrackException() {
  const { $posthog } = useNuxtApp()
  /**
   * Tracks an exception in PostHog.
   * Normalizes the error and sends it with a consistent event structure.
   * @param type A category or name for the exception (e.g., 'API_ERROR', 'UI_CRASH').
   * @param error The raw error object or string.
   * @param properties Additional custom properties to include with the event.
   */
  function trackException(
    type: string,
    error: any,
    properties: Record<string, any> = {},
  ) {
    if (!$posthog)
      return

    const err = error instanceof Error ? error : new Error(String(error))

    $posthog.capture('$exception', {
      $exception_type: type,
      $exception_message: err.message,
      $exception_stack: err.stack,
      ...properties,
    })
  }

  return { trackException }
}
