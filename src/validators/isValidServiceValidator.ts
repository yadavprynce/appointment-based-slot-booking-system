import {z} from "zod"

export const isValidServiceSchema = z.object({
    type: z.enum(["MEDICAL", "HOUSE_HELP", "BEAUTY", "FITNESS", "EDUCATION", "OTHER"])
})