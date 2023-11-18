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
import { login } from '../../api/auth';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  
  const onSubmit = (e: any) => {
    e.preventDefault();

    login(username, password).then(response => {
      const user = response.data.user;
      dispatch(setUser(user));
      navigate('/');
    }).catch((err) => {
      console.log(err);
      toast({
        title: 'Failed to Login',
        description: 'Incorrect username or password',
        status: 'error',
        isClosable: true,
      });
    })
  }

  return (
    <Box maxW="md" mx="auto" mt="50px" p={8} rounded="lg" borderWidth={1} shadow="lg">
      <Heading textAlign='center'> Log in </Heading>
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
            <Input type='password'
              name="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </FormControl>

          <HStack>
            <Button colorScheme="blue" type="submit">
              Submit
            </Button>

            <Button colorScheme="gray" onClick={(e) => { navigate('/register') }}>
              Register
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box >
  )
}