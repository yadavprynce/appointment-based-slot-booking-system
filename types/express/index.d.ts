import { JwtPayload } from "jsonwebtoken"
export interface MyJwtPayload {
  userId: string;
  role: "USER" | "SERVICE_PROVIDER";
}
declare global{
    namespace Express {
        interface Request {
            user: string | JwtPayload
        }
    }
}