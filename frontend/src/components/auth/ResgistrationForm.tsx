import {
  FormControl,
  FormLabel,
  Box,
  VStack,
  Input,
  Button,
  Heading,
  HStack,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react';
import { setUser } from '../../reducers/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import { AxiosError } from 'axios';

export default function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast();


  const ensureStrongPassword = (password: string) => {
    if (password.length < 8) {
      throw Error('Password must be 8 characters or more!')
    }
  }

  //TODO: require integration with backend API
  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      ensureStrongPassword(password.trim());
      const response = await register(username.trim(), password.trim());
      const user = response.data.user;

      dispatch(setUser(user));
      navigate('/');
    } catch (err: any) {
      console.log(err);
      if (err instanceof AxiosError) {
        toast({
          title: 'Failed to Register!',
          description: 'User is taken!',
          status: 'error',
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to Register!',
          description: err.message,
          status: 'error',
          isClosable: true,
        });

      }

    }
  }

  return (
    <Box maxW="md" mx="auto" mt="50px" p={8} rounded="lg" borderWidth={1} shadow="lg">
      <Heading textAlign='center'> Sign up </Heading>
      <form onSubmit={onSubmit}>
        <VStack>
          <FormControl id='username' isRequired>
            <FormLabel>Username</FormLabel>
            <Input type='text'
              name="username"
              value={username}
              onChange={(e) => { setUsername(e.target.value) }}
            />
          </FormControl>

          <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <Input type='text'
              name="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </FormControl>

          <HStack>

            <Button colorScheme="blue" type="submit">
              Register
            </Button>

            <Button colorScheme="gray" onClick={(e) => { navigate('/login') }}>
              Already an user? Log in
            </Button>
          </HStack>

        </VStack>
      </form>
    </Box >
  )
}
