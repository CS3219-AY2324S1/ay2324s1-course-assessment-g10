import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { QuestionEditor } from "../../components/QuestionEditor/QuestionEditor.component";
import { SolvedTable } from "../../components/SolvedTable/SolvedTable.component";
import { fetchUserId } from "../../api/user"; 

function HomePage() {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the user ID dynamically using fetchUserId
    fetchUserId()
      .then((id) => {
        if (id !== null) {
          setUserId(id);
        }
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
