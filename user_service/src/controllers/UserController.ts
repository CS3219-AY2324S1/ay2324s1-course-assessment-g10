import prisma from "../config/db";
import { Request, Response } from 'express';


//@desc     fetch a user's profile
//@route    GET /api/users/:id
//@access   authenticated users
export const getUserProfile = async (req: any, res: any) => {
    try {
        const userId = parseInt(req.params.id, 10); // Parse req.params.id as an integer

        if (isNaN(userId)) {
            res.status(400).json({ error: 'Invalid ID' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        
        if (user === null) {
          throw Error('Invalid ID. User not found in database.')
        }

        const { hashedPassword, ...payload } = user!;
        res.status(200).json(payload);

    } catch (error) {
        res.status(400).json({
            error: error,
            message: 'Invalid ID. User not found in database.'
        });
    }
}



//@desc     deletes a user's profile
//@route    DELETE /api/users/:id
//@access   admin users and profile owner
export const delUserProfile = async (req: any, res: any) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: parseInt(req.params.id, 10)
                
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

//@desc     find users that match part of a query
//@route    POST /api/users/findusers
//@access   authenticated users
export async function findUsersWithName(req: Request, res: Response) {
  try {
    const { query } = req.body;

    const users = await prisma.user.findMany({
      where : {
        username : {
          contains: query.trim(),
          mode: 'insensitive'
        }
      },
      take: 5,
      distinct: 'id',
      select: {
        username: true,
        profilePic: true,
        role: true,
        id: true,
        bio: true
      }
    })

    res.status(200).json(users);
    
  } catch (error : any) {
    res.status(400).json({
      error: error,
      message: 'An error occured while looking for users!'
    });
  }

}