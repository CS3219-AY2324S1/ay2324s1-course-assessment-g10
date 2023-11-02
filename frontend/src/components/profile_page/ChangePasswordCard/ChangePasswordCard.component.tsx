import { Button, Card, CardBody, Flex, FormControl, FormLabel, Heading, Input, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../reducers/authSlice";
import { changePassword } from "../../../api/auth";

export default function ChangePasswordCard() {

  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [currPassword, setCurrPassword] = useState('')

  const [isChangingPass, setIsChangingPass] = useState(false)
  
  const dispatch = useDispatch();
  const toast = useToast();


  const onSubmit = async () => {
    try {
      if (newPassword.trim() !== retypePassword.trim()) {
        throw Error('Make sure you re-type your new password correctly!')
      }
      
      await changePassword(newPassword.trim(), currPassword.trim());
      dispatch(clearUser());

    } catch (error : any) {
      toast({
        title: "Failed to change password!",
        description: error.message,
        status: 'error'
      })
    } finally {
      setNewPassword('');
      setRetypePassword('');
      setCurrPassword('');
      setIsChangingPass(false);
    }

    
  }
  
  return (
    <Card variant={"elevated"}>
      <CardBody>

        <Heading size='md'>Change Password</Heading>
        {isChangingPass ? (
          <VStack>
            <FormControl id='newPassword'>
              <FormLabel>New Password</FormLabel>
              <Input type='text'
                name="newPassword"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value) }}
              />
            </FormControl>
            <FormControl id='retypePassword'>
              <FormLabel>Re-type Password</FormLabel>
              <Input type='text'
                name="retypePassword"
                value={retypePassword}
                onChange={(e) => { setRetypePassword(e.target.value) }}
              />
            </FormControl>
            <FormControl id='currPassword'>
              <FormLabel>Current Password</FormLabel>
              <Input type='text'
                name="currPassword"
                value={currPassword}
                onChange={(e) => { setCurrPassword(e.target.value) }}
              />
            </FormControl>


            <Flex alignItems={"flex-start"} w="100%" columnGap={"8px"}>
                <Button colorScheme="green" onClick={onSubmit}>
                  Save
                </Button>
                <Button onClick={() => setIsChangingPass(false)}>
                  Cancel
                </Button>
            </Flex>
            

          </VStack>
        ) : (

          <Button w="100%" onClick={() => setIsChangingPass(true)}>
            Change Password
          </Button>
        )

        }



      </CardBody>
    </Card>
  )
}