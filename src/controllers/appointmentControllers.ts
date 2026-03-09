import type { Request, Response } from "express";
import { slotIdSchema } from "../validators/slotIdValidater.js";
import { prisma } from "../config/db.js";
import { error } from "node:console";

export const bookAppointments = async (req: Request, res: Response) => {
    if (req.user.role !== "USER") {
        return res.status(403).json({
            message: "Forbidden "
        })
    }


    const parsedSlotId = slotIdSchema.safeParse(req.body)

    if (!parsedSlotId.success) {
        return res.status(400).json({
            message: "Invalid slotid or time"
        })
    }

    const validSlotId = parsedSlotId.data;

    const serviceId = validSlotId.slotId.split("_")[0] as string
    const date = validSlotId.slotId.split("_")[1] as string
    const startTimeOfBooking = validSlotId.slotId.split("_")[2]



    const dayOfWeek = new Date(date).getDay()

    const validAvailibility = await prisma.avalibility.findFirst({
        where: {
            dayOfweek: dayOfWeek,
            serviceId: serviceId
        }
    })

    if (!validAvailibility) {
        return res.status(409).json({
            message: "Invalid slotId or time"
        })
    }


    const isSlotBooked = await prisma.appointment.findUnique({
        where: {
            slotId: validSlotId.slotId
        }
    })

    if (isSlotBooked) {
        return res.status(409).json({
            message: "Slot  already booked"
        })

    }

    const service = await prisma.service.findUnique({
        where: {
            id: serviceId
        }
    })

    if (!service) {
        return res.status(400).json({ message: "Invalid slotId or time" })
    }

    const durationOfService = service.durationMinutes;

    const toMin = (time: string) => {
        const [HH, MM] = time.split(":").map(Number)
        return HH! * 60 + MM!

    }

    const toTime = (mins: number) => {
        const HH = (Math.floor(mins / 60)).toString().padStart(2, "0")
        const MM = (mins % 60).toString().padStart(2, "0")
        return `${HH}:${MM}`

    }

    const slot = {
        slotId: validSlotId,
        startTime: startTimeOfBooking,
        endTime: toTime(toMin(startTimeOfBooking!) + durationOfService!)
    }

    const slotStartTime = toMin(slot.startTime as string)
    const slotEndTime = toMin(startTimeOfBooking!) + durationOfService!
    

    const availableStartTime = toMin(validAvailibility.startTime)
    const availableEndTime = toMin(validAvailibility.endTime)

    if(availableStartTime > slotStartTime || availableEndTime < slotEndTime){
        return res.status(400).json({
            message:"Invalid slotId or time"
        })
    }

    //making sure provider cant book thier own sevice

    if(req.user.userId === service.providerId){
        return res.status(403).json({
            message:"Providers can't book thier own services"
        })
    }



    //now we are asked to crate the appointment using transactions 

    try {
        await prisma.$transaction(async (tx) => {
            const existing = await tx.appointment.findUnique({
                where: {
                    slotId: validSlotId.slotId
                }
            })

            if (existing) throw new Error("Slot already booked")

           const createAppointment = await tx.appointment.create({
                data: {
                    userId: req.user.userId,
                    serviceId: serviceId,
                    date: date,
                    startTime: startTimeOfBooking as string,
                    endTime: toTime(toMin(startTimeOfBooking!) + durationOfService!),
                    slotId: validSlotId.slotId,
                    status:"Booked"

                }

            })

            res.status(201).json({
                id: createAppointment.id,
                slotId: validSlotId.slotId,
                status: "BOOKED"
            })

        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }

}




