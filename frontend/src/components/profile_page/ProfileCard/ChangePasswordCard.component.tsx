import { Button, Card, CardBody, FormControl, FormLabel, Heading, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../reducers/authSlice";

export default function ChangePasswordCard() {

  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [currPassword, setCurrPassword] = useState('')

  const [isChangingPass, setIsChangingPass] = useState(false)
  
  const dispatch = useDispatch();


  const onSubmit = () => {
    try {
      //TODO:
      // first check if newpassword == retypepassword
      // then API call to change password
      //  - API endpoint should also clear the user cookie (akin to calling logOut)
      
      dispatch(clearUser());
    } catch (error) {
      //TODO: toast on fail
    } finally {

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


            <Button w="100%" onClick={onSubmit}>
              Submit
            </Button>

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