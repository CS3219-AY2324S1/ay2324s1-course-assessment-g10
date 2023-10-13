import User from '../model/UserModel'
import jwt from 'jsonwebtoken'

async function isRegistered(username: String) {
    const user = await User.findOne({ loginName: username });

    return user !== undefined;
}

async function isAuthenticated(username: String, password: String) {
    const user = await User.findOne({ loginName: username, password: password});

    return user !== undefined;
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
        const user = await User.create({ loginName: username, password: password, role: "USER" })
        const access_token = createToken({ username, password });


        res.status(201).json({ access_token });
    } catch (error) {
        res.status(400).json({ message: 'Failed to register user!' })
    }
};

//@desc     log a user in and returns a jwt token if successful
//@route    POST /login
//@access   all users
export const login = async (req: any, res: any) => {
    const { username, password } = req.body;

    if (await isAuthenticated(username, password) === false) {
        const status = 401;
        const message = 'Incorrect username or password';
        res.status(status).json({ status, message });
        return;
    }
    const access_token = createToken({ username, password });
    res.status(200).json({ access_token });
};

