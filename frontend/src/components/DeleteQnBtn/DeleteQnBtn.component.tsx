import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Question } from "../../models/Question.model";
import React, { useRef } from "react";
import { DeleteIcon } from "@chakra-ui/icons";

type DeleteQnBtnProp = ButtonProps & {
  qn?: Question;
  onSubmit?: () => void;
};

export function DeleteQnBtn(pp: DeleteQnBtnProp) {
  const { qn, onSubmit, colorScheme = "red", ...rest } = pp;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();


  const onDelete = async () => {
    if (!qn) return;
    
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit();
      }
    } catch (err : any) {
      toast({
        title: 'Unable to delete',
        description: err.message,
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }

    onClose();
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        colorScheme={colorScheme}
        icon={<DeleteIcon />}
        aria-label={"delete_this_qn"}
        {...rest}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Question
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={loading}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={onDelete}
                ml={3}
                isLoading={loading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
