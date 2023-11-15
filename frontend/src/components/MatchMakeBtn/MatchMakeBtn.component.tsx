import { ChatIcon, ChevronDownIcon, RepeatClockIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { useMatchmake } from "../../contexts/matchmake.context";
import { AiOutlineDisconnect as DisconnectIcon } from "react-icons/ai";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/authSlice";
import { diffRanges } from "../../helper/DifficultyFilterHelper";

const MatchMakeBtn = () => {
  const user = useSelector(selectUser);
  const {
    findMatch,
    isMatching,
    matchedRoom,
    timeLeft,
    cancelMatch,
    restoreRoom,
    quitRoom,
  } = useMatchmake();

  if (!user) return <></>;

  return matchedRoom ? (
    <ButtonGroup isAttached variant="outline">
      <Tooltip label="Leave match" aria-label="collaborate">
        <IconButton
          aria-label="disconnect"
          colorScheme="red"
          onClick={quitRoom}
          icon={<Icon as={DisconnectIcon} />}
        />
      </Tooltip>
      <Tooltip label="Open Chat" aria-label="collaborate">
        <IconButton
          aria-label="open_chat"
          colorScheme="teal"
          icon={<ChatIcon />}
        />
      </Tooltip>
    </ButtonGroup>
  ) : (
    <Menu>
      {timeLeft ? (
        <Button onClick={cancelMatch} colorScheme="red">
          Cancel
        </Button>
      ) : (
        <ButtonGroup isAttached colorScheme="teal" size="md">
          <MenuButton as={Button} isLoading={isMatching}>
            Collaborate
          </MenuButton>
          <IconButton
            aria-label="reconnect"
            icon={<RepeatClockIcon />}
            variant="outline"
            onClick={restoreRoom}
            isLoading={isMatching}
          />
        </ButtonGroup>
      )}

      <MenuList>
        {diffRanges.map((dr) => (
          <MenuItem
            onClick={() => findMatch(dr.range[0], dr.range[1])}
            id={dr.difficulty}
          >
            {dr.difficulty}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default MatchMakeBtn;
