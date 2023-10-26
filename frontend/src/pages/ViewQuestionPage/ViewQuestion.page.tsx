import { redirect, LoaderFunction, useLoaderData } from "react-router-dom";
import { HStack, VStack, Box, Heading, Center } from "@chakra-ui/react";
import { Question } from "../../models/Question.model";
import { QnDrawer } from "../../components/QnDrawer/QnDrawer.component";

import "./ViewQuestion.page.css";
import store from "../../reducers/store";
import { loadQuestions } from "../../data/sampleqn";
import { fetchQuestion } from "../../api/questions";

export const qnLoader: LoaderFunction<Question> = async ({ params }) => {
  if (!params._id) {
    return redirect("/");
  }
  
  let qn : Question | undefined;

  if (process.env.ENV_TYPE === 'prod') {
    qn = await fetchQuestion(params._id)
  } else {
    await loadQuestions();    
    qn = store
        .getState()
        .questions.originalQuestions.find((qn) => qn._id.toString() === params._id);
  }
return qn ?? redirect("/");
};

const ViewQuestion = () => {
  const qn = useLoaderData() as Question;

  return (
    <>
      <QnDrawer question={qn} size="xl" />
      <HStack className="fit-parent">
        <Box backgroundColor="blue.300" className="fit-parent">
          <Center>
            <Heading>editor</Heading>
          </Center>
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
