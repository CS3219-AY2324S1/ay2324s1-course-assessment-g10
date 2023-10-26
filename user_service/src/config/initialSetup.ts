import bcrypt from 'bcryptjs'
import { isRegistered } from '../controllers/AuthController';
import prisma from './db';


export async function setupAdminUser() {
    const username = "admin";
    const password = "admin";

    const hPassword = await bcrypt.hash(password, 10);

    try {
        const is_Registered = await isRegistered(username);

        if (!is_Registered) {
            await prisma.user.create({
                data: {
                    username: username,
                    hashedPassword: hPassword,
                    role: "ADMIN"
                }
            });

            console.log('Initial Admin created!');
        } else {
            console.log('Initial Admin exists!');
        }

        
    } catch (err : any) {
        
        console.log(`Failed to create user: ${err.message}`);
    }
};

