export function useTrackException() {
  const { $posthog } = useNuxtApp()
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
