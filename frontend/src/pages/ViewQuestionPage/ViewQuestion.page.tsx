import {
  redirect,
  LoaderFunction,
  useLoaderData,
  Navigate,
} from "react-router-dom";
import {
  HStack,
  VStack,
  Box,
  Heading,
  Center,
  useToast,
} from "@chakra-ui/react";
import { Question } from "../../models/Question.model";
import { QnDrawer } from "../../components/QnDrawer/QnDrawer.component";

import "./ViewQuestion.page.css";
import store, { RootState } from "../../reducers/store";
import { loadQuestions } from "../../data/sampleqn";
import { fetchAllQuestions, fetchQuestion } from "../../api/questions";
import { useMatchmake } from "../../contexts/matchmake.context";
import CollabEditor from "../../components/CollabEditor/CollabEditor.component";
import { useEffect, useState } from "react";
import { setQuestions } from "../../reducers/questionsSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

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

const ViewQuestion = ({ collab = false }: { collab?: boolean }) => {
  const urlqn = useLoaderData() as Question;
  const { matchedRoom } = useMatchmake();
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    if (collab) {
      if (process.env.REACT_APP_ENV_TYPE !== "prod") {
        loadQuestions();
      } else {
        fetchAllQuestions()
          .then((questions: Question[]) => {
            dispatch(setQuestions(questions));
          })
          .catch((err) => {
            console.log(err.message);
            toast({
              title: "Error",
              description: err.message,
              status: "error",
            });
          });
      }
    }
  }, []);

  const qn = useSelector((state: RootState) => {
    if (!collab) return urlqn;
    return state.questions.originalQuestions.find(
      (q) => matchedRoom?.qn === q._id.toString()
    );
  });

  return (
    <>
      {qn ? <QnDrawer question={qn} size="xl" /> : <></>}
      <HStack className="fit-parent">
        <Box backgroundColor="red.100" className="fit-parent">
          <CollabEditor isCollab={collab}></CollabEditor>
        </Box>
        <VStack h="100%" w="30%">
          <Box backgroundColor="blue.300" className="fit-parent">
            <Center>
              <Heading>Stdin</Heading>
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

export default ViewQuestion;
