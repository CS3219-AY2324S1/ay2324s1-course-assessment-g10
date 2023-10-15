import express from 'express';
import { getUserProfile, delUserProfile } from '../controllers/UserController';

const router = express.Router()

router.get('/:id', getUserProfile);
router.delete('/:id', delUserProfile);

export default router;