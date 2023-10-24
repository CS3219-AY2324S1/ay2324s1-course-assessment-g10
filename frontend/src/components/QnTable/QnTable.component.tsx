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
  Text,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { Paginator } from "../Paginator/Paginator.component";
import { Question } from "../../models/Question.model";
import { diffToScheme, isAdmin } from "../../helper/UIHelper";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { DeleteQnBtn } from "../DeleteQnBtn/DeleteQnBtn.component";

export type TableProp = {
  filteredQn: Question[];
  pageSize?: number;
};

const QnEntry = (qn: Question) => {
  return (
    <Tr>
      <Td>
        <Link to={`/view/${qn.id}`}>
          <Text>{qn.displayedQuestion}</Text>
        </Link>
      </Td>
      <Td>
        <HStack spacing={1}>
          {qn.topics.map((qntype) => (
            <Tag colorScheme="blue">{qntype}</Tag>
          ))}
        </HStack>
      </Td>
      <Td>
        <Tag colorScheme={diffToScheme(qn.difficulty)}>{qn.difficulty}</Tag>
      </Td>
      {isAdmin ? (
        <Td>
          <ButtonGroup>
            <Link to={`/edit/${qn.id}`}>
              <IconButton
                aria-label="Edit question"
                icon={<EditIcon />}
              ></IconButton>
            </Link>
            <DeleteQnBtn qn={qn}></DeleteQnBtn>
          </ButtonGroup>
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
                <Th>Difficulty</Th>
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
