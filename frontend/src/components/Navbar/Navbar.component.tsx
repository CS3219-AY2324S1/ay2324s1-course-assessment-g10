import React from "react";
import { Flex, Button, HStack, chakra } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../reducers/authSlice";
import LogoutButton from "../auth/LogoutButton";

export const Navbar = () => {

  const isAuthenticated = useSelector(selectIsAuthenticated);

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
          {isAuthenticated ? (
            <>
              <LogoutButton />
              <Button colorScheme="blue">View Account</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" >Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </HStack>
      </Flex>
    </chakra.header>
  );
};
