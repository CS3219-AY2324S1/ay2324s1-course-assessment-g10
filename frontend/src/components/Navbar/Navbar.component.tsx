import React from "react";
import { 
    Image,
    Flex,
    Button,
    HStack,
    chakra
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <chakra.header>
            <Flex
            w="100%"
            px="6"
            py="4"
            align={'center'}
            justify={'space-between'}
            >
                <HStack spacing="4px">
                    <Link to="/">
                        <Button colorScheme="linkedin" variant="outline">Peer Prep</Button>
                    </Link>

                    <Link to="/">
                        <Button colorScheme="blue" variant="ghost">Home</Button>
                    </Link>

                    <Link to="/">
                        <Button variant="ghost">Bank</Button>
                    </Link>

                    <Link to="/">
                        <Button variant="ghost">Create</Button>
                    </Link>

                    <Link to="/">
                        <Button variant="ghost">About</Button>
                    </Link>
                </HStack>

                <HStack>
                    <Button variant="ghost">
                        Sign in
                    </Button>
                    <Button>
                        Sign up
                    </Button>
                </HStack>
            </Flex>
        </chakra.header>
    );
}