import { redirect, LoaderFunction } from "react-router-dom";
import {
  HStack,
  VStack,
  Box,
  Center,
  Select,
  Button,
  Wrap,
  WrapItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Skeleton,
} from "@chakra-ui/react";
import { Question } from "../../models/Question.model";
import { QnDrawer } from "../../components/QnDrawer/QnDrawer.component";

import "./ViewQuestion.page.css";
import store from "../../reducers/store";
import { loadQuestions } from "../../data/sampleqn";
import { fetchQuestion } from "../../api/questions";
import CollabEditor from "../../components/CollabEditor/CollabEditor.component";
import { useContext } from "react";
import {
  SharedEditorContext,
  SharedEditorProvider,
  language,
  langList,
  LangDataMap,
} from "../../contexts/sharededitor.context";
import QnSubmissionHistory from "../../components/QnSubmissionHistory/QnSubmissionHistory.component";
import ChatBox from "../../components/ChatBox/ChatBox.component";
import { ChevronDownIcon } from "@chakra-ui/icons";

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

const loadingSkeleton = () => {
  return (
    <HStack className="fit-parent" padding={2.5}>
      <VStack className="fit-parent" gap="1">
        <Skeleton width="100%" height="5%" speed={0.9}></Skeleton>
        <Skeleton width="100%" height="95%" speed={1}></Skeleton>
      </VStack>
      <VStack h="100%" w="30%">
        <Skeleton className="fit-parent" speed={1.1}></Skeleton>
        <Skeleton className="fit-parent" speed={1.2}></Skeleton>
        <Skeleton height="10%" width="100%" speed={1.3}></Skeleton>
      </VStack>
    </HStack>
  );
};

const InnerViewQuestion = () => {
  const {
    qn,
    lang,
    replaceCode,
    changeLang,
    currSubmission,
    submitCode,
    ycode,
  } = useContext(SharedEditorContext);

  return (
    <>
      {qn ? <QnDrawer question={qn} size="xl" /> : <></>}
      {!(lang && ycode) ? (
        loadingSkeleton()
      ) : (
        <HStack className="fit-parent" padding={2.5}>
          <VStack className="fit-parent" gap="1">
            <Wrap width="100%" rowGap={1} height="5%">
              <WrapItem>
                <Select
                  size="sm"
                  value={lang}
                  onChange={(e) =>
                    changeLang(e.currentTarget.value as language)
                  }
                >
                  {langList.map((key) => {
                    return (
                      <option value={key} key={key}>
                        {LangDataMap[key].repr}
                      </option>
                    );
                  })}
                </Select>
              </WrapItem>
              <WrapItem>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    size="sm"
                  >
                    Templates
                  </MenuButton>
                  <MenuList>
                    {LangDataMap[lang].template.map(([topic, data]) => (
                      <MenuItem key={topic} onClick={() => replaceCode(data)}>
                        {topic}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </WrapItem>
            </Wrap>
            <Box width="100%" height="95%" boxShadow="lg">
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
        </HStack>
      )}
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
