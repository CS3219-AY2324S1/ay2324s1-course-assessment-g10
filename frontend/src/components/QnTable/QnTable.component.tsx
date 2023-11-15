import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  TableContainer,
  Center,
} from "@chakra-ui/react";
import { Paginator } from "../Paginator/Paginator.component";
import { Question } from "../../models/Question.model";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../../reducers/authSlice";
import { QuestionEntry } from "./QuestionEntry.component";

export type TableProp = {
  filteredQn: Question[];
  pageSize?: number;
};


export function QnTable(pp: TableProp) {
  const { filteredQn, pageSize = 10 } = pp;
  const [pageNumber, changePage] = useState(1);
  const isAdmin = useSelector(selectIsAdmin);

  const getCurrentPage = (x: number) => {
    return filteredQn.slice(
      (x - 1) * pageSize,
      Math.min(x * pageSize, filteredQn.length)
    );
  };

  const onPageChange = (x: number) => {
    changePage(x);
  };

  return (
    <>
      <TableContainer width="100%">
        <Center>
          <Table
            variant="striped"
            backgroundColor="white"
            size="md"
            boxShadow="md"
            transition="box-shadow 0.2s"
            _hover={{
              boxShadow: "xl",
            }}
            width="80%"
            sx={{ tableLayout: "auto" }}
          >
            <TableCaption>
              <Center>
                <Paginator
                  adjacent={1}
                  page={pageNumber}
                  totalPages={Math.ceil(filteredQn.length / pageSize)}
                  onPageChange={onPageChange}
                />
              </Center>
            </TableCaption>
            <Thead>
              <Tr boxShadow="base">
                <Th>Questions</Th>
                <Th>Type</Th>
                <Th>
                  <Center>Difficulty</Center>
                </Th>
                <Th> Match </Th>
                {isAdmin ? <Th isNumeric>Modify/Delete</Th> : <></>}
              </Tr>
            </Thead>
            <Tbody>
              {getCurrentPage(pageNumber).map((qn) =>
                QuestionEntry({ qn: qn, isAdmin: isAdmin })
              )}
            </Tbody>
          </Table>
        </Center>
      </TableContainer>
    </>
  );
};
