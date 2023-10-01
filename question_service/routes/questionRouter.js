const express = require('express');
const router = express.Router();

const { fetchAllQuestions, addQuestion } = require('../controller/questionController');

router.route('/').get(fetchAllQuestions)
router.route('/').post(addQuestion)

module.exports = router