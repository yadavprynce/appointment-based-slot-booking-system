import {z} from "zod"

export const getAvailableSlotsSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})