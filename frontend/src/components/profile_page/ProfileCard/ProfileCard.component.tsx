import { Avatar, Box, Button, Card, CardFooter, CardHeader, Flex, FormControl, FormLabel, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { User } from "../../../reducers/authSlice";

export type ProfileCardProp = {
  displayedUser: User
  isViewingOtherUser: boolean
};


export default function ProfileCard(props: ProfileCardProp) {

  const { displayedUser, isViewingOtherUser } = props;
  const [isEditingProfile, setEditProfile] = useState(false);
  const [username, setUsername] = useState(displayedUser!.username);

  const onSave = () => {
    //do something...
    setEditProfile(false);
  }


  return (
    <Card variant={"elevated"}>
      <CardHeader>
        <Flex w="100%" justifyContent={"space-between"}>
          <VStack alignItems={"flex-start"}>
            <Heading size='md'> {`${isViewingOtherUser ? '' : "Hello"} ${displayedUser!.username}`}</Heading>
            <Text>{displayedUser!.role} </Text>
          </VStack>

          <Avatar size="xl" name={displayedUser.username}></Avatar>
        </Flex>
      </CardHeader>

      {
        isViewingOtherUser 
          ? <></>
          :
          <CardFooter>
            {
              !isEditingProfile ?
                <Button w="100%" onClick={() => setEditProfile(true)}>
                  Edit Profile
                </Button> :

                <VStack w="100%">
                  <FormControl id='username'>
                    <FormLabel>Username</FormLabel>
                    <Input type='text'
                      name="username"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value) }}
                    />
                  </FormControl>
                  <Flex alignItems={"flex-start"} w="100%" columnGap={"8px"}>
                    <Button colorScheme="green" onClick={onSave}>
                      Save
                    </Button>
                    <Button onClick={() => setEditProfile(false)}>
                      Cancel
                    </Button>
                  </Flex>
                </VStack>

            }

          </CardFooter>
      }
    </Card>

  )


}