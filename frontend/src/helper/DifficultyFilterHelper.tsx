type difficulty = {
  difficulty: string;
  range: [number, number];
  scheme?: string;
};

export const diffRanges: difficulty[] = [
  {
    difficulty: "Basic",
    range: [0, 2],
    scheme: "green",
  },
  {
    difficulty: "Easy",
    range: [2.001, 4],
    scheme: "yellow",
  },
  {
    difficulty: "Medium",
    range: [4.001, 6.5],
    scheme: "orange",
  },
  {
    difficulty: "Hard",
    range: [6.501, 10],
    scheme: "red",
  },
  {
    difficulty: "All",
    range: [0, 10],
  },
];

export const rangeToScheme = (diff: number) =>
  diffRanges.find((dr) => dr.range[0] <= diff && dr.range[1] >= diff)?.scheme;

export const mapRangeToDifficulty = (diff: number) =>
  diffRanges.find((dr) => dr.range[0] <= diff && dr.range[1] >= diff)
    ?.difficulty ?? "";

export const difficultyToRange = (diff: string) =>
  diffRanges.find((dr) => dr.difficulty === diff)?.range ?? [0, 10];
