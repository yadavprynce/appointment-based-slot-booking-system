import type { Response, NextFunction, Request } from "express"
import jwt from "jsonwebtoken"
import "dotenv/config"


const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(403).json({
            message: "Invalid token provided"
        })

    }

}