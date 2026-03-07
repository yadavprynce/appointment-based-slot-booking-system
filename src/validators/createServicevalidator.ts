import { z } from "zod"

export const createServiceSchema = z.object({
    name: z.string(),
    type: z.enum(["MEDICAL", "HOUSE_HELP", "BEAUTY", "FITNESS", "EDUCATION", "OTHER"]),
    durationMinutes: z.number().min(30, { message: "Time durration must be atleast 30 mins" })
        .max(120, { message: "Time duration can't be more than 120 mins" })
        .refine((val) => val % 30 == 0, {
            message: "Duration must be the multiple of 30 mins"
        })

})
