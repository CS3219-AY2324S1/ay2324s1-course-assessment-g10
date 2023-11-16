import { redirect, LoaderFunction } from "react-router-dom";
import { Question } from "../../models/Question.model";
import { QnDrawer } from "../../components/QnDrawer/QnDrawer.component";

import "./ViewQuestion.page.css";
import store from "../../reducers/store";
import { loadQuestions } from "../../data/sampleqn";
import { fetchQuestion } from "../../api/questions";
import { useContext } from "react";
import {
  SharedEditorContext,
  SharedEditorProvider,
} from "../../contexts/sharededitor.context";

export const qnLoader: LoaderFunction<Question> = async ({ params }) => {
  if (!params._id) {
    return redirect("/");
  }

  let qn: Question | undefined;

  if (process.env.REACT_APP_ENV_TYPE === "prod") {
    qn = await fetchQuestion(params._id);
  } else {
    await loadQuestions();
    qn = store
      .getState()
      .questions.originalQuestions.find(
        (qn) => qn._id.toString() === params._id
      );
  }
  return qn ?? redirect("/");
};

const InnerViewQuestion = () => {
  const { qn } = useContext(SharedEditorContext);

  return <>{qn ? <QnDrawer question={qn} size="xl" /> : <></>}</>;
};

const ViewQuestion = () => {
  return (
    <SharedEditorProvider>
      <InnerViewQuestion />
    </SharedEditorProvider>
  );
};

export default ViewQuestion;
