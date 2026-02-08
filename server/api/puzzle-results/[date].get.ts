import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { DateParamSchema } from '~/schemas/common/date.schema'
import { GlobalResultsResponseSchema } from '~/schemas/results/global-results.schema'

/**
 * Retrieves the aggregated global statistics for a specific puzzle date.
 * This includes total plays, win rate, average time, and guess distribution.
 *
 * @method GET
 * @path /api/puzzle-results/:date
 *
 * @param {string} date - The puzzle date in YYYY-MM-DD format.
 *
 * @returns {GlobalResultsResponse} The aggregated community stats for the puzzle.
 * @throws {400} If the date parameter is in an invalid format.
 * @throws {502} If the backend service returns a malformed response.
 */
export default defineEventHandler(async (event) => {
  // 1. Validate Input
  const date = event.context.params?.date
  const dateValidation = DateParamSchema.safeParse(date)
  if (!dateValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid date parameter (YYYY-MM-DD) is required.',
    })
  }

  // 2. Fetch
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.GLOBAL_RESULTS(dateValidation.data),
  )

  // 3. Validate Output
  const responseValidation = GlobalResultsResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for global results:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
