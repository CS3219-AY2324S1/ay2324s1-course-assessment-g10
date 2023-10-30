import { redirect, LoaderFunction, useLoaderData } from "react-router-dom";
import {
  HStack,
  VStack,
  Box,
  Heading,
  Center,
  useToast,
  Select,
  Button,
} from "@chakra-ui/react";
import { Question } from "../../models/Question.model";
import { QnDrawer } from "../../components/QnDrawer/QnDrawer.component";

import "./ViewQuestion.page.css";
import store from "../../reducers/store";
import { loadQuestions } from "../../data/sampleqn";
import { fetchQuestion } from "../../api/questions";
import { useMatchmake } from "../../contexts/matchmake.context";
import CollabEditor from "../../components/CollabEditor/CollabEditor.component";
import { useContext } from "react";
import {
  LanguageData,
  SharedEditorContext,
  SharedEditorProvider,
  language,
} from "../../contexts/sharededitor.context";
import QnSubmissionHistory from "../../components/QnSubmissionHistory/QnSubmissionHistory.component";
import ChatBox from "../../components/ChatBox/ChatBox.component";

import Landing from "../../components/CodeEditor/components/Landing"

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
  const { qn, chat, lang, changeLang, currSubmission, submitCode } =
    useContext(SharedEditorContext);
  return (
    <>
      {qn ? <QnDrawer question={qn} size="xl" /> : <></>}
      <HStack className="fit-parent" padding={2.5}>
        <VStack className="fit-parent" gap="2">
          <Select
            defaultValue={lang}
            onChange={(e) => changeLang(e.currentTarget.value as language)}
          >
            {LanguageData.map((data) => (
              <option value={data.lang} key={data.lang}>
                {data.repr}
              </option>
            ))}
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
          <Box className="fit-parent">
            <Center>
              <ChatBox />
            </Center>
          </Box>
          <Box h="10%" w="100%">
            <Center>
              <Button
                w="100%"
                colorScheme="teal"
                isLoading={!!currSubmission}
                onClick={submitCode}
              >
                Submit
              </Button>
            </Center>
          </Box>
        </VStack>
      </HStack> */}
      <Landing />
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
