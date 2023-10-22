import { Flex, HStack, Input } from "@chakra-ui/react";
import { QnFilter } from "../../models/Question.model";
import React, { useState } from "react";

export interface FilterBarProps extends QnFilter {
  setFilter : (filter: QnFilter) => void; // refilters original db
}

export const FilterBar = ({
  qnFilter = "",
  tagFilter = new Set(),
  difficultyFilter = [0, 100],
  titleAscd = true,
  setFilter,
}: FilterBarProps) => {
  const [txtFilter, setTextFilter] = useState(qnFilter);

  const filterChange = (event: React.FormEvent<HTMLInputElement>) => {
    setTextFilter((event.target as HTMLInputElement).value);
    const newFilter: QnFilter = {
      qnFilter: (event.target as HTMLInputElement).value.toLowerCase().trim(),
      tagFilter: tagFilter,
      difficultyFilter: difficultyFilter,
      titleAscd: titleAscd,
    };

    if (setFilter) setFilter(newFilter);
  };

  return (
    <Flex w="80%" px="6" py="4" align={"center"} justify={"space-between"}>
      <HStack spacing="1">
        <Input
          variant="outline"
          placeholder={qnFilter || "Find Questions"}
          borderRadius="15"
          onChange={filterChange}
          value={txtFilter}
        ></Input>
      </HStack>
    </Flex>
  );
};
