import { redirect, LoaderFunction, useLoaderData } from "react-router-dom";
import {
  HStack,
  VStack,
  Box,
  Heading,
  Center,
  useToast,
  Select,
} from "@chakra-ui/react";
import { Question } from "../../models/Question.model";
import { QnDrawer } from "../../components/QnDrawer/QnDrawer.component";

import "./ViewQuestion.page.css";
import store, { RootState } from "../../reducers/store";
import { loadQuestions } from "../../data/sampleqn";
import { fetchAllQuestions, fetchQuestion } from "../../api/questions";
import { useMatchmake } from "../../contexts/matchmake.context";
import CollabEditor from "../../components/CollabEditor/CollabEditor.component";
import { useContext, useEffect, useState } from "react";
import { setQuestions } from "../../reducers/questionsSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  SharedEditorContext,
  SharedEditorProvider,
} from "../../contexts/sharededitor.context";
import QnSubmissionHistory from "../../components/QnSubmissionHistory/QnSubmissionHistory.component";

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
  const { qn, chat } = useContext(SharedEditorContext);
  return (
    <>
      {qn ? <QnDrawer question={qn} size="xl" /> : <></>}
      <HStack className="fit-parent" padding={2.5}>
        <VStack className="fit-parent" gap="2">
          <Select>
            <option value="C++17">C++ 17</option>
            <option value="Python3">Python3</option>
            <option value="Java">Java</option>
          </Select>
          <Box width="100%" height="95%">
            <CollabEditor />
          </Box>
        </VStack>
        <VStack h="100%" w="30%">
          <Box className="fit-parent">
            <Center>
              <QnSubmissionHistory />
            </Center>
          </Box>
          <Box backgroundColor="blue.300" className="fit-parent">
            <Center>
              <Heading>stdout/stderr</Heading>
            </Center>
          </Box>
          <Box backgroundColor="blue.300" h="10%" w="100%">
            <Center>
              <Heading>Submit/try</Heading>
            </Center>
          </Box>
        </VStack>
      </HStack>
    </>
  );
};

const ViewQuestion = () => {
  return (
    <SharedEditorProvider>
      <InnerViewQuestion />
    </SharedEditorProvider>
  );
};

export default ViewQuestion;
