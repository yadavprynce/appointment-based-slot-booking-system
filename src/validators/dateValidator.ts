import {regex, z} from "zod"

export const dateSchema = z.object({
    date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})