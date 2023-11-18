import React from "react";
import { Flex, Select } from "@chakra-ui/react";
import { QnFilter } from "../../models/Question.model";
import {
  diffRanges,
  difficultyToRange,
} from "../../helper/DifficultyFilterHelper";

export interface DifficultyFilterProps extends QnFilter {
  setDifficultyFilter: (difficultyFilter: [number, number]) => void;
}

export const DifficultyFilter = ({
  setDifficultyFilter,
}: DifficultyFilterProps) => {
  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const difficulty = event.target.value;
    const newDifficultyFilter = difficultyToRange(difficulty);
    setDifficultyFilter(newDifficultyFilter);
  };

  return (
    <Flex w="20%" px="6" py="4" align="center" justify="space-between">
      <Select
        variant="outline"
        placeholder=""
        defaultValue="All"
        onChange={handleDifficultyChange}
      >
        {diffRanges.map((dr) => {
          return (
            <option key={dr.difficulty} value={dr.difficulty}>
              {dr.difficulty}
            </option>
          );
        })}
      </Select>
    </Flex>
  );
};
