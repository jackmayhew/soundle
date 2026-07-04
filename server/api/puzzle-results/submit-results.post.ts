import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { SubmitResultRequestSchema } from '~/schemas/results/submit-result.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validation = SubmitResultRequestSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid result data.',
    })
  }

  // Results are non-critical, so a backend failure should not block the UI.
  try {
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
    console.error('Failed to submit result to backend:', error)
  }

  return { success: true }
})
