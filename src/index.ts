import {connectDB , disconnectDB} from "./config/db.js"
import "dotenv/config"
import express from 'express'
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoutes.js";
import { appointmentRouter } from "./routes/appointmentRoutes.js";
import serviceRouter from "./routes/serviceRoutes.js";
import { providergetRouter } from "./routes/providerGetRoute.js";


connectDB();

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/" , authRouter)
app.use("/" , serviceRouter)
app.use("/", appointmentRouter)
app.use("/" , providergetRouter)

app.listen(process.env.PORT)

console.log("Listening on port 3000")