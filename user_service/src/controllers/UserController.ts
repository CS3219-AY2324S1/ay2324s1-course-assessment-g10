import User from '../model/UserModel'


//@desc     fetch a user's profile
//@route    GET /api/users/:id
//@access   authenticated users
export const getUserProfile = async (req: any, res: any) => {
    try {
        const user = await User.findById(req.params.id);
                
        res.status(200).json({
            _id: user?._id,
            loginName: user?.loginName,
            role: user?.role
        })
    } catch (error) {
        res.status(400).json({message: 'Invalid ID. Question not found in database.'})
    }
}