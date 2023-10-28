import React from "react";
import { Flex, Select } from "@chakra-ui/react";
import { QnFilter } from "../../models/Question.model";

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

  const mapDifficultyToRange = (difficulty: string): [number, number] => {
    switch (difficulty) {
      case "Easy":
        return [0, 3.5];
      case "Medium":
        return [3.5, 7];
      case "Hard":
        return [7, 10];
      default:
        return [0, 10];
    }
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

const mapRangeToDifficulty = (difficultyFilter: [number, number]): string => {
  const [start, end] = difficultyFilter;
  if (start === 0 && end === 3.5) {
    return "Easy";
  } else if (start === 3.5 && end === 7) {
    return "Medium";
  } else if (start === 7 && end === 10) {
    return "Hard";
  } else {
    return "";
  }
};
