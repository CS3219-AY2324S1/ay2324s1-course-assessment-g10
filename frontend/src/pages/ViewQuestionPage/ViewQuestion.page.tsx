import { redirect, LoaderFunction, useLoaderData } from "react-router-dom";
import { HStack, VStack, Box, Heading, Center } from "@chakra-ui/react";
import { dummyQnLookup } from "../../data/sampleqn";
import { Question } from "../../models/Question.model";
import { QnDrawer } from "../../components/QnDrawer/QnDrawer.component";

import "./ViewQuestion.page.css";

export const qnLoader: LoaderFunction<Question> = async ({ params }) => {
  if (!params.id || !dummyQnLookup.has(params.id)) {
    return redirect("/");
  }

  return dummyQnLookup.get(params.id);
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
