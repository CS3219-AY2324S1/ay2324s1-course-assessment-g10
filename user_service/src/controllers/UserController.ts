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