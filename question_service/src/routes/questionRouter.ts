import express from 'express';
import { fetchAllQuestions, addQuestion, updateQuestion, deleteQuestion, fetchQuestion  } from '../controller/questionController';

const router = express.Router();

router.get('/', fetchAllQuestions);
router.post('/', addQuestion)
router.get('/:id', fetchQuestion)
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion)


export default router;