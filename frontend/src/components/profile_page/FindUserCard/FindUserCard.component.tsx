import { Avatar, Button, Card, CardBody, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { findUsers, getProfilePicUrl } from "../../../api/user";
import { User, selectUser } from "../../../reducers/authSlice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";



export default function FindUserCard() {

  const [newUserQuery, setNewUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newUsers, setNewUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const currUser = useSelector(selectUser);


  const onClick = async () => {
    setIsLoading(true);
    try {
      if (newUserQuery.trim() === '') {
        setErrorMessage('Please provide a name');
        setNewUsers([]);
      } else {
        setErrorMessage('');
        setNewUsers([]);
        const users = await findUsers(newUserQuery);
        setNewUsers(users);
        if (users.length === 0) {
          setErrorMessage('No users found');
        }
      }
    } catch (error) {
      console.log(`FindUserCard: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card variant={"elevated"}>
      <CardBody>
        <Heading size='md'>Find users</Heading>
      <Flex flexDir={"column"} rowGap={2}>

        {newUsers.filter(
          (user : any) => user.id !== currUser!.id
        ).map((user: User) => {
          return (
            <Link to={`/profile/${user.username}`} state={{userid: user.id}}>
              <Card variant={"filled"}>
                <CardBody>
                  <Flex justifyContent={"space-between"}>
                    <Text> {user.username} </Text>
                    <Avatar name={user.username} src={getProfilePicUrl(user.profilePic)} />
                  </Flex>
                </CardBody>
              </Card>
            </Link>
          )
        })}
      </Flex>

        <VStack w="100%">
          <FormControl id='other user' isInvalid={errorMessage !== ''}>
            <FormLabel> </FormLabel>
            <Input type='text'
              name="other user"
              value={newUserQuery}
              onChange={(e) => { setNewUserQuery(e.target.value) }}
            />
            <FormErrorMessage> {errorMessage} </FormErrorMessage>

          </FormControl>
          <Button w="100%" onClick={onClick} isLoading={isLoading} loadingText='Searching...'>
            Find user
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )
}