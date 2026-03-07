import express from "express"
import { login, register } from "../controllers/authControllers.js"

const authRouter = express.Router()

authRouter.post("/auth/register" , register)
authRouter.post("/auth/login" , login)

export default authRouter;
