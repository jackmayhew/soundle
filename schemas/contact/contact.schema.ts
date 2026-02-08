import { z } from 'zod'

export const ContactRequestSchema = z.object({
  email: z.email({ message: 'Valid email is required.' }),
  message: z.string()
    .min(10, { message: 'Message must be at least 10 characters.' })
    .max(1000, { message: 'Message cannot exceed 1000 characters.' }),
  honeypot: z.string().max(0, { message: 'Honeypot must be empty.' }).optional(),
})

export const ContactResponseSchema = z.object({
  success: z.boolean(),
})

export type ContactRequest = z.infer<typeof ContactRequestSchema>
