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
        res.status(401).send({ message: err.message });
        return;
    }

    next(err);
}
