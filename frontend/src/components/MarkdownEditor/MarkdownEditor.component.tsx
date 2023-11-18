import { useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import {
  Box,
  HStack,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Card,
  CardHeader,
  Flex,
  IconButton,
  Spacer,
  Text,
  Center,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { MarkdownViewer } from "../MarkdownVIewer/MarkdownViewer";
import { CardBody } from "react-bootstrap";

type MarkdownEditorProp = {
  title?: string;
  markdown?: string;
  isDisabled?: boolean;
  onChange?: (markdown: string) => void;
};

export const MarkdownEditor = (prop: MarkdownEditorProp) => {
  const [code, setCode] = useState(prop.markdown ?? "");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const ref = useRef<HTMLDivElement>(null);

  const valChange = (value: string) => {
    setCode(value);
    if (prop.onChange) {
      prop.onChange(value);
    }
  };

  return (
    <>
      <Card
        width="100%"
        height="100%"
        padding="20px"
        overflowY="auto"
        variant="outline"
        size="md"
      >
        <CardHeader>
          <Flex alignItems="center">
            <Text fontSize="xl" fontWeight="bold">
              {prop.title ?? "Description"}
            </Text>
            <Spacer />
            <IconButton
              isDisabled={prop.isDisabled}
              variant="ghost"
              colorScheme="gray"
              aria-label="Edit Markdown"
              icon={<EditIcon />}
              onClick={onOpen}
            />
          </Flex>
        </CardHeader>
        <CardBody>
          <Box padding="4" height="100%" overflow="auto">
            {code === "" ? (
              <Center>
                <Text>No detail have being provided</Text>
              </Center>
            ) : (
              <MarkdownViewer markdown={code} />
            )}
          </Box>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <HStack
              spacing="2"
              width="100%"
              height="100%"
              paddingTop="2"
              paddingBottom="2"
            >
              <Box width="60%" height="80vh" ref={ref} boxShadow="md">
                <CodeMirror
                  value={code}
                  height="calc(80vh)"
                  extensions={[
                    markdown({
                      base: markdownLanguage,
                      codeLanguages: languages,
                    }),
                  ]}
                  onChange={valChange}
                />
              </Box>
              <Box
                width="40%"
                height="80vh"
                padding="20px"
                overflowY="auto"
                boxShadow="md"
              >
                {code === "" ? (
                  <Center>
                    <Text>No detail have being provided</Text>
                  </Center>
                ) : (
                  <MarkdownViewer markdown={code} />
                )}
              </Box>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
