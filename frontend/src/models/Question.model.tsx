export class Question {
  title: string;
  descMd: string;
  displayedQuestion: string;
  topics: string[];
  difficulty: number;
  id: number;

  constructor(
    id: number,
    title: string,
    descMd: string,
    categories: string[],
    difficulty: number
  ) {
    this.title = title;
    this.descMd = descMd;
    this.topics = categories;
    this.difficulty = difficulty;
    this.id = id;
    this.displayedQuestion = `${id}.  ${title}`;
  }
}

export type QnFilter = {
  qnFilter?: string;
  tagFilter?: Set<string>;
  difficultyFilter?: [number, number];
  titleAscd?: boolean;
};
