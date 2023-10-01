const Question = require('../model/questionModel')

//@desc     fetch all questions
//@route    GET /api/questions
//@access   authenticated users
const fetchAllQuestions = async (req, res) => {
    const questions = await Question.find({})

    res.status(200).json(questions)

}

//@desc     fetch a question
//@route    GET /api/questions/:id
//@access   authenticated users
const fetchQuestion = async (req, res) => {
    try {
        // function provided by mongoose to find an Question document with a given ID
        // req.params.id is retrieved from /:id in route
        const question = await Question.findById(req.params.id)

        res.status(200).json({
            _id: question._id,
            title: question.title,
            description: question.description,
            category: question.category,
            complexity: question.complexity
        })
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID. Question not found in database.' })
    }
}

//@desc     add a question
//@route    POST /api/questions
//@access   admin only
const addQuestion = async (req, res) => {
    const { title, description, category, complexity } = req.body

    if (!title || !description || !category || !complexity) {
        return res.status(400).json({ message: 'Please enter all fields' })
    }

    try {
        const question = await Question.create({
            title, description, category, complexity
        })

        res.status(201).json({
            _id: question._id,
            title: question.title,
            description: question.description,
            category: question.category,
            complexity: question.complexity
        })
    } catch (error) {
        res.status(400).json({ message: 'Invalid question data' })
    }
}

// @desc    Update a question
// @route   PUT /api/addresses/:id
// @access  admin only
const updateQuestion = async (req, res) => {
    const { title, description, category, complexity } = req.body

    if (!title || !description || !category || !complexity) {
        return res.status(400).json({ message: 'Please enter all fields' })
    }

    try {
        // function provided by mongoose to find an Question document with a given ID
        // req.params.id is retrieved from /:id in route
        const question = await Question.findById(req.params.id)
        // update the document
        question.title = title
        question.description = description
        question.category = category
        question.complexity = complexity
        // function provided by mongoose to
        // save the changes made to a document
        await question.save()
        // return the updated address in JSON format
        // with success status 200
        res.status(200).json({
            _id: question._id,
            title: question.title,
            description: question.description,
            category: question.category,
            complexity: question.complexity
        })
    } catch (error) {
        res.status(400).json({ message: 'Invalid question data.' })
    }
}
       


// @desc    Delete a question
// @route   DELETE /api/addresses/:id
// @access  admin only
const deleteQuestion = async (req, res) => {
    try {
        // function provided by mongoose to find an Question document with a given ID
        // req.params.id is retrieved from /:id in route
        const question = await Question.findById(req.params.id);
        await question.deleteOne();
        res.status(200).json({ message: 'Question removed' });
    } catch (error) {
        res.status(404).json({ message: 'Question not found' })
    }
}


module.exports = { fetchAllQuestions, fetchQuestion, addQuestion, updateQuestion, deleteQuestion }