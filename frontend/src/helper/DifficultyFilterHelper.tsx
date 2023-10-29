export const mapDifficultyToRange = (difficulty: string): [number, number] => {
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

export const mapRangeToDifficulty = (difficultyFilter: [number, number]): string => {
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