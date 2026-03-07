import type { Request, Response } from "express"
import { createServiceSchema } from "../validators/createServicevalidator.js"
import { prisma } from "../config/db.js";

const createService = async (req: Request, res: Response) => {
    const parsedData = createServiceSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid Input"
        })
    }

    const { name, type, durationMinutes } = parsedData.data;
    const providerId = req.user.providerId;

    try {
        const createService = await prisma.service.create({
            data: {
                name,
                type,
                durationMinutes,
                provider: {
                    connect: {
                        id: providerId
                    }
                }
            }
        }
        )
        res.status(201).json({
            id: createService.id,
            name: createService.name,
            type: createService.type,
            durationMinutes: createService.durationMinutes
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }

}

export default createService