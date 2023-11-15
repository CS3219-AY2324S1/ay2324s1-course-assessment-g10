import axios from "axios";
import { judge0Result, submissionResult } from "./types";

type Question = {
  id: number;
  _id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: number;
};

const fetchQn = async (id: string) => {
  const response = await axios.get<Question>(
    `http://question-service:8080/api/questions/${id}`
  );
  return response.data;
};

export const submitSubmission = async (
  verdict: string,
  language: string,
  qid: string,
  userId: number,
  sourceCode: string
) => {
  const question = await fetchQn(qid);
  const submission = {
    userId: userId,
    questionTitle: question.title,
    questionId: question.id,
    difficulty: question.difficulty,
    topics: question.topics,
    verdict: verdict,
    sourceCode: sourceCode,
    language: language,
  };
  await axios.post(
    `http://user-service:8081/api/users/${userId}/addquestions`,
    submission
  );
};
