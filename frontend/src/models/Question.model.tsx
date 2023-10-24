export class Question {
  title: string;
  descMd: string;
  displayedQuestion: string;
  topics: string[];
  difficulty: number;
  id: number;
  solved: boolean; // Field to indicate whether the question has been solved
  solvedDate?: string;

  constructor(
    id: number,
    title: string,
    descMd: string,
    categories: string[],
    difficulty: number,
    solved: boolean = false,
    solvedDate?: string
  ) {
    this.title = title;
    this.descMd = descMd;
    this.topics = categories;
    this.difficulty = difficulty;
    this.id = id;
    this.solved = solved;
    this.solvedDate = solvedDate;
    this.displayedQuestion = `${id}.  ${title}`;
  }
}

export type QnFilter = {
  qnFilter?: string;
  tagFilter?: Set<string>;
  difficultyFilter?: [number, number];
  titleAscd?: boolean;
};
