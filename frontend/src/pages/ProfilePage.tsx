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
import PromoteAdminCard from "../components/profile_page/PromoteAdminCard/PromoteAdminCard.component";
import { ProfileProvider } from "../contexts/profileContext";
import ProgressBar from "../components/ProgressBar/ProgressBar.component";


export default function ProfilePage() {

  const location = useLocation();
  const currUser = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
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
  }, [location, currUser]);

  return (
    <ProfileProvider displayedUser={displayedUser!}>
      <Box pt="40px" w="100%">
        <Flex align-items={"flex-start"} justifyContent="center" columnGap={8}>
          <Box w="30%" h="100%">
            <Flex flexDir={"column"} rowGap={8}>
              <ProfileCard
                displayedUser={displayedUser!}
                isViewingOtherUser={currUser!.id !== displayedUser!.id}
              />
              <FindUserCard />

              {currUser!.id !== displayedUser!.id ? (
                <></>
              ) : (
                <ChangePasswordCard />
              )}

              {isAdmin ? (
                <PromoteAdminCard
                  displayedUser={displayedUser!}
                  setDisplayedUser={setDisplayedUser}
                />
              ) : (
                <></>
              )}
            </Flex>
          </Box>
          <Box w="55%">
            <ProgressBar />
            <SolvedTable pageSize={3} />
          </Box>
        </Flex>
      </Box>
    </ProfileProvider>
  );
}