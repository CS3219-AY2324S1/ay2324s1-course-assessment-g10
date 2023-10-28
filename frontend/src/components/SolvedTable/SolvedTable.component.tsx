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
} from "@chakra-ui/react";
import { Paginator } from "../Paginator/Paginator.component";
import { SolvedQuestion } from "../../models/SolvedQuestion.model";
import { fetchUserCompletedQuestions } from "../../api/user"; // Import your API function

export type TableProp = {
  userId: number;
  pageSize?: number;
};

export const SolvedTable = (props: TableProp) => {
  const { userId, pageSize = 10 } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [solvedQuestions, setSolvedQuestions] = useState<SolvedQuestion[]>([]);

  const onPageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  useEffect(() => {
  const loadSolvedQuestions = async () => {
    if (userId) {
      try {
        const data = await fetchUserCompletedQuestions(userId);
        setSolvedQuestions(data);
      } catch (error) {
        console.error("Failed to fetch solved questions:", error);
      }
    }
  };

    loadSolvedQuestions();
  }, [userId]);

  const getQuestionsForPage = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return solvedQuestions.slice(startIndex, startIndex + pageSize);
  };

  return (
    <TableContainer width="100%">
      <Table
        variant="striped"
        backgroundColor={"white"}
        size="md"
        boxShadow="md"
        transition="box-shadow 0.2s"
        _hover={{
          boxShadow: "xl",
        }}
        width="60%"
        sx={{ tableLayout: "fixed" }}
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
            <Th colSpan={4}>Completed Questions</Th>
          </Tr>
          <Tr>
            <Th>Question</Th>
            <Th>Topics</Th>
            <Th isNumeric>Difficulty</Th>
            <Th isNumeric>Solved Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {getQuestionsForPage().map((question) => (
            <Tr key={question._id}>
              <Td>{question.title}</Td>
              <Td>{question.topics.join(", ")}</Td>
              <Td isNumeric>{question.difficulty}</Td>
              <Td isNumeric>
                {question.solvedDate
                  ? new Date(question.solvedDate).toLocaleDateString()
                  : "Not Available"}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
