import {type JwtPayload} from "../../src/utils/generateToken.ts"

declare global{
    namespace Express {
        interface Request {
            user: string | JwtPayload
        }
    }
}