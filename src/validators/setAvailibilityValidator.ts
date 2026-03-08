import {z} from 'zod'

export const setAvalibilityValidator = z.object({
    dayOfweek: z.number().int().min(0).max(6),
    startTime : z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/ , {
        message : "Time must be in HH:MM format (24 hour)"
    }) ,
    endTime : z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/ , {
        message : "Time must be in HH:MM format (24 hour)"
    })

})
