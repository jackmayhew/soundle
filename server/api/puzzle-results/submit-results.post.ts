import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { SubmitResultRequestSchema } from '~/schemas/results/submit-result.schema'

/**
 * Receives a player's game result and proxies it to the backend.
 * This is a "fire-and-forget" endpoint from the client's perspective; it will
 * always return a success response to the client even if the backend proxy fails,
 * preventing UI errors for a non-critical operation.
 *
 * @method POST
 * @path /api/puzzle-results/submit-results
 *
 * @body {SubmitResultRequest} The player's game result data.
 *
 * @returns {object} A success object: `{ success: true }`.
 * @throws {400} If the request body fails validation.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. Validate Input
  const validation = SubmitResultRequestSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid result data.',
    })
  }

  try {
    // 2. Fetch
    await fetchBackend(
      event,
      FASTIFY_API_ROUTES.SUBMIT_RESULTS,
      {
        method: 'POST',
        body: validation.data,
      },
    )
  }
  catch (error) {
    // 3. Fail silently
    console.error('Failed to submit result to backend:', error)
  }

  return { success: true }
})
