import {
  ButtonGroup,
  Center,
  HStack,
  IconButton,
  Tag,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { Question } from "../../models/Question.model";
import { Link } from "react-router-dom";
import { DeleteQnBtn } from "../DeleteQnBtn/DeleteQnBtn.component";
import { EditIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { delQuestion } from "../../api/questions";
import { deleteQuestion } from "../../reducers/questionsSlice";
import { rangeToScheme } from "../../helper/DifficultyFilterHelper";

interface QuestionEntryProps {
  qn: Question;
  isAdmin: boolean;
}

export function QuestionEntry(props: QuestionEntryProps) {
  const { qn, isAdmin } = props;
  const dispatch = useDispatch();

  const onDelete = async (_id: string) => {
    await delQuestion(_id);
    dispatch(deleteQuestion(_id));
  };

  return (
    <Tr key={qn.id}>
      <Td>
        <Link to={`/view/${qn._id}`}>
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
        <Center>
          <Tag colorScheme={rangeToScheme(qn.difficulty)}>{qn.difficulty}</Tag>
        </Center>
      </Td>
      {isAdmin ? (
        <Td isNumeric>
          <ButtonGroup gap={0.1}>
            <Link to={`/edit/${qn._id}`}>
              <IconButton
                aria-label="Edit question"
                icon={<EditIcon />}
                colorScheme="blue"
              ></IconButton>
            </Link>
            <DeleteQnBtn
              qn={qn}
              onSubmit={() => onDelete(qn._id)}
            ></DeleteQnBtn>
          </ButtonGroup>
        </Td>
      ) : (
        <></>
      )}
    </Tr>
  );
}
