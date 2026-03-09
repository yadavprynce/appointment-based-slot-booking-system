import type{MyJwtPayloadJwtPayload} from "../../src/utils/generateToken.ts"

declare global{
    namespace Express {
        interface Request {
            user?: MyJwtPayload
        }
    }
}


//here initially it was 
/* declare global{
    namespace Express {
        interface Request {
            user?:string | JwtPayload(this one is from jsonwebtoken library , but since i enforced a schema of my own while signing the jwt and niw i know that upon decoding/verifying it will always be of type MyJwtPayload not a string so now i can remove it )
        }
    }
}*/

//jwt.sign("hello", secret)  // → decodes back as string
//jwt.sign({ userId: "123" }, secret)  // → decodes back as JwtPayload
//The library doesn't know at compile time which one you used when signing — so it covers both cases with string | JwtPayload to be safe.