import type { z } from 'zod'
import { useNuxtApp } from '#app'
import { DEFAULT_RATE_LIMIT_RETRY_SECONDS, SERVICE_UNAVAILABLE_RETRY_SECONDS } from '~/constants/api'

type ApiClientOptions = Parameters<typeof $fetch>[1]

/**
 * Strongly-typed API client wrapper around Nuxt's `$fetch`.
 * It provides Zod schema validation for responses, centralized error handling,
 * and automatic management of rate limiting and service unavailable states.
 *
 * @param schema The Zod schema to validate the API response against.
 * @param url The API endpoint to fetch.
 * @param options Standard options for `$fetch` (method, body, etc.).
 * @returns A promise that resolves with the validated API response.
 * @throws If the fetch fails, the network request is aborted, or the response
 *         fails Zod validation, the error is re-thrown after being logged.
 */
export async function apiClient<T>(
  schema: z.Schema<T>,
  url: string,
  options?: ApiClientOptions,
): Promise<T> {
  const uiStore = useUiStore()

  try {
    const finalOptions = { ...options, retry: 0 }
    const unknownResponse = await $fetch(url, finalOptions)
    const parsedResponse = schema.parse(unknownResponse)
    return parsedResponse
  }
  catch (error: any) {
    const { $posthog } = useNuxtApp()

    // Log to PostHog
    if ($posthog) {
      $posthog.capture('$exception', {
        $exception_type: 'NetworkError',
        $exception_message: error.message || 'API Request Failed',
        $current_url: url,
        status: error.response?.status || error.statusCode,
      })
    }
    console.log('[apiClient] Caught error:', error)

    const status = error.response?.status || error.statusCode

    if (status) {
      if (status === 429) {
        console.warn(`[apiClient] Rate limit hit for ${url}.`)
        const retryAfterSeconds = Number(error.response?.headers?.get('retry-after')) || DEFAULT_RATE_LIMIT_RETRY_SECONDS
        uiStore.setRateLimited(Date.now() + (retryAfterSeconds * 1000))
        uiStore.showModal('rateLimit')
      }
      else if (status === 503) {
        console.warn(`[apiClient] Service unavailable for ${url}.`)
        uiStore.setServiceUnavailable(Date.now() + (SERVICE_UNAVAILABLE_RETRY_SECONDS * 1000))
        uiStore.showModal('serviceUnavailable')
      }
    }
    console.error(`[apiClient] Error fetching or parsing ${url}:`, error)
    throw error
  }
}
