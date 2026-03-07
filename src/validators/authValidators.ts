import {z} from "zod"

const authSchema = z.object ({
    name : z.string(),
    email: z.string().email(),
    password:z.string(),
    role: z.enum(["USER" , "SERVICE_PROVIDER"]).optional()
})

export default authSchema