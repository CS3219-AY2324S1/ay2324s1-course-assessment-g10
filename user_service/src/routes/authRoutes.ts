import express from 'express';
import { getSessionUser, login, register } from '../controllers/AuthController'
import { handleAuthFailure, jwtCheckNoCredentials } from '../middleware/jwtCheck';

const router = express.Router()

router.post('/login', login);
router.post('/register', register);
router.get('/getSessionUser', jwtCheckNoCredentials, getSessionUser);
router.use(handleAuthFailure);

export default router;