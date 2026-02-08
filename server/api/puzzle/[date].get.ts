import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { DateParamSchema } from '~/schemas/common/date.schema'
import { PublicPuzzleDataSchema } from '~/schemas/game/puzzle.schema'

/**
 * Fetches the public metadata for a specific puzzle.
 * This includes the audio URL, hint, difficulty, and puzzle number.
 * It validates the date format, fetches from the backend, and validates the response.
 *
 * @method GET
 * @path /api/puzzle/:date
 *
 * @param {string} date - The puzzle date in YYYY-MM-DD format.
 *
 * @returns {PublicPuzzleData} The puzzle's public data.
 * @throws {400} If the date parameter is in an invalid format.
 * @throws {404} If no puzzle is found for the given date (propagated from backend).
 * @throws {502} If the backend service returns a malformed response.
 */
export default defineEventHandler(async (event) => {
  const date = event.context.params?.date

  // 1. Validate Input
  const dateValidation = DateParamSchema.safeParse(date)
  if (!dateValidation.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Date' })
  }

  // 2. Fetch
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.PUZZLE(dateValidation.data),
  )

  // 3. Validate Output
  const responseValidation = PublicPuzzleDataSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    throw createError({ statusCode: 502, statusMessage: 'Invalid Upstream Response' })
  }

  return responseValidation.data
})
