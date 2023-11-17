import React from "react";
import {
  Flex,
  Button,
  HStack,
  chakra,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Navbar = () => {

  return (
    <chakra.header boxShadow="md" minH="10vh" zIndex="2" pos="sticky">
      {/* chakra dont recomment zindex > 2 */}
      <Flex w="100%" px="6" py="2vh" align="center" justify="space-between">
        <HStack spacing="4px">


          <Link to="/bank">
            <Button variant="ghost">Bank</Button>
          </Link>


          <Link to="/create">
            <Button variant="ghost">Create</Button>
          </Link>

        </HStack>
      </Flex>
    </chakra.header>
  );
};
