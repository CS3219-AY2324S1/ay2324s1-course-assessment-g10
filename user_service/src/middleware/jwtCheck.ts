import { expressjwt } from 'express-jwt';

export const jwtCheckNoCredentials = expressjwt({
    secret: process.env.SECRET_KEY || 'YOUR_SECRET_KEY',
    algorithms: ['HS256'],
    getToken: (req: any) => {
        return req.cookies['AUTH_SESSION'] ? req.cookies['AUTH_SESSION'] : null
    },
    credentialsRequired: false,
})

export const jwtCheckRequireCredentials = expressjwt({
    secret: process.env.SECRET_KEY || 'YOUR_SECRET_KEY',
    algorithms: ['HS256'],
    getToken: (req: any) => {
        return req.cookies['AUTH_SESSION'] ? req.cookies['AUTH_SESSION'] : null
    },
    credentialsRequired: true,
})

export function handleAuthFailure(err: any, req: any, res: any, next: any) {
    if (err.name === 'UnauthorizedError') {
        res.cookie('AUTH_SESSION', '', {
            expires: new Date(0), // Set the expiration time to 01 January 1970 00:00:00 UTC
            httpOnly: true,
        })
        res.status(401).send({ message: err.message });
        return;
    }

    next(err);
}
