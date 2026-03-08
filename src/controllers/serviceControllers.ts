import type { Request, Response } from "express"
import { createServiceSchema } from "../validators/createServicevalidator.js"
import { prisma } from "../config/db.js";
import { setAvalibilityValidator } from "../validators/setAvailibilityValidator.js";
import { isValidServiceSchema } from "../validators/isValidServiceValidator.js";

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


const setAvailibility = async (req: Request, res: Response) => {
    const { serviceId } = req.params;
    const parsedData = setAvalibilityValidator.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid input or time format",
        })
    }

    const { dayOfweek, startTime, endTime } = parsedData.data;

    //Here we need to make sure that our startTime is before end time
    //to comapre both the times we need to convert them to mins and then compare

    const [a, b] = startTime.split(":").map(Number)
    const [c, d] = endTime.split(":").map(Number)

    const startTimeInMinutes = a! * 60 + b!;
    const endTimeInMinutes = c! * 60 + d!;

    if (startTimeInMinutes > endTimeInMinutes) {
        return res.status(401).json({
            message: "Start time must be the time before of end time"
        })
    }

    const existingSlots = await prisma.avalibility.findFirst({
        where: {
            id: serviceId as string,
            dayOfweek
        }
    })

    if (existingSlots) {
        const existingStartTime = existingSlots.startTime;
        const existingEndTime = existingSlots.endTime;

        //creating helper function to calculate mins for existingStartTime and existingEndTime
        const toMins = (time: string) => {
            const [h, m] = time.split(":").map(Number)

            return h! * 60 + m!
        }

        const existingStartTimeInMins = toMins(existingStartTime)
        const existingEndTimeInMins = toMins(existingEndTime)

        if (!(startTimeInMinutes >= existingEndTimeInMins || existingEndTimeInMins >= existingEndTimeInMins)) {
            return res.status(409).json({
                message: "Overlapping availibility"
            })

        }
    }

    //403 Service does not belong to provider , here we need to check if that service belongs to the provider or not


    const service = await prisma.service.findUnique({
        where: {
            id: serviceId as string
        }
    })
    if (!service) {
        return res.status(404).json({
            message: "Service not found"
        })
    }

    if (!service.providerId === req.user.providerId) {
        return res.status(403).json({
            message: "service does not belong to provider"
        })

    }

    try {

        await prisma.avalibility.create({
            data: {
                startTime,
                endTime,
                dayOfweek,
                service: {
                    connect: {
                        id: serviceId as string,
                    }
                }
            }
        })

        res.status(201).json({
            message: "Slot created successfully"
        })

    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })

    }

}


const getServices = async (req: Request, res: Response) => {

    const parsedData = isValidServiceSchema.safeParse(req.body)

    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid service type"
        })
    }

    const { type } = parsedData.data;

    try {
        const services = await prisma.service.findMany({
            where: {
                type: type
            }, include: {
                provider: {
                    select: {
                        name: true
                    }
                }
            }
        })

        res.status(200).json(services.map((service) => ({
            id: service.id,
            name: service.name,
            type: service.type,
            durationMinutes: service.durationMinutes,
            providerName: service.provider.name

        })))
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })

    }




}


export { createService, setAvailibility, getServices }