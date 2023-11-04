import express from 'express';
import { getUserProfile, delUserProfile, getUserQuestions, addUserQuestion, findUsersWithName} from '../controllers/UserController';

const router = express.Router()

router.get('/:id', getUserProfile);
router.delete('/:id', delUserProfile);
router.get('/:id/questions', getUserQuestions);
router.post('/:id/addquestions', addUserQuestion);
router.post('/findusers', findUsersWithName);

export default router;