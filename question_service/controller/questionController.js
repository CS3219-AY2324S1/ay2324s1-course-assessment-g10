const Question = require('../model/questionModel')

//@desc     fetch all questions
//@route    GET /api/questions
//@access   authenticated users
const fetchAllQuestions = async (req, res) => {
    const questions = await Question.find({})

    res.status(200).json(questions)

}

//@desc     add a question
//@route    POST /api/questions
//@access   admin only
const addQuestion = async (req, res) => {
    const {title, description, category, complexity} = req.body

    if (!title || !description || !category || !complexity) {
        return res.status(400).json({message: 'Please enter all fields'})
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
        res.status(400).json({message: 'Invalid question data'})
    }
}


module.exports = { fetchAllQuestions, addQuestion }