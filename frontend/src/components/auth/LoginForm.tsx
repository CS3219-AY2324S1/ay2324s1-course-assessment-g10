import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  VStack,
  Input,
  Button,
} from '@chakra-ui/react'
import { useState } from 'react';
import { User, setUser } from '../../reducers/authSlice';
import { useDispatch } from 'react-redux';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch()

  // require integration with backend API
  const onSubmit = (e: any) => {
    e.preventDefault();
    const user: User = {
      id: '12345',
      username: username,
      role: 'User'
    }

    dispatch(setUser(user));
  }

  return (
    <Box maxW="md" mx="auto" mt="50px" p={8} rounded="lg" borderWidth={1} shadow="lg">
      <form onSubmit={onSubmit}>
        <VStack>
          <FormControl id='username' isRequired>
            <FormLabel>Name</FormLabel>
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

          <Button colorScheme="blue" type="submit">
            Submit
          </Button>

        </VStack>
      </form>
    </Box >
  )
}