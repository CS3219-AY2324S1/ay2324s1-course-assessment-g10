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
  Text,
  useToast,
} from "@chakra-ui/react";
import { Paginator } from "../Paginator/Paginator.component";
import { Question } from "../../models/Question.model";
import { diffToScheme } from "../../helper/UIHelper";
import { DeleteIcon } from "@chakra-ui/icons";
import { deleteDummyQn } from "../../data/sampleqn";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../../reducers/authSlice";
import { delQuestion } from "../../api/questions";
import { removeQuestion } from "../../reducers/questionsSlice";
import { useDispatch } from "react-redux";

export type TableProp = {
  filteredQn: Question[];
  pageSize?: number;
};


const QnEntry = (props : {
  qn: Question, 
}) => {
  
  const qn = props.qn;
  const toast = useToast();
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);

  function onDelete(id: number) {
  
    if (isAdmin) {
      delQuestion(id.toString()).then((res) => {
        dispatch(removeQuestion(id));
      }).catch((err) => {
        toast({
          title: 'Unable to delete',
          description: err.msg,
          status: 'error',
          isClosable: true,
        })
      })
    }
  }

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
      <Td isNumeric>
        <Tag colorScheme={diffToScheme(qn.difficulty)}>{qn.difficulty}</Tag>
      </Td>
      {isAdmin ? (
        <Td>
          <IconButton
            aria-label="Delete Qn"
            colorScheme="red"
            icon={<DeleteIcon />}
            onClick={() => onDelete(qn.id)}
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
            <Tbody>{getCurrentPage(pageNumber).map((qn) => QnEntry({qn: qn}))}</Tbody>
          </Table>
        </Center>
      </TableContainer>
    </>
  );
};
