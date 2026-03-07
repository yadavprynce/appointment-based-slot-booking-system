import express from "express"
import createService from "../controllers/serviceControllers.js"
import verifyRole from "../middlewares/roleMiddleware.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

const serviceRoutes = express.Router()

serviceRoutes.post("/services" , verifyRole , verifyToken , createService )

export default serviceRoutes