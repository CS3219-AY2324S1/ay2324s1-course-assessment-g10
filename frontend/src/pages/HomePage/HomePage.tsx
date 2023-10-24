import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Question, initializeData } from "../AddQuestionPage/QuestionData";
import { QuestionEditor } from "../../components/QuestionEditor/QuestionEditor.component";
import { SolvedTable } from "../../components/SolvedTable/SolvedTable.component"
import { sampleSolvedQuestions } from "../../data/sampleqn";

function HomePage() {
  let history = useNavigate();

  const [QuestionData, setQuestionData] = useState(initializeData());

  return (
    <div>
 
      <QuestionEditor></QuestionEditor>
      <SolvedTable questions={sampleSolvedQuestions} /> {/* Render the SolvedTable component */}
      
    </div>
  );
}

export default HomePage;
