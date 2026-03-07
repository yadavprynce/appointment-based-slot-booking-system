import jwt from "jsonwebtoken"
import "dotenv/config"
import type { Response } from "express"

export interface MyJwtPayload {
    userId:string ,
    role: "USER" |"SERVICE_PROVIDER",
    providerId?:string | undefined //allowing undefined this time
}
export const generateToken = (jwtPayload:MyJwtPayload ,  res: Response) => {
    const payload = jwtPayload
    const token = jwt.sign(payload , process.env.JWT_SECRET! , {
        expiresIn: "2h"
    })
    res.cookie("jwt" , token , {
         httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 120 * 60 * 1000 
    })
    return token 
}