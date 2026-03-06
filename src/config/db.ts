import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import "dotenv/config"

const adapter = new PrismaPg(process.env.DATABASE_URL)
const prisma = new PrismaClient({ adapter })

const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log("DB conncetion successful")
    } catch (error: any) {
        console.error(`Database Connection Error : ${error.message}`)
    }
}

const disconnectDB = async () => {
    await prisma.$disconnect();

}

export { connectDB, disconnectDB }
