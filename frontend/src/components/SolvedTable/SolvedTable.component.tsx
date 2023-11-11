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
import { useProfile } from "../../contexts/profileContext";

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
