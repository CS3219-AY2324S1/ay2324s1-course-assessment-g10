import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useMatchmake } from "../../contexts/matchmake.context";

const diffRange = [
  [0, 2.9],
  [3, 5.9],
  [6, 7.9],
  [8, 9.9],
];

const MatchMakeBtn = () => {
  const { findMatch } = useMatchmake();

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Collaborate
      </MenuButton>
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
      </MenuList>
    </Menu>
  );
};

export default MatchMakeBtn;
