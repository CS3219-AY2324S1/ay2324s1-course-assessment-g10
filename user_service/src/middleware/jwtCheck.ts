import jwt from 'express-jwt'

export const jwtCheckNoCredentials = jwt.expressjwt({
    secret: process.env.SECRET || 'YOUR_SECRET_KEY',
    algorithms: ['HS256'],
    getToken: (req: any) => {
        return req.cookies.sessionToken ? req.cookies.sessionToken : null
    },
    credentialsRequired: false,
})

export const jwtCheckRequireCredentials = jwt.expressjwt({
    secret: process.env.SECRET || 'YOUR_SECRET_KEY',
    algorithms: ['HS256'],
    getToken: (req: any) => {
        return req.cookies.sessionToken ? req.cookies.sessionToken : null
    },
    credentialsRequired: true,
})

export function handleAuthFailure(err: any, req: any, res: any, next: any) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ message: err.message });
        return;
    }

    next(err);
}
