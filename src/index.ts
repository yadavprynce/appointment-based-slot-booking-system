import {connectDB , disconnectDB} from "./config/db.js"
import "dotenv/config"
import express from 'express'
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";


connectDB();

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/" , authRouter)
app.use("/" , serviceRoutes)

app.listen(process.env.PORT)

console.log("Listening on port 3000")