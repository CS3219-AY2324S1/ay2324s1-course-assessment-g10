import { useLoaderData, useNavigate } from "react-router-dom";
import { QuestionEditor } from "../../components/QuestionEditor/QuestionEditor.component";
import { Question } from "../../models/Question.model";
import { modifyQuestion } from "../../reducers/questionsSlice";
import { useDispatch } from "react-redux";
import { updateQuestion } from "../../api/questions";

const EditQuestion = () => {
  const qn = useLoaderData() as Question;
  const nav = useNavigate();
  const dispatch = useDispatch();

  const updateQnDev = async (qn: Question) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network api call
    dispatch(modifyQuestion(qn));
    nav(-1);
  };

  const updateQn = async (qn : Question) => {
    const updatedQn : Question = await updateQuestion(qn._id, qn);
    dispatch(modifyQuestion(updatedQn));
    nav(-1);
  } 

  return (
    <QuestionEditor
      question={qn}
      onSubmit={process.env.ENV_TYPE === 'prod' ? updateQn : updateQnDev}
      onCancel={() => nav(-1)}
    />
  );
};

export default EditQuestion;
