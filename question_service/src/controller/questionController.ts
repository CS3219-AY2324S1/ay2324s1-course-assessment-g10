import Question from '../model/questionModel';
import { getNextSequenceValue } from './counterController';
import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import path from 'path';

async function handleTestCaseUpload(questionId : string, zipFilePath : string) {
    try {
        const zip = new AdmZip(zipFilePath);
        const outDir = `/app/question_test_cases/${questionId}/`;
        zip.extractAllTo(outDir, true);


        //only store .in file if .out file exists
        const files = await fs.readdir(outDir);
        const inFiles = files.filter(file => file.endsWith('.in'));
        const outFiles = files.filter(file => file.endsWith('.out'));

        const invalidInFiles = inFiles.filter(inFile => {
            const correspondingOutFile = inFile.replace('.in', '.out');
            return !files.includes(correspondingOutFile);
        });

        const invalidOutFiles = outFiles.filter(outFile => {
            const correspondingInFile = outFile.replace('.out', '.in');
            return !files.includes(correspondingInFile);
        });

        const randomFiles = files.filter(file => !(file.endsWith('.in') || file.endsWith('.out')));

        await Promise.all(invalidInFiles.map(async file => {
            await fs.rm(path.join(outDir, file), { recursive: true, force: true });
        }))

        await Promise.all(invalidOutFiles.map(async file => {
            await fs.rm(path.join(outDir, file), { recursive: true, force: true });
        }))

        await Promise.all(randomFiles.map(async file => {
            await fs.rm(path.join(outDir, file), { recursive: true, force: true });
        }))

        const remainingFiles = await fs.readdir(outDir);
        if (remainingFiles.length === 0) {
            throw Error('no files uploaded!');
        }

    } catch (error : any) {
        console.error('Error uploading files:', error.message);
        throw Error(`Error uploading files: ${error.message}`);
    } finally {
        await fs.unlink(zipFilePath);
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

    } catch (error: any) {
        res.status(400).json({ message: `${error.message}` })
    }
}

//@desc     fetch a random question
//@route    GET /api/questions/:id
//@access   authenticated users
export const fetchARandomQuestion = async (req : any, res : any) => {
    const { from, to } = req.body;

    if (from === undefined || to === undefined) {
        console.log(req.body);
        return res.status(400).json({ message: 'Please enter all fields' })
    }

    try {
      // function provided by mongoose to find an Question document with a given ID
      // req.params.id is retrieved from /:id in route
      const questions = await Question.aggregate([
        { $match: { difficulty: { $gte: from, $lte: to } } },
        { $sample: { size: 1 } },
      ]);
      /*.find({
          $where: `this.difficulty >= ${from} && this.difficulty <= ${to}`,
        });*/

      if (questions.length === 0) {
        throw Error("Question not found in database.");
      }
      res.status(200).json({
        id: questions[0]._id,
      });
    } catch (error) {
        res.status(400).json({ message: 'Question not found in database.' })
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
        
        const question = await Question.create({
            id, title, description, topics, difficulty
        })

        await handleTestCaseUpload(question._id.toString(), req.file.path);

        res.status(201).json({
            id : question.id,
            _id: question._id,
            title: question.title,
            description: question.description,
            topics: question.topics,
            difficulty: question.difficulty
        })
    } catch (error : any) {
        res.status(400).json({ message: `Invalid question data: ${error.message}`})
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
            await handleTestCaseUpload(req.params.id, req.file.path);
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
    } catch (error : any) {
        res.status(400).json({ message: error.message})
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
      if (question === null) {
        throw Error("Invalid ID. Question not found in database.");
      }

      const testcases = `/app/question_test_cases/${question._id}/`;
      if (fs.existsSync(testcases)) {
        await fs.rm(testcases, { recursive: true });
      }
      await question.deleteOne();
      res.status(200).json({ message: "Question removed" });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
}