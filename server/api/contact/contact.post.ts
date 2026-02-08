import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { ContactRequestSchema, ContactResponseSchema } from '~/schemas/contact/contact.schema'

/**
 * Handles contact form submissions.
 * It validates the incoming form data, performs a honeypot check to block bots,
 * and then proxies the request to the backend email service.
 *
 * @method POST
 * @path /api/contact/contact
 *
 * @body {ContactRequest} The contact form data (email, message).
 *
 * @returns {object} A success object: `{ success: true }`.
 * @throws {400} If the request body fails validation.
 * @throws {502} If the backend service returns an invalid response.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. Validate Input
  const validation = ContactRequestSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid form data provided.',
    })
  }

  // 2. Check honeypot here to save a backend trip
  if (body.honeypot) {
    console.warn('Honeypot field filled on server. Likely a bot.')
    return { success: true }
  }

  const apiResponse = await fetchBackend(event, FASTIFY_API_ROUTES.CONTACT, { method: 'POST', body: validation.data })

  // 3. Validate Output
  const responseValidation = ContactResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
