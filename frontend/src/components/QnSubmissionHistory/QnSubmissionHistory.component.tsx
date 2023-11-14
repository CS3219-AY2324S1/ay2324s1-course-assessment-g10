import {
  Box,
  Center,
  HStack,
  IconButton,
  Skeleton,
  SkeletonText,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import {
  SubmissionResult,
  submissionRecord,
  useSharedEditor,
} from "../../contexts/sharededitor.context";
import { CheckIcon, CloseIcon, CopyIcon } from "@chakra-ui/icons";

const SubmissionRow = ({
  submission,
  progress,
}: {
  submission: submissionRecord;
  progress?: SubmissionResult;
}) => {
  const isLoading = submission.result === "Unknown";
  const isCorrect = submission.result === "Accepted";
  const colorScheme = isLoading ? "gray" : isCorrect ? "teal" : "red";

  return (
    <Tr>
      <Td>
        <Center>
          <Tooltip label={submission.result}>
            <IconButton
              isLoading={isLoading}
              isRound={true}
              variant="solid"
              colorScheme={colorScheme}
              aria-label="results_icon"
              size="xs"
              icon={isCorrect ? <CheckIcon /> : <CloseIcon />}
              _hover={{}}
              _active={{}} // disables click/hover effect
              zIndex={0}
            />
          </Tooltip>
        </Center>
      </Td>
      <Td>
        <Center>
          {submission.lang}
          {progress ? ` (${progress.evaluated}/${progress.total})` : ""}
        </Center>
      </Td>
      <Td>
        <Center>
          <IconButton
            aria-label="copy"
            icon={<CopyIcon />}
            onClick={() => navigator.clipboard.writeText(submission.code)}
            size="sm"
          />
        </Center>
      </Td>
    </Tr>
  );
};

const SubmissionRowSkeleton = () => {
  return (
    <Stack width="100%">
      <Skeleton height="20px" speed={0.9} />
      <Skeleton height="40px" speed={1} />
      <Skeleton height="40px" speed={1.1} />
      <Skeleton height="40px" speed={1.2} />
    </Stack>
  );
};

const QnSubmissionHistory = () => {
  const { currSubmission, submissions, submissionLoading, submissionResult } =
    useSharedEditor();
  if (submissionLoading) {
    return <SubmissionRowSkeleton />;
  }

  if (submissions.length === 0 && !currSubmission) {
    return <Text>No Submissions found!</Text>;
  }

  return (
    <Box overflowY="auto" maxHeight="40vh" w="100%" boxShadow="base">
      <Table variant="striped" size="sm" height="100%" overflow="scroll">
        <Thead
          position="sticky"
          top={0}
          bg="gray.200"
          zIndex="1"
          boxShadow="base"
        >
          <Tr>
            <Th>Judgement</Th>
            <Th>Language</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {submissions.map((s, i) => (
            <SubmissionRow submission={s} key={i} />
          ))}
          {currSubmission ? (
            <SubmissionRow
              submission={currSubmission}
              progress={submissionResult ? submissionResult : undefined}
            />
          ) : (
            <></>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default QnSubmissionHistory;
