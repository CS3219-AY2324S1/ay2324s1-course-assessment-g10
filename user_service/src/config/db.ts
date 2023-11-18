import { PrismaClient } from "@prisma/client"

// connection function to be used in index.ts

const prisma = new PrismaClient()

export default prisma;
