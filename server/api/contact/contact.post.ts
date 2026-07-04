import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { ContactRequestSchema, ContactResponseSchema } from '~/schemas/contact/contact.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validation = ContactRequestSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid form data provided.',
    })
  }

  // Pretend success for bot submissions so the contact endpoint stays quiet.
  if (body.honeypot) {
    console.warn('Honeypot field filled on server. Likely a bot.')
    return { success: true }
  }

  const apiResponse = await fetchBackend(event, FASTIFY_API_ROUTES.CONTACT, { method: 'POST', body: validation.data })
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
