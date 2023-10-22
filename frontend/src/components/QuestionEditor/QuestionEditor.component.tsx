import { useState } from "react";
import { Question } from "../../models/Question.model";
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  VStack,
  FormHelperText,
  InputGroup,
} from "@chakra-ui/react";
import { MarkdownEditor } from "../MarkdownEditor/MarkdownEditor.component";
import { CloseableTag } from "../CloseableTag/CloseableTag.component";

type QuestionEditorProp = {
  question?: Question;
  onSubmit?: (question: Question) => number | string;
};

export const QuestionEditor = (prop: QuestionEditorProp) => {
  const { question, onSubmit = (x) => -1 } = prop;

  const [title, setTitle] = useState(question?.title ?? "");
  const [description, setDescription] = useState(question?.descMd ?? "");
  const [difficulty, setDifficulty] = useState(question?.difficulty ?? 0);
  const [topics, setTopics] = useState(question?.topics ?? []);

  return (
    <Box padding="10" height="100%" width="100%">
      <Heading size="md">
        {question ? "Edit Question" : "Create Question"}
      </Heading>
      <Divider />
      <HStack height="80%" spacing="2">
        <FormControl>
          <FormLabel htmlFor="email">Question Name</FormLabel>
          <InputGroup>
            <Input
              type="email"
              id="email"
              aria-describedby="email-helper-text"
            />
          </InputGroup>
        </FormControl>
        <Box width="100%" height="100%" overflow="auto">
          <MarkdownEditor />
        </Box>
      </HStack>
    </Box>
  );
};
