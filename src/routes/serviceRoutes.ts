import express from "express"
import verifyRole from "../middlewares/roleMiddleware.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import {createService , getAvailableSlots, getServices, setAvailibility} from "../controllers/serviceControllers.js"

const serviceRouter = express.Router()

serviceRouter.post("/services" , verifyToken , verifyRole , createService )
serviceRouter.post("/services/:serviceId/availibility" , verifyToken , verifyRole ,setAvailibility )
serviceRouter.get("/services" , verifyToken , getServices )
serviceRouter.get("/services/:serviceId/slots" , getAvailableSlots)

export default serviceRouter