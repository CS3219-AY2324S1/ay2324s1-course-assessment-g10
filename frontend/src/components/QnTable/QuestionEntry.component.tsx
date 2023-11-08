import { ButtonGroup, HStack, IconButton, Tag, Td, Text, Tr } from "@chakra-ui/react";
import { Question } from "../../models/Question.model";
import { Link } from "react-router-dom";
import { DeleteQnBtn } from "../DeleteQnBtn/DeleteQnBtn.component";
import { EditIcon } from "@chakra-ui/icons";
import { diffToScheme } from "../../helper/UIHelper";
import { useDispatch } from "react-redux";
import { delQuestion } from "../../api/questions";
import { deleteQuestion } from "../../reducers/questionsSlice";

interface QuestionEntryProps {
    qn: Question, 
    isAdmin: boolean
  }

export function QuestionEntry(props : QuestionEntryProps) {
    
    const {qn, isAdmin} = props;
    const dispatch = useDispatch();

    const onDelete = async (_id: string) => {
        await delQuestion(_id);
        dispatch(deleteQuestion(_id));
    }

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
          <Tag colorScheme={diffToScheme(qn.difficulty)}>{qn.difficulty}</Tag>
        </Td>
        {isAdmin ? (
          <Td>
            <ButtonGroup>
              <Link to={`/edit/${qn._id}`}>
                <IconButton
                  aria-label="Edit question"
                  icon={<EditIcon />}
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
  };