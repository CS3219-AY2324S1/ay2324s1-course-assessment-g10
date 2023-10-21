import React from "react";
import { Flex, Button, HStack, chakra } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { isLoggedin } from "../../helper/UIHelper";

export const Navbar = () => {
  return (
    <chakra.header boxShadow={"md"} minH="10vh" zIndex="999">
      <Flex w="100%" px="6" py="2vh" align={"center"} justify={"space-between"}>
        <HStack spacing="4px">
          <Link to="/">
            <Button colorScheme="linkedin" variant="outline">
              Peer Prep
            </Button>
          </Link>

          <Link to="/">
            <Button colorScheme="blue" variant="ghost">
              Home
            </Button>
          </Link>

          <Link to="/bank">
            <Button variant="ghost">Bank</Button>
          </Link>

          <Link to="/create">
            <Button variant="ghost">Create</Button>
          </Link>

          <Link to="/about">
            <Button variant="ghost">About</Button>
          </Link>
        </HStack>

        <HStack>
          {isLoggedin ? (
            <>
              <Button variant="ghost">Sign out</Button>
              <Button colorScheme="blue">View Account</Button>
            </>
          ) : (
            <>
              <Button variant="ghost">Sign in</Button>
              <Button>Sign up</Button>
            </>
          )}
        </HStack>
      </Flex>
    </chakra.header>
  );
};
