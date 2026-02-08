import type { H3Event } from 'h3'

/**
 * Utility to proxy requests from Nuxt server to backend.
 * It automatically forwards client IP and relevant response headers (Cache-Control, Retry-After),
 * and propagates structured errors from the backend.
 *
 * @param event The H3 event object from the server route.
 * @param url The backend API endpoint (e.g., '/puzzle/2025-01-01').
 * @param options Standard options for `$fetch` (method, body, etc.).
 * @returns A promise that resolves with the backend's response data.
 */
export async function fetchBackend<T>(event: H3Event, url: string, options: any = {}): Promise<T> {
  const config = useRuntimeConfig()
  const targetUrl = `${config.apiBaseUrl}${url}`

  try {
    // Get the full response object, including headers
    const response = await $fetch.raw(targetUrl, {
      ...options,
      headers: {
        ...options.headers,
        'X-Forwarded-For': getRequestIP(event) || '',
      },
    })

    // Manually forward the cache-control header
    const cacheControl = response.headers.get('cache-control')
    if (cacheControl) {
      setResponseHeader(event, 'Cache-Control', cacheControl)
    }

    // Return just the body data
    return response._data as T
  }
  catch (error: any) {
    // 1. AUTOMATICALLY FORWARD HEADERS
    // If Fastify sent 'Retry-After', pass it to the Nuxt client response
    const retryAfter = error.response?.headers?.get('retry-after')
    if (retryAfter) {
      setResponseHeader(event, 'Retry-After', retryAfter)
    }

    // 2. THROW CLEAN ERROR
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message,
      data: error.data, // Keep details (like Zod validation issues)
    })
  }
}
