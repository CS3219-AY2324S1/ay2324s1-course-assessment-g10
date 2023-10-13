import express from 'express';
import { getUserProfile } from '../controllers/UserController';

const router = express.Router()

router.get('/:id', getUserProfile)
router.put('')

export default router;