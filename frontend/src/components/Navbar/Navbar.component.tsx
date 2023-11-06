import React from "react";
import {
  Flex,
  Button,
  HStack,
  chakra,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin, selectIsAuthenticated } from "../../reducers/authSlice";
import LogoutButton from "../auth/LogoutButton";
import MatchMakeBtn from "../MatchMakeBtn/MatchMakeBtn.component";

export const Navbar = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  return (
    <chakra.header boxShadow="md" minH="10vh" zIndex="2" pos="sticky">
      {/* chakra dont recomment zindex > 2 */}
      <Flex w="100%" px="6" py="2vh" align="center" justify="space-between">
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

          {isAdmin ? (
            <Link to="/create">
              <Button variant="ghost">Create</Button>
            </Link>
          ) : (
            <></>
          )}
        </HStack>

        <HStack>
          <MatchMakeBtn />
          {isAuthenticated ? (
            <>
              <LogoutButton />
              <Button colorScheme="blue">View Account</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
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
