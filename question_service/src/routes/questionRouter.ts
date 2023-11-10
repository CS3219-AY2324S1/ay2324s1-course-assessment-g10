import express from 'express';
import { fetchAllQuestions, addQuestion, updateQuestion, deleteQuestion, fetchQuestion  } from '../controller/questionController';
import { upload } from '../middleware/storage';

const router = express.Router();

router.get('/', fetchAllQuestions);
router.post('/', upload.single('testcases'), addQuestion)
router.get('/:id', fetchQuestion)
router.put('/:id', upload.single('testcases'), updateQuestion);
router.delete('/:id', deleteQuestion)


export default router;