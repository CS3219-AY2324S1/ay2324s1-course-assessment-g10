import express from 'express';
import { changePassword, getSessionUser, logOut, login, register } from '../controllers/AuthController'
import { handleAuthFailure, jwtCheckNoCredentials, jwtCheckRequireCredentials } from '../middleware/jwtCheck';

const router = express.Router()

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logOut);
router.post('/changepassword', jwtCheckRequireCredentials, changePassword);
router.get('/getSessionUser', jwtCheckNoCredentials, getSessionUser);
router.use(handleAuthFailure);

export default router;