import { Avatar, Button, Card, CardBody, FormControl, FormLabel, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { findUsers } from "../../../api/user";
import { User } from "../../../reducers/authSlice";



export default function FindUserCard() {

  const [newUserQuery, setNewUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newUsers, setNewUsers] = useState([]);


  const onClick = async () => {
    try {
      setIsLoading(true);
      const users = await findUsers(newUserQuery);
      setNewUsers(users);
    } catch (error) {
      console.log(`FindUserCard: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card variant={"elevated"}>
      <CardBody>
        <Heading size='md'>Find user</Heading>

        {newUsers.map((user: User) => {
          return (<Card variant={"elevated"}>
            <CardBody>
              <HStack>
                <Text> {user.username} </Text>
                <Avatar name={user.username} />
              </HStack>
            </CardBody>
          </Card>)

        })}

        <VStack w="100%">
          <FormControl id='other user'>
            <FormLabel> </FormLabel>
            <Input type='text'
              name="other user"
              value={newUserQuery}
              onChange={(e) => { setNewUserQuery(e.target.value) }}
            />
          </FormControl>
          <Button w="100%" onClick={onClick} isLoading={isLoading} loadingText='Searching...'>
            Find user
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )
}