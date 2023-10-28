import { Question, QnFilter } from "./Question.model";

export class SolvedQuestion extends Question {
  solved: boolean;
  solvedDate: Date | undefined; 

  constructor(
    _id: string,
    id: number,
    title: string,
    descMd: string,
    categories: string[],
    difficulty: number,
    solved: boolean = false,
    solvedDate?: Date 
  ) {
    super(_id, id, title, descMd, categories, difficulty);
    this.solved = solved;
    this.solvedDate = solvedDate;
  }
}

// Define a filter for SolvedQuestions, similar to QnFilter
export type SolvedQnFilter = QnFilter & {
  solved?: boolean;
  solvedDate?: Date; // Change the type to Date
};
