import {connectDB , disconnectDB} from "./config/db.js"
import "dotenv/config"
import express from 'express'
import authRouter from "./routes/authRoutes.js";


connectDB();

const app = express()
app.use(express.json())

app.use("/" , authRouter)

app.listen(process.env.PORT)

console.log("Listening on port 3000")