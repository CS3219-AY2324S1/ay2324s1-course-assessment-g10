import express from 'express';
import { getUserProfile, delUserProfile, getUserQuestions, addUserQuestion} from '../controllers/UserController';

const router = express.Router()

router.get('/:id', getUserProfile);
router.delete('/:id', delUserProfile);
router.get('/:id/questions', getUserQuestions);
router.post('/:userId/questions', addUserQuestion);


export default router;