import { useNavigate } from "react-router-dom";
import { QuestionEditor } from "../../components/QuestionEditor/QuestionEditor.component";
import { Question } from "../../models/Question.model";
import { addQuestions } from "../../reducers/questionsSlice";
import { getUnusedId } from "../../data/sampleqn";
import { useDispatch } from "react-redux";
import { addQuestion } from "../../api/questions";

const tryAddQuestion = async (qn: Question) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network api call

  return getUnusedId();
};

const CreateQuestion = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  //dummy function for use in dev environment
  const trySubmitDev = async (qn: Question) => {
    const id = await tryAddQuestion(qn);
    if (id > -1) {
      qn.setId(id);
      dispatch(addQuestions([qn]));
      nav(-1);
      return;
    }

    throw Error('dev: failed to add');
  };

  //actual submit function that calls the API
  const trySubmit = async (qn: Question) => {
    try {
      const questionFromResponse : Question = await addQuestion(qn);

      dispatch(addQuestions([questionFromResponse]));
      nav(-1);
      
    } catch (error) {
      throw error;
    }
  }

  return <QuestionEditor onSubmit={process.env.REACT_APP_ENV_TYPE === 'prod' ? trySubmit : trySubmitDev} onCancel={() => nav(-1)} />;
};

export default CreateQuestion;
