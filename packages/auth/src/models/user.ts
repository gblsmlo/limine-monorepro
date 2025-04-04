import { roleSchema } from '@/roles'
import { z } from 'zod'

const userSchema = z.object({
	id: z.string().uuid(),
	role: roleSchema,
})

export type User = z.infer<typeof userSchema>
