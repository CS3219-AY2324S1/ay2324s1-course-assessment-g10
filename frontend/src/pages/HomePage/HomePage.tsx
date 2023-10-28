import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { QuestionEditor } from "../../components/QuestionEditor/QuestionEditor.component";
import { SolvedTable } from "../../components/SolvedTable/SolvedTable.component";

function HomePage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the user ID dynamically from your API or data source
    fetch("http://localhost:8000/api/get-user-id")
      .then((response) => response.json())
      .then((data) => {
        setUserId(data.userId);
      })
      .catch((error) => {
        console.error("Error fetching user ID: ", error);
      });
  }, []);

  return (
    <div>
      <QuestionEditor />
      {userId !== null && <SolvedTable userId={userId} pageSize={4} />} {/* Render SolvedTable when userId is available */}
    </div>
  );
}

export default HomePage;
