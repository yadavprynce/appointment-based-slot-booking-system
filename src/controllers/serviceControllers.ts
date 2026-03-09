import type { Request, Response } from "express"
import { createServiceSchema } from "../validators/createServicevalidator.js"
import { prisma } from "../config/db.js";
import { setAvalibilityValidator } from "../validators/setAvailibilityValidator.js";
import { isValidServiceSchema } from "../validators/isValidServiceValidator.js";
import { getAvailableSlotsSchema } from "../validators/getAvailableSlotsValidator.js";

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

    const existingAvailibility = await prisma.avalibility.findFirst({
        where: {
            id: serviceId as string,
            dayOfweek
        }

    })

    if (existingAvailibility) {
        const existingStartTime = existingAvailibility.startTime;
        const existingEndTime = existingAvailibility.endTime;

        //creating helper function to calculate mins for existingStartTime and existingEndTime
        const toMins = (time: string) => {
            const [h, m] = time.split(":").map(Number)

            return h! * 60 + m!
        }

        const existingStartTimeInMins = toMins(existingStartTime)
        const existingEndTimeInMins = toMins(existingEndTime)

        if (!(startTimeInMinutes >= existingEndTimeInMins || endTimeInMinutes <= existingStartTimeInMins)) {
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

    const parsedData = isValidServiceSchema.safeParse(req.query)

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


const getAvailableSlots = async (req: Request, res: Response) => {

    const { serviceId } = req.params;
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

    const parsedDate = getAvailableSlotsSchema.safeParse(req.query);

    if (!parsedDate.success) {
        return res.status(400).json({
            message: "Invalid date or format"
        })
    }

    const { date } = parsedDate.data
    const today = new Date().toISOString().split("T")[0]! // or you can use .slice(0 , 10) cuz we have 10 chars imp to us ..."2026-03-09T14:30:00.000Z" this is what we get from new date


    if (!(date >= today)) {
        return res.status(400).json({
            message: "Invalid date or format"
        })
    }

    const dayOfWeek = new Date(date).getDay()

    try {
        const availability = await prisma.avalibility.findFirst({
            where: {
                serviceId: serviceId as string,
                dayOfweek: dayOfWeek
            }
        })

        if (!availability) {
            return res.json({
                message: "No services available on this day"
            })
        }

        const durationOfService = service.durationMinutes;

        const toMins = (time: string) => {
            const [h, m] = time.split(":").map(Number)
            return h! * 60 + m!
        }


        const availablityStartInMins = toMins(availability.startTime);
        const availablityEndTimeInMins = toMins(availability.endTime);

        //new thing to learn is padStart() , this exists on String and pads it from the left , expects two args one is target length and another is the value what to pad with
        //another is to convert into String you can just wrap the whole thing in String() , meaning String() and
        const toTime = (mins: number) => {
            const HH = (Math.floor(mins / 60)).toString().padStart(2, "0");
            const MM = String(mins % 60).padStart(2, "0");
            return `${HH}:${MM}`
        }


        const slots = []
        let currentTime = availablityStartInMins

        while (currentTime < availablityEndTimeInMins) {
            slots.push({
                slotId: `${serviceId}_${date}_${toTime(currentTime)}`,
                startTime: toTime(currentTime),
                endTime: toTime(currentTime + durationOfService)
            })

            currentTime = currentTime + durationOfService
        }

        const checkBookedSlots = await prisma.appointment.findMany({
            where: {
                serviceId: serviceId as string,
                date,
                status: "Booked"
            }
        })

        const bookedSlotIds = checkBookedSlots.map(s => s.slotId)
        const availableSlots = slots.filter(slot => !bookedSlotIds.includes(slot.slotId))

        res.status(200).json({
            "serviceId": serviceId,
            "date": date,
            "slots": availableSlots
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })

    }

}
export { createService, setAvailibility, getServices, getAvailableSlots }