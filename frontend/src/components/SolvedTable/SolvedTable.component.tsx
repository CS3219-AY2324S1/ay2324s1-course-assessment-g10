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
import { Question } from "../../models/Question.model";

export type TableProp = {
  userId: number; // Add userId prop to specify the user whose solved questions to fetch
  pageSize?: number;
};

export const SolvedTable = (props: TableProp) => {
  const { userId, pageSize = 10 } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [solvedQuestions, setSolvedQuestions] = useState<Question[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const onPageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchSolvedQuestions = async (): Promise<void> => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:8000/api/users/${userId}/questions`);
          if (response.ok) {
            const data = await response.json();
            setSolvedQuestions(data);
            setIsLoaded(true);
          } else {
            console.error("Failed to fetch solved questions");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (!isLoaded) {
      fetchSolvedQuestions().catch((error) => {
        console.error(error);
      });
    }
  }, [userId, isLoaded]);

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
            <Th>Topic</Th>
            <Th isNumeric>Difficulty</Th>
            <Th isNumeric>Solved Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {getQuestionsForPage().map((question) => (
            <Tr key={question.id}>
              <Td>{question.displayedQuestion}</Td>
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

export default SolvedTable;
