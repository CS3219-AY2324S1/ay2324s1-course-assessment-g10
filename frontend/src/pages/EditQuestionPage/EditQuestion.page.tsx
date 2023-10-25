import { useLoaderData, useNavigate } from "react-router-dom";
import { QuestionEditor } from "../../components/QuestionEditor/QuestionEditor.component";
import { Question } from "../../models/Question.model";
import { modifyQuestion } from "../../reducers/questionsSlice";
import { useDispatch } from "react-redux";

const EditQuestion = () => {
  const qn = useLoaderData() as Question;
  const nav = useNavigate();
  const dispatch = useDispatch();

  const updateQn = async (qn: Question) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network api call
    dispatch(modifyQuestion(qn));
    nav(-1);
    return 1;
  };

  return (
    <QuestionEditor
      question={qn}
      onSubmit={updateQn}
      onCancel={() => nav(-1)}
    />
  );
};

export default EditQuestion;
