import express from 'express';
import { changePassword, getSessionUser, logOut, login, register, updateRole, updateUserProfile } from '../controllers/AuthController'
import { handleAuthFailure, jwtCheckNoCredentials, jwtCheckRequireCredentials } from '../middleware/jwtCheck';
import { isAdmin } from '../middleware/isAdmin';

const router = express.Router()

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logOut);
router.post('/changepassword', jwtCheckRequireCredentials, changePassword);
router.get('/getSessionUser', jwtCheckNoCredentials, getSessionUser);
router.post('/updateProfile', jwtCheckRequireCredentials, updateUserProfile);
router.put('/updateRole', [jwtCheckRequireCredentials, isAdmin], updateRole);
router.use(handleAuthFailure);

export default router;