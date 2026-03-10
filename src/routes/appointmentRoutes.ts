import express from "express"
import { bookAppointments, myAppointments } from "../controllers/appointmentControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const appointmentRouter = express.Router();

appointmentRouter.post("/appointments" , verifyToken  ,bookAppointments)
appointmentRouter.get("/appointments/me" , verifyToken , myAppointments )