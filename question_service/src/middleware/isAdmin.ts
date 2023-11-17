export const isAdmin = (req: any, res: any, next: any) => {

    if (req.auth && req.auth.role === 'ADMIN') {
        next();
    } else {
        console.log(`${req.auth.username} with role ${req.auth.role} tried to access Admin route`);
        return res.status(403).json({ message: 'Admin privileges required' });
    }

};