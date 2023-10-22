import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  DrawerContent,
  HStack,
  Tag,
  Divider,
  Box,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Question } from "../../models/Question.model";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { diffToScheme } from "../../helper/UIHelper";
import { MarkdownViewer } from "../MarkdownVIewer/MarkdownViewer";

interface qnProp {
  question: Question;
  size: "xs" | "sm" | "md" | "lg" | "xl" | "full";
}

export const QnDrawer = (prop: qnProp) => {
  const { question, size } = prop;
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

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
              {question.topics.map((qnTag) => (
                <Tag>{qnTag}</Tag>
              ))}
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <Box>
              <MarkdownViewer markdown={question.descMd} />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
