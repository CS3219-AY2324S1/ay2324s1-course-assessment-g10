import express from 'express';
import { getUserProfile, delUserProfile, findUsersWithName } from '../controllers/UserController';

const router = express.Router()

router.get('/:id', getUserProfile);
router.delete('/:id', delUserProfile);
router.post('/findusers', findUsersWithName);

export default router;