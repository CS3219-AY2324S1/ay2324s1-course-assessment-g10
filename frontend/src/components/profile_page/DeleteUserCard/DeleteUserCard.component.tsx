import { useSelector } from "react-redux"
import { clearUser, selectUser } from "../../../reducers/authSlice"
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Card, CardBody, Heading, Input, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { deleteUser } from "../../../api/user";
import { useDispatch } from "react-redux";


export default function DeleteUserCard() {
  const user = useSelector(selectUser);
  const [enteredName, setEnteredName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const toast = useToast();

  const onConfirmDelete = async () => {
    try {
      setIsLoading(true);
      const response = await deleteUser(user!.id)
    } catch (error: any) {
      toast({
        title: 'Deletion failed!',
        description: error.message,
        status: 'error'
      })
    } finally {
      setIsLoading(false);
      onClose();
      dispatch(clearUser());
    }

  }


  return (
    <>
      <Card variant={"elevated"} colorScheme="red" backgroundColor="pink">
        <CardBody>
          <Button w="100%" colorScheme="red" onClick={onOpen}>
            <Heading size='sm'>Delete My Account</Heading>
          </Button>
        </CardBody>
      </Card>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.

              Enter your username to confirm this action.
              <Input type='text'
                name='username'
                value={enteredName}
                onChange={(e) => { setEnteredName(e.target.value) }}
                autoComplete={"off"}
              >
              </Input>

            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={onConfirmDelete} ml={3} 
                  isDisabled={enteredName !== user?.username} isLoading={isLoading}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )



}