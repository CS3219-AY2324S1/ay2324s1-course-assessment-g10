import express from 'express';
import { changePassword, getSessionUser, logOut, login, register, updateUserProfile, uploadProfilePic } from '../controllers/AuthController'
import { handleAuthFailure, jwtCheckNoCredentials, jwtCheckRequireCredentials } from '../middleware/jwtCheck';
import { upload } from '../middleware/storage';

const router = express.Router()

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logOut);
router.post('/changepassword', jwtCheckRequireCredentials, changePassword);
router.get('/getSessionUser', jwtCheckNoCredentials, getSessionUser);
router.post('/updateProfile', jwtCheckRequireCredentials, updateUserProfile);
router.post('/uploadProfilePic', [jwtCheckRequireCredentials, upload.single('profilePic')], uploadProfilePic);
router.use(handleAuthFailure);

export default router;