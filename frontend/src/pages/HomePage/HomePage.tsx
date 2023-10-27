import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Question, initializeData } from "../AddQuestionPage/QuestionData";
import { QuestionEditor } from "../../components/QuestionEditor/QuestionEditor.component";
import { SolvedTable } from "../../components/SolvedTable/SolvedTable.component"
import { sampleSolvedQuestions } from "../../data/sampleqn";

function HomePage() {
  let history = useNavigate();
  const [QuestionData, setQuestionData] = useState(initializeData());
  const [userId, setUserId] = useState(null); // Initialize userId as null

  useEffect(() => {
    // Fetch the userId dynamically from your API or data source
    // Example API call to fetch userId
    fetch("http://localhost:8000/api/get-user-id")
      .then((response) => response.json())
      .then((data) => {
        setUserId(data.userId);
      })
      .catch((error) => {
        console.error("Error fetching userId: ", error);
      });
  }, []); // Empty dependency array to run this effect only once

  return (
    <div>
      <QuestionEditor />
      {userId !== null && <SolvedTable userId={userId} />} {/* Render SolvedTable when userId is available */}
    </div>
  );
}

export default HomePage;
