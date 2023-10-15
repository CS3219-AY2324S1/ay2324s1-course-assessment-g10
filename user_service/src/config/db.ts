import { PrismaClient } from "@prisma/client"
// connection function to be used in index.ts

const prisma = new PrismaClient()

// function to start up and connect to MongoDB database
export default prisma;
