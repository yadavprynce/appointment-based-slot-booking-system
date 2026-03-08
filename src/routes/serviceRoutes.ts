import express from "express"
import verifyRole from "../middlewares/roleMiddleware.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import {createService , getServices, setAvailibility} from "../controllers/serviceControllers.js"

const serviceRoutes = express.Router()

serviceRoutes.post("/services" , verifyToken , verifyRole , createService )
serviceRoutes.post("/services/:serviceId/availibility" , verifyToken , verifyRole ,setAvailibility )
serviceRoutes.get("/services" , verifyToken , getServices  )
export default serviceRoutes