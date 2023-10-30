import React from "react";
import { Text, Badge, VStack } from "@chakra-ui/react";

const OutputDetails = ({ outputDetails }) => {
  return (
    <VStack mt={4} spacing={1}>
      <Text fontSize="sm">
        Status:{" "}
        <Badge fontSize="sm" px={2} py={1} rounded="md" bg="gray.100">
          {outputDetails?.status?.description}
        </Badge>
      </Text>
      <Text fontSize="sm">
        Memory:{" "}
        <Badge fontSize="sm" px={2} py={1} rounded="md" bg="gray.100">
          {outputDetails?.memory}
        </Badge>
      </Text>
      <Text fontSize="sm">
        Time:{" "}
        <Badge fontSize="sm" px={2} py={1} rounded="md" bg="gray.100">
          {outputDetails?.time}
        </Badge>
      </Text>
    </VStack>
  );
};

export default OutputDetails;
