import { ChatIcon, ChevronDownIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { useMatchmake } from "../../contexts/matchmake.context";

const diffRange = [
  [0, 2.9],
  [3, 5.9],
  [6, 7.9],
  [8, 9.9],
  [0, 9.9],
];

const CollaborateBtn = () => {
  return (
    <ButtonGroup>
      <IconButton
        aria-label="open_chat"
        colorScheme="teal"
        variant="outline"
        icon={<ChatIcon />}
      />
    </ButtonGroup>
  );
};

const MatchMakeBtn = () => {
  const { findMatch, isMatching, matchedRoom, timeLeft, cancelMatch } =
    useMatchmake();

  return matchedRoom ? (
    <CollaborateBtn />
  ) : (
    <Menu>
      {timeLeft ? (
        <Button onClick={cancelMatch} colorScheme="red">
          Cancel
        </Button>
      ) : (
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          isLoading={isMatching}
        >
          Collaborate
        </MenuButton>
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
