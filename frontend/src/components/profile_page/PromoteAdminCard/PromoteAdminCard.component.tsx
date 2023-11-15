import { Button, Card, Heading, useToast } from "@chakra-ui/react";
import { CardBody } from "react-bootstrap";
import { User } from "../../../reducers/authSlice";
import { updateUserRole } from "../../../api/auth";

export type PromoteAdminCardProp = {
  displayedUser: User,
  setDisplayedUser: (user: any) => void
};


export default function PromoteAdminCard(props: PromoteAdminCardProp) {
  const { displayedUser, setDisplayedUser } = props;
  const toast = useToast();

  const promoteToAdmin = async () => {
    try {
      const response = await updateUserRole(displayedUser.id, "ADMIN");
      const updatedDisplayedUser = response.data;
      console.log(`setting new displayed user to: ${updatedDisplayedUser}`);
      setDisplayedUser(updatedDisplayedUser);
    } catch (error: any) {
      toast({
        title: "Failed to promote",
        description: error.message,
        status: "error",
      });
    }
  };

  const demoteToUser = async () => {
    try {
      const response = await updateUserRole(displayedUser.id, "USER");
      const updatedDisplayedUser = response.data;
      console.log(`setting new displayed user to: ${updatedDisplayedUser}`);
      setDisplayedUser(updatedDisplayedUser);
    } catch (error: any) {
      toast({
        title: "Failed to demote",
        description: error.message,
        status: "error",
      });
    }
  };


  return (
    <Card variant={"elevated"} colorScheme="red" backgroundColor="pink">
      <CardBody>
        {displayedUser.role === 'USER' ?
          (<Button w="100%" colorScheme="green" onClick={promoteToAdmin}>
            <Heading size='sm'>Promote to admin role</Heading>
          </Button>
          )
          :
          (<Button w="100%" colorScheme="red" onClick={demoteToUser}>
            <Heading size='sm'>Demote to user role</Heading>
          </Button>)}
      </CardBody>
    </Card>
  )
}