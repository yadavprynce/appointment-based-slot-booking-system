//in this project i am embedding role in jwt and verifying it from there

import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"

const verifyRole = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json("No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (decoded.role === "SERVICE_PROVIDER") {
      return next();
    }
    return res.status(403).json("Only service providers can access this endpoint");
  } catch (err) {
    return res.status(401).json("Invalid token");
  }
};

export default verifyRole;