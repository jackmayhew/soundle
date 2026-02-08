import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { GuessRequestSchema, GuessResultSchema } from '~/schemas/game/guess.schema'

/**
 * Validates a user's guess against the puzzle's solution.
 * It receives the puzzle date and the user's guess, proxies them to the backend
 * for validation, and returns the result (e.g., correct, hint code).
 *
 * @method POST
 * @path /api/user-guess/guess
 *
 * @body {GuessRequest} The user's guess and the puzzle date.
 *
 * @returns {GuessResult} The result of the guess, including a hint code.
 * @throws {400} If the request body fails validation.
 * @throws {502} If the backend service returns a malformed response.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. Validate Input
  const validation = GuessRequestSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input data.',
    })
  }

  // 2. Fetch
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.GUESS,
    {
      method: 'POST',
      body: validation.data,
    },
  )

  // 3. Validate Output
  const responseValidation = GuessResultSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for guess:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
