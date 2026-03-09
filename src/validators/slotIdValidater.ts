import {z} from "zod";

export const slotIdSchema = z.object({
    slotId:z.string().regex(/^.+_\d{4}-\d{2}-\d{2}_\d{2}:\d{2}$/)
})