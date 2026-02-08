import { z } from 'zod'

export const UserIdParamsSchema = z.object({
  userId: z.uuid({ message: 'Invalid user ID format.' }),
})

export type UserIdParams = z.infer<typeof UserIdParamsSchema>
