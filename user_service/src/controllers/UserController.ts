import prisma from "../config/db";

//@desc     fetch a user's profile
//@route    GET /api/users/:id
//@access   authenticated users
export const getUserProfile = async (req: any, res: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.params.id
            }
        });
                
        res.status(200).json({
            _id: user?.id,
            loginName: user?.username,
            role: user?.role
        })
    } catch (error) {
        res.status(400).json({
            error: error,
            message: 'Invalid ID. User not found in database.'})
    }
}


//@desc     deletes a user's profile
//@route    DELETE /api/users/:id
//@access   admin users and profile owner
export const delUserProfile = async (req: any, res: any) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: req.params.id
            }
        });
                
        res.status(200).json({
            message: 'User deleted'
        })
    } catch (error) {
        res.status(404).json({
            error: error,
            message: 'User not found.'})
    }
}