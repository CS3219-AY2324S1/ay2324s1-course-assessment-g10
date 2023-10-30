import { Button, Card, CardBody, FormControl, FormLabel, HStack, Heading, Input, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";



export default function FindUserCard() {

  const [newUser, setNewUser] = useState('');
  const [newUsers, setNewUsers] = useState([]);


  const onClick = () => {
    //TODO: API endpoint call to user database to try and find users with similar name
  }

  return (
    <Card variant={"elevated"}>
      <CardBody>
        <Heading size='md'>Find user</Heading>

        {/* {TODO: Load search results here} */}

        <VStack w="100%">
          <FormControl id='other user'>
            <FormLabel> </FormLabel>
            <Input type='text'
              name="other user"
              value={newUser}
              onChange={(e) => { setNewUser(e.target.value) }}
            />
          </FormControl>
          <Button w="100%" onClick={onClick}>
            Find user
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )
}