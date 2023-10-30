import React from "react";
import { Box, Heading } from "@chakra-ui/react";

const OutputWindow = ({ outputDetails }) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre
          px={2}
          py={1}
          fontSize="xs"
          color="red.500"
        >
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre
          px={2}
          py={1}
          fontSize="xs"
          color="green.500"
        >
          {atob(outputDetails.stdout) !== null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre
          px={2}
          py={1}
          fontSize="xs"
          color="red.500"
        >
          {"Time Limit Exceeded"}
        </pre>
      );
    } else {
      return (
        <pre
          px={2}
          py={1}
          fontSize="xs"
          color="red.500"
        >
          {atob(outputDetails?.stderr)}
        </pre>
      );
    }
  };
  return (
    <>
      <Box
        borderWidth="2px"
        borderColor="black"
        rounded="md"
        px={4}
        py={2}
        bg="white"
        mt={2}
        mx={5}
        focusOutline="none"
        maxW="80"
        minW="80"
        maxH="36"
        overflow="auto"
        overflowY="scroll"
      >
        {outputDetails ? <>{getOutput()}</> : "Output"}
      </Box>
    </>
  );
};

export default OutputWindow;
