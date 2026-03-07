import type{MyJwtPayloadJwtPayload} from "../../src/utils/generateToken.ts"

declare global{
    namespace Express {
        interface Request {
            user?: string | MyJwtPayload
        }
    }
}