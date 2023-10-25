import { useNavigate } from "react-router-dom";
import { QuestionEditor } from "../../components/QuestionEditor/QuestionEditor.component";
import { Question } from "../../models/Question.model";
import { addQuestions } from "../../reducers/questionsSlice";
import { getUnusedId } from "../../data/sampleqn";
import { useDispatch } from "react-redux";

const tryAddQuestion = async (qn: Question) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network api call

  return getUnusedId();
};

const CreateQuestion = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const trySubmit = async (qn: Question) => {
    const id = await tryAddQuestion(qn);
    if (id > -1) {
      qn.setId(id);
      dispatch(addQuestions([qn]));
      nav(-1);
    }
    return id;
  };
  return <QuestionEditor onSubmit={trySubmit} onCancel={() => nav(-1)} />;
};

export default CreateQuestion;
