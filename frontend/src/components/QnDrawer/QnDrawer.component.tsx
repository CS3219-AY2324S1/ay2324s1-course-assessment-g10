import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  Text,
  DrawerContent,
  HStack,
  Tag,
  Divider,
  Center,
  VStack,
  Box,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Question } from "../../models/Quesiton.model";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { qnLoader } from "../../pages/ViewQuestionPage/ViewQuestion.page";
import { diffToScheme } from "../../helper/UIHelper";

interface qnProp {
  question: Question;
  size: "xs" | "sm" | "md" | "lg" | "xl" | "full";
}

export const QnDrawer = (prop: qnProp) => {
  const { question, size } = prop;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="Open Question description"
        position="fixed"
        bottom="50%"
        left="-5px"
        zIndex="900" // Adjust the z-index to control layering
        onClick={onOpen}
        icon={<ArrowRightIcon />}
        colorScheme="blue"
        boxShadow="xl"
      />

      <Drawer onClose={onClose} isOpen={isOpen} size={size} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {question.displayedQuestion}
            <HStack spacing={2}>
              <Tag colorScheme={diffToScheme(question.difficulty)}>
                Difficulty: {question.difficulty}
              </Tag>
              <Divider orientation="vertical" padding="2"></Divider>
              {question.categories.map((qnTag) => (
                <Tag>{qnTag}</Tag>
              ))}
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <Box>
              {question.descMd.split("\n").map((txt) => (
                <Text>{txt}</Text>
              ))}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
