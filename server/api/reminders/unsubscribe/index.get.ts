import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { UnsubscribeQuerySchema, UnsubscribeResponseSchema } from '~/schemas/reminders/unsubscribe.schema'

/**
 * Processes a one-click unsubscribe request from an email link.
 * It validates the unsubscribe ID from the query parameter and proxies the
 * request to the backend to deactivate the subscription.
 *
 * @method GET
 * @path /api/reminders/unsubscribe
 *
 * @query {string} id - The unique unsubscribe ID.
 *
 * @returns {object} A success object: `{ success: true }`.
 * @throws {400} If the `id` query parameter is missing or invalid.
 * @throws {502} If the backend service returns a malformed response.
 */
export default defineEventHandler(async (event) => {
  // 1. Validate Input
  const query = getQuery(event)
  const validation = UnsubscribeQuerySchema.safeParse(query)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input data.',
    })
  }

  // 2. Fetch
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.UNSUBSCRIBE,
    {
      method: 'GET',
      query: validation.data,
    },
  )

  // 3. Validate Output
  const responseValidation = UnsubscribeResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for unsubscribe:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
