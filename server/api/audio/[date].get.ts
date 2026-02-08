import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { DateParamSchema } from '~/schemas/common/date.schema'

/**
 * Proxies the audio stream for a specific puzzle date from the backend.
 * This endpoint is responsible for fetching the raw audio file.
 *
 * @method GET
 * @path /api/audio/:date
 *
 * @param {string} date - The puzzle date in YYYY-MM-DD format.
 *
 * @returns {ReadableStream} The raw audio data stream.
 * @throws {400} If the date parameter is in an invalid format.
 * @throws {404} If no puzzle is found for the given date (propagated from backend).
 */
export default defineEventHandler(async (event) => {
  const date = getRouterParam(event, 'date')

  // 1. Validate Input
  const validation = DateParamSchema.safeParse(date)
  if (!validation.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid date format' })
  }

  const config = useRuntimeConfig(event)
  const backendUrl = `${config.apiBaseUrl}${FASTIFY_API_ROUTES.SOUND(validation.data)}`

  // 2. Proxy Request
  return proxyRequest(event, backendUrl, {
    headers: {
      'X-Forwarded-For': getRequestIP(event) || '',
    },
  })
})
