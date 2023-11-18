import Question from '../model/questionModel';
import { questions } from './question_data';
import { getNextSequenceValue } from '../controller/counterController';


/**
 * Populates the database if questions dont exist
 */
export async function populateData() {
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

  } catch (error : any) {
    console.log(`Populating questions ran into error: ${error.message}`);
  }
}
