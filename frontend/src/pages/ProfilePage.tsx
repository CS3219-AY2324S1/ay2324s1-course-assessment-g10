import { useSelector } from "react-redux";
import { SolvedTable } from "../components/SolvedTable/SolvedTable.component";
import { selectIsAdmin, selectUser } from "../reducers/authSlice";
import { Box, Card, CardHeader, CardBody, CardFooter, Flex, Heading, Text, Button } from "@chakra-ui/react";
import ProfileCard from "../components/profile_page/ProfileCard/ProfileCard.component";
import FindUserCard from "../components/profile_page/ProfileCard/FindUserCard.component";
import ChangePasswordCard from "../components/profile_page/ProfileCard/ChangePasswordCard.component";


export default function ProfilePage() {

  const user = useSelector(selectUser);

  return (

    <Box pt="40px" w="100%">
      <Flex align-items={"flex-start"} justifyContent="center" columnGap={8}>
        <Box w="30%" h="100%">
          <Flex flexDir={"column"} rowGap={8}>
            <ProfileCard user={user!}/>
            <FindUserCard />
            <ChangePasswordCard />


            <Card variant={"elevated"} colorScheme="red" backgroundColor="pink">
              <CardBody>
                {user ?
                  (<Button w="100%" colorScheme="green">
                    <Heading size='sm'>Promote to admin role</Heading>
                  </Button>
                  )
                  :
                  (<Button w="100%" colorScheme="red">
                    <Heading size='sm'>Demote to user role</Heading>
                  </Button>)}
              </CardBody>
            </Card>
          </Flex>
        </Box>
        <Box w="55%">
          <SolvedTable userId={user!.id} />
        </Box>
      </Flex >
    </Box >
  )
}