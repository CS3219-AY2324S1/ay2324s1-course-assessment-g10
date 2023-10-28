const Question = require('../model/questionModel');
const questions = require('./question_data');
const getNextSequenceValue = require('../controller/counterController')

/**
 * Populates the database if questions dont exist
 */
async function populateData() {
  try {
    for (const question of questions) {
      
      const existingQuestion = await Question.findOne({ title: question.title });

      if (!existingQuestion) {
        const id = await getNextSequenceValue('questionIndex');
        question.id = id;
        await Question.create(question);
        console.log(`Question inserted successfully: ${question.title}`);
      } else {
        console.log(`Question already exists, cancelling populate`);
        break;
      }
    }

    console.log('Questions population completed.');

  } catch (error) {
    console.log(`Populating questions ran into error: ${error.message}`);
  }
}

module.exports = populateData;