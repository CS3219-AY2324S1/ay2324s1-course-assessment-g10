const express = require('express');
const router = express.Router();

const { fetchAllQuestions, addQuestion, updateQuestion, deleteQuestion, fetchQuestion } = require('../controller/questionController');

router.route('/').get(fetchAllQuestions)
router.route('/').post(addQuestion)
router.route('/:id').get(fetchQuestion)
router.route('/:id').put(updateQuestion)
router.route('/:id').delete(updateQuestion)


module.exports = router