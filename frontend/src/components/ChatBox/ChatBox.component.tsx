import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { useSharedEditor } from "../../contexts/sharededitor.context";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/authSlice";
import { useState, useRef, useEffect } from "react";
import { useMatchmake } from "../../contexts/matchmake.context";

const ChatBox = () => {
  const { matchedRoom } = useMatchmake();
  const { chat, sendToChat } = useSharedEditor();
  const user = useSelector(selectUser);
  const [msg, setMsg] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      // Set scrollTop to the maximum value to keep the scroll bar at the bottom
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Set scrollLeft to the maximum value to keep the scroll bar at the right
      chatContainer.scrollLeft = chatContainer.scrollWidth - chatContainer.clientWidth;
    }
  }, [chat]);

  const submitMsg = () => {
    if (!msg.trim()) return;
    sendToChat(msg);
    setMsg("");
  };

  if (!matchedRoom) return <></>;
  return (
    <Flex
      flexDirection="column"
      width="400px"
      height="400px"
      alignItems="start"
      border="1px solid #ccc"
      borderRadius="md"
      padding="10px"
    >
      <div
        ref={chatContainerRef}
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "gray.100",
          borderRadius: "md",
          padding: "10px",
          width: "100%" // Use 100% width
        }}
      >
        {chat.map((entry, i) => (
          <HStack
            w="100%"
            justifyContent={entry.nickname === user?.username ? "flex-end" : "flex-start"} // Align based on the sender
            key={i}
          >
            {entry.nickname !== user?.username && (
              <Avatar name={entry.nickname} w="40px" h="40px" />
            )}
            <Text
              backgroundColor={entry.nickname === user?.username ? "blue.400" : "gray.200"}
              color={entry.nickname === user?.username ? "white" : "black"}
              borderRadius="lg"
              paddingX={2}
              paddingY={1}
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                maxWidth: "70%",
              }}
            >
              {entry.msg}
            </Text>
            {entry.nickname === user?.username && (
              <Avatar name={entry.nickname} w="40px" h="40px" />
            )}
          </HStack>
        ))}
      </div>
      <Spacer />
      <InputGroup>
        <Input
          placeholder="Enter message"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          variant="filled"
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
