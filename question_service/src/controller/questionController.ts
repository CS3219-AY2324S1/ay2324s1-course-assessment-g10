import Question from '../model/questionModel';
import { getNextSequenceValue } from './counterController';
import AdmZip from 'adm-zip';
import fs from 'fs';

function handleTestCaseUpload(questionId : string, zipFilePath : string) {
    try {
        const zip = new AdmZip(zipFilePath);
        const outDir = `/app/question_test_cases/${questionId}/`;
        zip.extractAllTo(outDir, true);
        //TODO: only store .in file if .out file exists

    } catch (error) {
        console.error('Error processing file:', error);
        throw error;
    } finally {
        fs.unlinkSync(zipFilePath);
    }

}

//@desc     fetch all questions
//@route    GET /api/questions
//@access   authenticated users
export const fetchAllQuestions = async (req : any, res : any) => {
    const questions = await Question.find({})

    res.status(200).json(questions)

}

//@desc     fetch a question
//@route    GET /api/questions/:id
//@access   authenticated users
export const fetchQuestion = async (req : any, res : any) => {
    try {
        // function provided by mongoose to find an Question document with a given ID
        // req.params.id is retrieved from /:id in route
        const question = await Question.findById(req.params.id)

        if(question === null) {
            throw Error('Invalid ID. Question not found in database.');
        }
        res.status(200).json({
            id : question.id,
            _id: question._id,
            title: question.title,
            description: question.description,
            topics: question.topics,
            difficulty: question.difficulty
        })

    } catch (error) {
        res.status(400).json({ message: 'Invalid ID. Question not found in database.' })
    }
}

//@desc     add a question
//@route    POST /api/questions
//@access   admin only
export const addQuestion = async (req : any, res : any) => {

    const questionData = JSON.parse(req.body.question);
    const { title, description, topics, difficulty } = questionData;

    if (!title || !description || !topics || !difficulty || !req.file) {
        console.log(req.body)
        return res.status(400).json({ message: 'Please enter all fields' })
    }

    try {
        const id = await getNextSequenceValue('questionIndex');
        handleTestCaseUpload(id, req.file.path);

        const question = await Question.create({
            id, title, description, topics, difficulty
        })

        res.status(201).json({
            id : question.id,
            _id: question._id,
            title: question.title,
            description: question.description,
            topics: question.topics,
            difficulty: question.difficulty
        })
    } catch (error : any) {
        res.status(400).json({ message: 'Invalid question data', error: error.message })
    }
}

// @desc    Update a question
// @route   PUT /api/addresses/:id
// @access  admin only
export const updateQuestion = async (req : any, res : any) => {

    const questionData = JSON.parse(req.body.question);

    const { title, description, topics, difficulty } = questionData

    if (!title || !description || !topics || !difficulty) {
        return res.status(400).json({ message: 'Please enter all fields' })
    }

    try {
        if (req.file) {
            handleTestCaseUpload(req.params.id, req.file.path);
        }

        // function provided by mongoose to find an Question document with a given ID
        // req.params.id is retrieved from /:id in route
        const question = await Question.findById(req.params.id)

        if(question === null) {
            throw Error('Invalid ID. Question not found in database.');
        }

        // update the document
        question.title = title
        question.description = description
        question.topics = topics
        question.difficulty = difficulty
        // function provided by mongoose to
        // save the changes made to a document
        await question.save()
        // return the updated address in JSON format
        // with success status 200
        res.status(200).json({
            id : question.id,
            _id: question._id,
            title: question.title,
            description: question.description,
            topics: question.topics,
            difficulty: question.difficulty
        })
    } catch (error) {
        res.status(400).json({ message: 'Invalid question data.' })
    }
}
       


// @desc    Delete a question
// @route   DELETE /api/addresses/:id
// @access  admin only
export const deleteQuestion = async (req : any, res : any) => {
    try {
        // function provided by mongoose to find an Question document with a given ID
        // req.params.id is retrieved from /:id in route
        const question = await Question.findById(req.params.id);
        if(question === null) {
            throw Error('Invalid ID. Question not found in database.');
        }
        await question.deleteOne();
        res.status(200).json({ message: 'Question removed' });
    } catch (error) {
        res.status(404).json({ message: 'Question not found' })
    }
}