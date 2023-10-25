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
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  Tag,
  Wrap,
  WrapItem,
  IconButton,
  ButtonGroup,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { MarkdownEditor } from "../MarkdownEditor/MarkdownEditor.component";
import { CloseableTag } from "../CloseableTag/CloseableTag.component";
import { diffToScheme } from "../../helper/UIHelper";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

type QuestionEditorProp = {
  question?: Question;
  onSubmit?: (question: Question) => Promise<void>;
  onCancel?: () => void;
};

export const QuestionEditor = (prop: QuestionEditorProp) => {
  const {
    question,
    onSubmit = async (x) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw Error('no action defined for Question Editor onSubmit')
    },
  } = prop;

  const [title, setTitle] = useState(question?.title ?? "");
  const [description, setDescription] = useState(question?.descMd ?? "");
  const [difficulty, setDifficulty] = useState(question?.difficulty ?? 0.1);
  const [topics, setTopics] = useState(question?.topics ?? []);
  const [type, setType] = useState("");
  const [highlightTopic, setHighlightTopic] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const addTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();
    const txt = type.trim();
    if (!txt) return;

    if (topics.includes(txt)) {
      setHighlightTopic(txt);
      return;
    }

    setHighlightTopic("");
    setTopics([...topics, type]);
    setType("");
  };

  /**
   * Checks if a question is valid. A question is valid if title, description and topics are not empty.
   * @returns boolean
   */
  const checkValid = () => {
    return title.length > 0 && description.length > 0 && topics.length > 0;
  };

  const buildQuestion = () => {
    return new Question(
      question?._id ?? '',
      question?.id ?? -1,
      title,
      description,
      topics,
      difficulty
    );
  };

  const onSubmitPressed = async () => {
    if (!checkValid()) {
      toast({
        title: "Invalid Question",
        status: "error",
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(buildQuestion());
      console.log("Submit success!");
    } catch (err : any) {
      toast({
        title: "Creation/Modification of question has failed!",
        description: err.message,
        status: "error",
        isClosable: false,
      });
    } 

    setIsSubmitting(false);
  };

  return (
    <Box padding="10" height="100%" width="100%">
      <HStack alignItems="center" justify="space-between">
        <Heading size="md">
          {question ? "Edit Question" : "Create Question"}
        </Heading>
        <ButtonGroup gap="0.1" size="sm">
          <Tooltip label="Submit">
            <IconButton
              isLoading={isSubmitting}
              colorScheme="green"
              aria-label="Submit"
              icon={<CheckIcon />}
              onClick={onSubmitPressed}
            />
          </Tooltip>
          <Tooltip label={question ? "Discard Changes" : "Cancel"}>
            <IconButton
              isDisabled={isSubmitting}
              colorScheme="red"
              aria-label="Cancel"
              icon={<CloseIcon />}
              onClick={prop.onCancel}
            />
          </Tooltip>
        </ButtonGroup>
      </HStack>
      <Divider />
      <HStack height="80%" spacing="2">
        <FormControl height="100%" p="2" isDisabled={isSubmitting}>
          <FormLabel htmlFor="name">Question Name</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <FormLabel paddingTop="4">
            Difficulty:
            <Tag marginLeft="2" colorScheme={diffToScheme(difficulty)}>
              {difficulty}
            </Tag>
          </FormLabel>
          <Slider
            aria-label="slider-ex-1"
            defaultValue={difficulty}
            onChange={setDifficulty}
            min={0.1}
            max={10}
            step={0.1}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <FormLabel paddingTop="4">Question Type</FormLabel>
          <Input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            onKeyDown={addTopic}
          />
          <Wrap width="100%" paddingTop="3">
            {topics.map((t, i) => (
              <WrapItem>
                <CloseableTag
                  key={i}
                  isDisabled={isSubmitting}
                  isCloseable={!isSubmitting}
                  onClose={() => {
                    setTopics(topics.filter((x) => x !== t));
                  }}
                  boxShadow={highlightTopic === t ? "outline" : ""}
                >
                  {t}
                </CloseableTag>
              </WrapItem>
            ))}
          </Wrap>

          <FormLabel paddingTop="4">Input Files</FormLabel>
          <Input type="file" aria-hidden="true" accept=".zip" />
          <FormLabel paddingTop="4">Output Files</FormLabel>
          <Input type="file" aria-hidden="true" accept=".zip" />
        </FormControl>
        <Box width="100%" height="100%" overflow="auto">
          <MarkdownEditor onChange={setDescription} markdown={description} />
        </Box>
      </HStack>
    </Box>
  );
};
