import express from "express"
import { bookAppointments } from "../controllers/appointmentControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const appointmentRouter = express.Router();

appointmentRouter.post("/appointments" , verifyToken  ,bookAppointments)

