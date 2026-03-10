import type { Request, Response } from "express";
import { dateSchema } from "../validators/dateValidator.js";
import { prisma } from "../config/db.js";

export const providerDailySchedule = async (req: Request, res: Response) => {

    const parsedData = dateSchema.safeParse(req.query)

    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid date format"
        })
    }

    const date = parsedData.data;
    const providerId = req.user.providerId //it could be like this as well const providerId = req.user.userId cuz we dont have a separate providerId , adding it to myjwtpayload  interface and payload while assigning is reductant 

    if (!providerId) {
        return res.status(400).json({
            message: "No providerId is provided"
        })
    }

    try {
        const services = await prisma.service.findMany({
            where: {
                providerId:providerId
            }, include: {
                appointment: {
                    orderBy: {
                        startTime : "asc"  //this will sort it in ascending order 
                    }
                    ,include: {
                        user: true
                    }
                }
            }
        })


        const allAppointments ={
            date:date.date,
            services: services.map((ser) => ({
                serviceId: ser.id,
                serviceName: ser.name,
                appointments: ser.appointment.map((app) => ({
                    appointmentId: app.id,
                    userName: app.user.name,
                    startTime: app.startTime,
                    endTime: app.endTime,
                    status: app.status
                }))

            }))}


        res.status(200).json(allAppointments)
    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            log: console.log(error.message)
        })

    }


}