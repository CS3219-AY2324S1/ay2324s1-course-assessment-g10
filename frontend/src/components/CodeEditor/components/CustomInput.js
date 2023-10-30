import React from "react";
import { Textarea, Box } from "@chakra-ui/react";

const CustomInput = ({ customInput, setCustomInput }) => {
  return (
    <Box>
      <Textarea
        rows="5"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder={`Custom input`}
        borderWidth="2px"
        borderColor="black"
        rounded="md"
        px={4}
        py={2}
        _hover={{ boxShadow: "lg" }}
        transition="0.2s"
        bg="white"
        mt={2}
        mx={5}
        focusOutline="none"
        minW="80"
        maxW="80"
        h="100%"
      ></Textarea>
    </Box>
  );
};

export default CustomInput;
