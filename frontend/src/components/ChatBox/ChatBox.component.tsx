import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  Spacer,
  HStack,
  Tag,
} from "@chakra-ui/react";
import { useSharedEditor } from "../../contexts/sharededitor.context";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/authSlice";
import { useState } from "react";

const ChatBox = () => {
  const { chat, sendToChat } = useSharedEditor();
  const user = useSelector(selectUser);
  const [msg, setMsg] = useState("");
  const submitMsg = () => {
    if (!msg.trim()) return;
    sendToChat(msg);
    setMsg("");
  };
  return (
    <Flex flexDirection="column" width="100%" height="100%" alignItems="start">
      <VStack flexDirection={"column-reverse"} flex={1} width="100%">
        {chat.map((entry, i) => (
          <HStack
            w="100%"
            direction={
              entry.nickname === user?.username ? "column-reverse" : "column"
            }
          >
            <Tag>
              <Text>{entry.nickname}</Text>
            </Tag>

            <Tag>
              <Text>{entry.msg}</Text>
            </Tag>

            <Spacer />
          </HStack>
        ))}
      </VStack>
      <Spacer />
      <InputGroup>
        <Input
          placeholder="Enter message"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <InputRightElement>
          <IconButton
            aria-label="Send"
            icon={<ChevronRightIcon />}
            onClick={submitMsg}
          />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default ChatBox;
