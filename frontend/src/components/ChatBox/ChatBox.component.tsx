import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  HStack,
  Tag,
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
      // Use a setTimeout to ensure the chatContainer has been rendered
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 0);
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
      width="400px" // Set the desired fixed width
      height="400px" // Set the desired fixed height
      alignItems="start"
      border="1px solid #ccc"
      borderRadius="md"
      padding="10px"
    >
      <div
        ref={chatContainerRef}
        style={{
          maxHeight: "300px", // Set the desired fixed height for the chat container
          overflowY: "auto", // Enable vertical scroll when messages overflow
          backgroundColor: "gray.100", // Example background color
          borderRadius: "md",
          padding: "10px",
        }}
      >
        {chat.map((entry, i) => (
          <HStack
            w="100%"
            direction={entry.nickname === user?.username ? "row-reverse" : "row"}
            key={i}
          >
            <Tag
              backgroundColor={entry.nickname === user?.username ? "blue.400" : "gray.200"}
              color={entry.nickname === user?.username ? "white" : "black"}
              borderRadius="lg"
              paddingX={2} // Adjust the horizontal padding
              paddingY={1} // Adjust the vertical padding
              style={{
                whiteSpace: "pre-wrap", // Allow text to wrap within the message tag
                wordWrap: "break-word", // Allow breaking long words
                maxWidth: "70%", // Set a maximum width for the message tag
              }}
            >
              <Text>{entry.nickname}:</Text>
            </Tag>

            <Tag
              backgroundColor="transparent" // Set the background color to transparent for the message
              color="black" // Set text color to black
              borderRadius="lg"
              padding={2}
              style={{
                whiteSpace: "pre-wrap", // Allow text to wrap within the message tag
                wordWrap: "break-word", // Allow breaking long words
                maxWidth: "70%", // Set a maximum width for the message tag
                border: "1px solid #ccc", // Add a border to create a bubble effect
                padding: "5px", // Adjust padding to create space between the border and text
                borderRadius: "lg", // Make the border rounded
                fontSize: "14px", // Increase the font size
                fontWeight: "bold", // Make the font bold
              }}
            >
              <Text>{entry.msg}</Text>
            </Tag>
          </HStack>
        ))}
      </div>
      <Spacer />
      <InputGroup>
        <Input
          placeholder="Enter message"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          variant="filled" // Example input field style
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
