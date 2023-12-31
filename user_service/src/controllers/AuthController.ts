import prisma from '../config/db';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from '@prisma/client';
import { deleteFile } from '../middleware/storage';

export async function isRegistered(username: string) {
    const user : User | null = await prisma.user.findUnique({
        where: { username: username }
    });

    return user !== null;
}

/**
 * Checks if the provided username and password matches a user in the db
 * 
 * @param username Username
 * @param password Unhashed password
 * @returns 
 */
async function authenticate(loginName: string, password: string) {
    const user : User | null = await prisma.user.findUnique({
        where: {
            username: loginName
        }
    });

    if (user === null) {
        return { isCorrectPassword: false, user: null };
    }
    const isCorrectPassword = await bcrypt.compare(password, user?.hashedPassword!);

    return { isCorrectPassword, user }
}

function createToken(payload: any) {
    const expiresIn = '1h'
    return jwt.sign(payload, process.env.SECRET_KEY || 'YOUR_SECRET_KEY', { expiresIn });
}


//@desc     register a user and return a jwt token if successful
//@route    POST /register
//@access   all users
export const register = async (req: any, res: any) => {
    const { username, password } = req.body;

    if (await isRegistered(username) === true) {
        const status = 409;
        const message = 'Credentials already exist';
        res.status(status).json({ status, message });
        return;
    }

    try {
        const hPassword = await bcrypt.hash(password, 10);

        const user : User = await prisma.user.create({
            data: {
                username: username,
                hashedPassword: hPassword,
                role: "USER"
            }
        });

        const { hashedPassword, ...payload } = user
        const access_token = createToken(payload);

        res.cookie('AUTH_SESSION', access_token, {
            httpOnly: true,
            maxAge: 3600000
        });

        res.status(201).json({ 
            user: payload,            
            access_token: access_token });
    } catch (error) {
        res.status(400).json({
            error: error,
            message: 'Failed to register user!'
        })
    }
};

//@desc     log a user in and returns a jwt token if successful
//@route    POST /login
//@access   all users
export const login = async (req: any, res: any) => {
    const { username, password } = req.body;
    const { isCorrectPassword, user } = await authenticate(username, password)

    if (isCorrectPassword === false) {
        const status = 401;
        const message = 'Incorrect username or password';
        res.status(status).json({ status, message });
        return;
    }

    const { hashedPassword, ...payload } = user!;
    const access_token = createToken(payload);

    res.cookie('AUTH_SESSION', access_token, {
        httpOnly: true,
        maxAge: 3600000
    });
    res.status(200).json({ 
        user: payload,
        access_token: access_token });
};

//@desc         get the session user stored in the auth header
//@middleware   jwtCheckNoCredentials
//@route        GET /login
//@access       all users
export const getSessionUser = async (req: any, res: any) => {
    const id = req.auth?.id;
    if (id === undefined) {
        console.log(`result of parsing token: ${req.auth}`);
        
        res.clearCookie('AUTH_SESSION')
        res.status(200).json({
            user: null
        });

        return;
    }

    try {
        const user : User | null = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        const { hashedPassword, ...payload } = user!;

        res.status(200).json({
            user: payload
        })
    } catch (error) {
        res.clearCookie('AUTH_SESSION')
        res.status(400).json({
            error: error,
            message: 'Invalid ID. User not found in database.'
        })
    }

}

//@desc        logs the user out by clearing their session token
//@route        GET /logout
//@access       all users
export const logOut = async (req: any, res: any) => {
    res.clearCookie('AUTH_SESSION')
    res.status(200).send('Logged out successfully');
}


//@desc     change user's password
//@route    POST /changepassword
//@access   only the user himself
export const changePassword = async (req: any, res: any) => {
    const username = req.auth?.username;

    const { newPassword, currPassword } = req.body;
    
    const { isCorrectPassword, user } = await authenticate(username, currPassword)

    if (isCorrectPassword === false) {
        const status = 401;
        const message = 'Incorrect password';
        res.status(status).json({ status, message });
        return;
    }

    const hPassword = await bcrypt.hash(newPassword, 10);

    try {
        await prisma.user.update({
            where: {
                id: user!.id
            },
            data: {
                hashedPassword: hPassword
            }
        })
        res.clearCookie('AUTH_SESSION')
        res.status(200).send('Password changed successfully');
    } catch (error :any) {
        res.status(400).json({
            error: error,
            message: 'Failed to update password!'
        })
    }

};

/**
 * @desc     upload profile pic 
 * @route    POST /uploadProfilePic
 * @access   the user themself
 */
export async function uploadProfilePic(req: any, res:any) {
    const id : number = req.auth?.id;
    const imageName = req.file.filename; // The path where multer saved the file

    const transaction = prisma.$transaction( async (tx) => {
        const oldImageName = await tx.user.findUnique({
            where: {id: id},
            select: {profilePic: true}
        })

        console.log('uploading...new pfp, deleting old one...')
        await deleteFile(oldImageName?.profilePic ?? null);

        const user = await tx.user.update({
            where: { id: id },
            data: { profilePic: imageName },
        });

        return user;
    })


    try {
        const user = await transaction;

        const { hashedPassword, ...payload } = user!;

        res.json(payload);
    } catch (error : any) {
        res.status(500).send(error.message);
    }
}


/**
 * @desc     allow users to update profile and bio
 * @route    POST /updateProfile
 * @access   the user themself
 */
export async function updateUserProfile(req: any, res: any) {
    const id : number = req.auth?.id;
    const {username, bio} = req.body;

    try {
        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                username: username,
                bio: bio,
            }
        })
        
        const { hashedPassword, ...payload } = user!;
        res.status(200).json(payload);
    } catch (error :any) {
        res.status(400).send(error.message);
    }
  
}


/**
 * @desc     updates a user role
 * @route    PUT /updateRole
 * @access   admins only
 */
export async function updateRole(req: any, res: any) {

    //TODO: Ideally revoke the updated user's token

    const { id, role } = req.body
    
    try {
        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                role: role
            }
        })

        const { hashedPassword, ...payload } = user!;
        res.status(200).json(payload);
    } catch (error :any) {
        res.status(400).send(error.message);
    }

}