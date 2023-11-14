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

const diffRange = [
  [0, 2.9],
  [3, 5.9],
  [6, 7.9],
  [8, 9.9],
  [0, 9.9],
];

const MatchMakeBtn = () => {
  const {
    findMatch,
    isMatching,
    matchedRoom,
    timeLeft,
    cancelMatch,
    restoreRoom,
    quitRoom,
  } = useMatchmake();

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
        <MenuItem onClick={() => findMatch(diffRange[0][0], diffRange[0][1])}>
          Basic
        </MenuItem>
        <MenuItem onClick={() => findMatch(diffRange[1][0], diffRange[1][1])}>
          Simple
        </MenuItem>
        <MenuItem onClick={() => findMatch(diffRange[2][0], diffRange[2][1])}>
          Medium
        </MenuItem>
        <MenuItem onClick={() => findMatch(diffRange[3][0], diffRange[3][1])}>
          Hard
        </MenuItem>
        <MenuItem onClick={() => findMatch(diffRange[4][0], diffRange[4][1])}>
          All
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MatchMakeBtn;
