import { useSelector } from "react-redux";
import { SolvedTable } from "../components/SolvedTable/SolvedTable.component";
import { selectIsAdmin, selectUser } from "../reducers/authSlice";
import { Box, Card, CardHeader, CardBody, CardFooter, Flex, Heading, Text, Button } from "@chakra-ui/react";
import ProfileCard from "../components/profile_page/ProfileCard/ProfileCard.component";
import FindUserCard from "../components/profile_page/FindUserCard/FindUserCard.component";
import ChangePasswordCard from "../components/profile_page/ChangePasswordCard/ChangePasswordCard.component";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserProfile } from "../api/user";


export default function ProfilePage() {

  const location = useLocation();
  const currUser = useSelector(selectUser);
  const [displayedUser, setDisplayedUser] = useState(currUser);

  useEffect(() => {
    if (location.state?.userid !== undefined) {
      getUserProfile(location.state.userid).then((resUser) => {
        setDisplayedUser(resUser);
      }).catch(
      )
    } else {
      setDisplayedUser(currUser);
    }
  }, [location]);

  return (

    <Box pt="40px" w="100%">
      <Flex align-items={"flex-start"} justifyContent="center" columnGap={8}>
        <Box w="30%" h="100%">
          <Flex flexDir={"column"} rowGap={8}>
            <ProfileCard 
              displayedUser={displayedUser!} 
              isViewingOtherUser={currUser!.id !== displayedUser!.id}
            />
            <FindUserCard />

            {
              currUser!.id !== displayedUser!.id 
                ? <></>
                : <ChangePasswordCard />
            }


            <Card variant={"elevated"} colorScheme="red" backgroundColor="pink">
              <CardBody>
                {displayedUser ?
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
          <SolvedTable userId={displayedUser!.id} />
        </Box>
      </Flex >
    </Box >
  )
}