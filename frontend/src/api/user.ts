import { Axios, AxiosResponse } from "axios";
import { SolvedQuestion } from "../models/SolvedQuestion.model"; // Import the SolvedQuestion model
import { userServiceClient } from "./server";

/**
 * Fetch questions completed by the user.
 * @param userId - The ID of the user for whom you want to fetch completed questions.
 * @returns An array of completed questions.
 */
export async function fetchUserCompletedQuestions(
  userId: String
): Promise<SolvedQuestion[]> { 
  try {
    const response: AxiosResponse = await userServiceClient.get(
      `/api/users/${userId}/questions`
    );

    const resData = response.data;
    const completedQuestions: SolvedQuestion[] = resData.map(
      (q: any) =>
        new SolvedQuestion(
          q._id,
          q.id,
          q.title,
          q.description,
          q.topics,
          q.difficulty,
          false, // Default value for solved
          undefined // Default value for solvedDate
        )
    );

    return completedQuestions;
  } catch (error) {
    // Handle errors appropriately, e.g., log the error, return an empty array, or throw an error.
    console.error(error);
    throw error;
  }
}

/**
 * Add a new question to the user's completed questions.
 * @param userId - The ID of the user to whom you want to add the question.
 * @param questionId - The ID of the question you want to add.
 * @param complexity - The complexity of the question.
 * @param category - The category of the question.
 * @returns The added question.
 */
export async function addUserQuestion(
  userId: number,
  questionId: string,
  complexity: number,
  category: string[]
): Promise<SolvedQuestion> { 
  try {
    const response: AxiosResponse = await userServiceClient.post(
      `/api/users/${userId}/addquestions`,
      {
        userId,
        questionId,
        complexity,
        category,
      }
    );

    const resData = response.data;
    const addedQuestion: SolvedQuestion = new SolvedQuestion(
      resData._id,
      resData.id,
      resData.title,
      resData.description,
      resData.topics,
      resData.difficulty,
      false, // Default value for solved
      undefined // Default value for solvedDate
    );

    return addedQuestion;
  } catch (error) {
    // Handle errors appropriately, e.g., log the error or throw it to be handled by the caller.
    console.error(error);
    throw error;
  }
}


/**
 * Tries to find users with a username that matches `query`
 * @param query 
 * @returns A list of users and their details
 */
export async function findUsers(query : string) {

  const response : AxiosResponse = await userServiceClient.post(
    `/api/users/findusers`, {
      query
    }
  )

  const resData = response.data;
  return resData;

}

export async function getUserProfile(id: string) {
  
  const response : AxiosResponse = await userServiceClient.get(`/api/users/${id}`);

  return response.data;
}

export function getProfilePicUrl(profilePicFileName : string | null) {
  if (null) {
    return undefined;
  }

  return userServiceClient.getUri({url: `/api/users/uploads/${profilePicFileName}`});
}
