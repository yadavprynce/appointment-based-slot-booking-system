import express from "express"
import verifyRole from "../middlewares/roleMiddleware.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { providerDailySchedule } from "../controllers/providerGetController.js"

export const providergetRouter = express.Router()

providergetRouter.get("/providers/me/schedule" , verifyToken , verifyRole , providerDailySchedule  )