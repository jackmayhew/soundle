import type { H3Event } from 'h3'

export async function fetchBackend<T>(event: H3Event, url: string, options: any = {}): Promise<T> {
  const config = useRuntimeConfig()
  const targetUrl = `${config.apiBaseUrl}${url}`

  try {
    const response = await $fetch.raw(targetUrl, {
      ...options,
      headers: {
        ...options.headers,
        'X-Forwarded-For': getRequestIP(event) || '',
      },
    })

    const cacheControl = response.headers.get('cache-control')
    if (cacheControl) {
      setResponseHeader(event, 'Cache-Control', cacheControl)
    }

    return response._data as T
  }
  catch (error: any) {
    const retryAfter = error.response?.headers?.get('retry-after')
    if (retryAfter) {
      // Preserve backend cooldowns so the client can show the right retry timer.
      setResponseHeader(event, 'Retry-After', retryAfter)
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message,
      data: error.data,
    })
  }
}
