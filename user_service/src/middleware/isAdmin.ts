export const isAdmin = (req: any, res: any, next: any) => {

    if (req.auth && req.auth.role === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({ message: 'Admin privileges required' });
    }

};