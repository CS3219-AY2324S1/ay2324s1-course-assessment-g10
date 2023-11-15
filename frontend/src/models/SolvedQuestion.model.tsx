import { Question, QnFilter } from "./Question.model";

export class SolvedQuestion extends Question {
  solved: boolean;
  verdict: string;
  sourceCode: string;
  language: string;
  solvedDate: Date | undefined;

  constructor(
    _id: string,
    id: number,
    title: string,
    descMd: string,
    categories: string[],
    difficulty: number,
    verdict: string,
    sourceCode: string,
    language: string,
    solvedDate?: Date
  ) {
    super(_id, id, title, descMd, categories, difficulty);
    this.solved = verdict === "Accepted";
    this.verdict = verdict;
    this.solvedDate = solvedDate;
    this.sourceCode = sourceCode;
    this.language = language;
  }
}

// Define a filter for SolvedQuestions, similar to QnFilter
export type SolvedQnFilter = QnFilter & {
  solved?: boolean;
  solvedDate?: Date; // Change the type to Date
};
