export class Question {
  title: string;
  descMd: string;
  displayedQuestion: string;
  topics: string[];
  difficulty: number;
  id: number;
  _id: string;

  constructor(
    _id: string,
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
    this._id = _id;
    this.id = id;
    this.displayedQuestion = `${id}.  ${title}`;
  };
  
  setId(id: number) {
    this.id = id;
    this.displayedQuestion = `${id}.  ${this.title}`;
  }
}

export type QnFilter = {
  qnFilter?: string;
  tagFilter?: Set<string>;
  difficultyFilter?: [number, number];
  titleAscd?: boolean;
};
