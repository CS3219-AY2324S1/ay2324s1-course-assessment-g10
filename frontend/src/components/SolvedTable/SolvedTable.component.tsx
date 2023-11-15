import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Center,
  TableContainer,
  HStack,
  Tag,
  Heading,
  IconButton,
  Text,
  Flex,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { Paginator } from "../Paginator/Paginator.component";
import { useProfile } from "../../contexts/profileContext";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { rangeToScheme } from "../../helper/DifficultyFilterHelper";

export type TableProp = {
  pageSize?: number;
};

export const SolvedTable = (props: TableProp) => {
  const { pageSize = 10 } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const { solvedQuestions } = useProfile();

  const onPageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const getQuestionsForPage = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return solvedQuestions.slice(startIndex, startIndex + pageSize);
  };

  if (solvedQuestions.length === 0)
    return (
      <Center paddingTop={2}>
        <Heading size="md">You have no past submissions!</Heading>
      </Center>
    );

  return (
    <TableContainer width="100%" paddingTop={2}>
      <Table
        variant="striped"
        backgroundColor={"white"}
        size="md"
        boxShadow="md"
        transition="box-shadow 0.2s"
        _hover={{
          boxShadow: "xl",
        }}
        width="100%"
        sx={{ tableLayout: "auto" }}
      >
        <TableCaption>
          <Center>
            <Paginator
              adjacent={1}
              page={currentPage}
              totalPages={Math.ceil(solvedQuestions.length / pageSize)}
              onPageChange={onPageChange}
            />
          </Center>
        </TableCaption>
        <Thead>
          <Tr>
            <Th colSpan={4}>Recent Submissions</Th>
          </Tr>
          <Tr>
            <Th>Question</Th>
            <Th>Topics</Th>
            <Th>
              <Center>Difficulty</Center>
            </Th>
            <Th>
              <Center>Submission Date</Center>
            </Th>
            <Th>
              <Center>Verdict</Center>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {getQuestionsForPage().map((question, i) => (
            <Tr key={i}>
              <Td>{question.title}</Td>
              <Td>
                <HStack spacing={1}>
                  {question.topics.map((qntype) => (
                    <Tag colorScheme="blue">{qntype}</Tag>
                  ))}
                </HStack>
              </Td>
              <Td>
                <Center>
                  <Tag colorScheme={rangeToScheme(question.difficulty)}>
                    {question.difficulty}
                  </Tag>
                </Center>
              </Td>
              <Td>
                <Center>
                  {question.solvedDate
                    ? new Date(question.solvedDate).toLocaleDateString()
                    : "Not Available"}
                </Center>
              </Td>
              <Td>
                <Tooltip label={question.verdict}>
                  <Center>
                    <IconButton
                      isRound={true}
                      variant="solid"
                      colorScheme={question.solved ? "green" : "red"}
                      aria-label="results_icon"
                      size="xs"
                      icon={question.solved ? <CheckIcon /> : <CloseIcon />}
                      _hover={{}}
                      _active={{}} // disables click/hover effect
                    />
                  </Center>
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
