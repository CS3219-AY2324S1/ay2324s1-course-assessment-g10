import React from "react";
import { Flex, Select } from "@chakra-ui/react";
import { QnFilter } from "../../models/Question.model";
import { mapDifficultyToRange, mapRangeToDifficulty} from "../../helper/DifficultyFilterHelper"

export interface DifficultyFilterProps extends QnFilter {
  setDifficultyFilter: (difficultyFilter: [number, number]) => void;
}

export const DifficultyFilter = ({
  difficultyFilter = [0, 10],
  setDifficultyFilter,
}: DifficultyFilterProps) => {
  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const difficulty = event.target.value;
    const newDifficultyFilter = mapDifficultyToRange(difficulty);
    setDifficultyFilter(newDifficultyFilter);
  };

  return (
    <Flex w="20%" px="6" py="4" align="center" justify="space-between">
      <Select
        variant="outline"
        placeholder=""
        value={mapRangeToDifficulty(difficultyFilter)}
        onChange={handleDifficultyChange}
      >
        <option value="">All</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </Select>
    </Flex>
  );
};
