import prisma from '../config/db';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

async function isRegistered(username: string) {
    const user = await prisma.user.findUnique({
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
    const user = await prisma.user.findUnique({
        where: {
            username: loginName
        }
    });
    
    if (user === null) {
        return {isCorrectPassword: false , user: null};
    }
    const isCorrectPassword = await bcrypt.compare(password, user?.hashedPassword!);
    
    return {isCorrectPassword , user}
}

function createToken(payload: any) {
    const expiresIn = '1h'
    return jwt.sign(payload, process.env.SECRET_KEY || 'testingKey', { expiresIn });
}


//@desc     register a user and return a jwt token if successful
//@route    POST /register
//@access   all users
export const register = async (req: any, res: any) => {
    const { username, password } = req.body;

    if (await isRegistered(username) === true) {
        const status = 401;
        const message = 'Credentials already exist';
        res.status(status).json({ status, message });
        return;
    }

    try {
        const hPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({ data: { 
            username: username, 
            hashedPassword: hPassword, 
            role: "USER" 
        }});

        const {hashedPassword, ...payload} = user
        const access_token = createToken(payload);

        res.status(201).json({ access_token });
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

    if ( isCorrectPassword === false) {
        const status = 401;
        const message = 'Incorrect username or password';
        res.status(status).json({ status, message });
        return;
    }

    const { hashedPassword, ...payload} = user!;
    const access_token = createToken(payload);
    res.status(200).json({ access_token });
};

