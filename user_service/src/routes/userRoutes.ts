import express from 'express';
import { getUserProfile } from '../controllers/UserController';

const router = express.Router()

router.get('/users/:id', getUserProfile)

export default router;