import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import authSchema from "../validators/authValidator.js"
import { prisma } from "../config/db.js";
import { type MyJwtPayload, generateToken } from "../utils/generateToken.js";





const register = async (req: Request, res: Response) => {
    const parsedData = authSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid Format" })
    }

    const { name, email, password, role } = parsedData.data;

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
        return res.status(409).json("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword             
            }
        })

        res.status(201).json(`User created Successfully with id ${newUser.id}`)

    } catch (error) {
        return res.status(500).json("Internal server error")

    }

}

const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (!userExists) {
        return res.json("Email not registerd with us")

    }

    const passwordMatch = bcrypt.compare(password, userExists.passwordHash)

    if (!passwordMatch) {
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }


    const payload: MyJwtPayload = {
        userId: userExists.id,
        role: userExists.role,
        providerId: userExists.role === "SERVICE_PROVIDER" ? userExists.id : undefined
    }

    /*ideally you shouldn't make it undefined unintentionally
    const payload: MyJwtPayload = {
                 userId: userExists.id,
                 role: userExists.role,
                 ...(userExists.role === "SERVICE_PROVIDER" && { providerId: userExists.id }),
     };
   */


    try {
        const token = generateToken(payload, res)

        res.status(200).json({ message: "Logged In successfully" })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export { register, login }