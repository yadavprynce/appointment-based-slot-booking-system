import {connectDB , disconnectDB} from "./config/db.js"

connectDB();
import "dotenv/config"
import express from 'express'

const app = express()

app.listen(process.env.PORT)

console.log("Listening on port 3000")