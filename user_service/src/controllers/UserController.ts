import prisma from "../config/db";
import { PrismaClient } from '@prisma/client';
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
                
        res.status(200).json({
            _id: user?.id,
            loginName: user?.username,
            role: user?.role
        });
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


//@desc     get user's answered questions
//@route    GET /api/users/:id/questions
//@access   authenticated users
export async function getUserQuestions(req: any, res: any) {
  try {
    const userId = parseInt(req.params.id, 10)

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const answeredQuestions = await prisma.answeredQuestion.findMany({
      where: {
        userId: userId,
      },
    });

    return res.json(answeredQuestions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}



//@desc     add a new user question
//@route    POST /api/users/:id/addquestions
//@access   authenticated users
export async function addUserQuestion(req: Request, res: Response) {
  try {
    const { userId, questionTitle, questionId, difficulty, topics, solved} = req.body;

    const createdQuestion = await prisma.answeredQuestion.create({
      data: {
        userId: userId,          
        questionTitle: questionTitle,  
        questionId: questionId,  
        difficulty: difficulty,
        topics: { set: topics },
        solved: solved,          
      },
    });

    res.json(createdQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}