import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  HStack,
  Tag,
  Center,
  IconButton,
} from "@chakra-ui/react";
import { Paginator } from "../Paginator/Paginator.component";
import { Question } from "../../models/Quesiton.model";
import { diffToScheme, isAdmin } from "../../helper/UIHelper";
import { DeleteIcon } from "@chakra-ui/icons";
import { deleteDummyQn } from "../../data/sampleqn";

export type TableProp = {
  filteredQn: Question[];
  pageSize?: number;
};

const QnEntry = (qn: Question) => {
  return (
    <Tr>
      <Td>{qn.displayedQuestion}</Td>
      <Td>
        <HStack spacing={1}>
          {qn.categories.map((qntype) => (
            <Tag colorScheme="blue">{qntype}</Tag>
          ))}
        </HStack>
      </Td>
      <Td isNumeric>
        <Tag colorScheme={diffToScheme(qn.difficulty)}>{qn.difficulty}</Tag>
      </Td>
      {isAdmin ? (
        <Td>
          <IconButton
            aria-label="Delete Qn"
            colorScheme="red"
            icon={<DeleteIcon />}
            onClick={() => deleteDummyQn(qn.id)}
          />
        </Td>
      ) : (
        <></>
      )}
    </Tr>
  );
};

export const QnTable = (pp: TableProp) => {
  const { filteredQn, pageSize = 10 } = pp;
  const [pageNumber, changePage] = useState(1);

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
            backgroundColor={"white"}
            size="md"
            boxShadow="md"
            transition="box-shadow 0.2s"
            _hover={{
              boxShadow: "xl",
            }}
            width="80%"
            sx={{ tableLayout: "fixed" }}
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
                <Th isNumeric>Difficulty</Th>
                {isAdmin ? <Th>Modify/Delete</Th> : <></>}
              </Tr>
            </Thead>
            <Tbody>{getCurrentPage(pageNumber).map((qn) => QnEntry(qn))}</Tbody>
          </Table>
        </Center>
      </TableContainer>
    </>
  );
};
