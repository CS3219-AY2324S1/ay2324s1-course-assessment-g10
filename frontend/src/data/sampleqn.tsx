import { Question } from "../models/Question.model";
import { setQuestions } from "../reducers/questionsSlice";
import store from "../reducers/store";

const dummy = [
  [1, "Reverse a string", ["t2", "t3"], 0.1, "dummy 1"],
  [
    2,
    "Linked List Cycle Detection",
    ["t", "t2", "t3"],
    0.51,
    "# Dummy question descr \n ## kasodifjas \n asdfasdfa \n asdfsdf",
  ],
  [3, "Roman to Integer", ["t", "t2"], 0.92, "dummy 3"],
  [4, "Add Binary", ["t", "t2", "t3"], 1.33, "dummy 4"],
  [5, "Fibocacci Number", ["t3"], 1.74, "dummy 5"],
  [6, "Implement Stack using Queues", ["t", "t2", "t3"], 2.15, "dummy 6"],
  [7, "Combine Two Tables", ["t", "t2", "t3"], 2.56, "dummy 7"],
  [8, "Repeated DNA Sequences", ["t", "t2", "t3"], 2.97, "dummy 8"],
  [9, "Course Schedule", ["t", "t2", "t3"], 3.38, "dummy 9"],
  [10, "LRU Cache Design", ["t", "t2", "t3"], 3.79, "dummy 10"],
  [11, "Longest Common Subsequence", ["t", "t2", "t3"], 4.2, "dummy 11"],
  [12, "Rotate Image", ["t", "t2", "t3"], 4.61, "dummy 12"],
  [
    13,
    "Airplace Seat Assignment Probability",
    ["t", "t2", "t3"],
    5.02,
    "dummy 13",
  ],
  [14, "Validate Binary Search Tree", ["t", "t2", "t3"], 5.43, "dummy 14"],
  [15, "Sliding Window Maximum", ["t", "t2", "t3"], 5.84, "dummy 15"],
  [16, "N-Queen Problem", ["t", "t2", "t3"], 6.25, "dummy 16"],
  [
    17,
    "Serialize and Deseralize a Binary Tree",
    ["t", "t2", "t3"],
    6.66,
    "dummy 17",
  ],
  [18, "Wildcard Matching", ["t", "t2", "t3"], 7.07, "dummy 18"],
  [19, "Chalkboard XOR Game", ["t", "t2", "t3"], 7.48, "dummy 19"],
  [20, "Trips and Users", ["t", "t3"], 7.89, "dummy 20"],
];

export const dummyQn = dummy.map(
  //@ts-ignore
  (x) => new Question(x[0], x[0], x[1], x[4], x[2], x[3])
);

let hasLoadedBefore = false;

export const loadQuestions = async () => {
  if (hasLoadedBefore) return store.getState().questions.originalQuestions;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  store.dispatch(setQuestions(dummyQn));
  hasLoadedBefore = true;
};

export const getUnusedId = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    Math.max(
      ...store.getState().questions.originalQuestions.map((qn) => qn.id)
    ) + 1
  );
};
