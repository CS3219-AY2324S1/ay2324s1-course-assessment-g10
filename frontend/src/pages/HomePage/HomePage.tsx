import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar/ProgressBar.component";
import { QuestionEditor } from "../../components/QuestionEditor/QuestionEditor.component";
import { SolvedTable } from "../../components/SolvedTable/SolvedTable.component";
import { selectUser } from "../../reducers/authSlice";
import { useSelector } from "react-redux";
import { ProfileProvider } from "../../contexts/profileContext";
import { Box } from "@chakra-ui/react";

function HomePage() {
  // Use the useSelector hook to access the user from the Redux store
  const user = useSelector(selectUser);

  if (user === null) {
    return (
      <div>
        <QuestionEditor />
      </div>
    );
  }

  // At this point, you're sure that user is not null
  return (
    <div>
      <ProfileProvider displayedUser={user}>
        <Box padding={3}>
          <ProgressBar />
          <SolvedTable pageSize={3} />
        </Box>
      </ProfileProvider>
    </div>
  );
}

export default HomePage;
