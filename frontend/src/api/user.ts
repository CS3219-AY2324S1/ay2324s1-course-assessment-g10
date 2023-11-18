import { Axios, AxiosResponse } from "axios";
import { SolvedQuestion } from "../models/SolvedQuestion.model"; // Import the SolvedQuestion model
import { apiGatewayClient } from "./gateway";

/**
 * Fetch questions completed by the user.
 * @param userId - The ID of the user for whom you want to fetch completed questions.
 * @returns An array of completed questions.
 */
export async function fetchUserCompletedQuestions(
  userId: number
): Promise<SolvedQuestion[]> {
  try {
    const response: AxiosResponse = await apiGatewayClient.get(
      `/api/users/${userId}/questions`
    );

    const resData = response.data;
    const completedQuestions: SolvedQuestion[] = resData.map(
      (q: any) =>
        new SolvedQuestion(
          q.question__id,
          q.questionId,
          q.questionTitle,
          "", // not impt
          q.topics,
          q.difficulty,
          q.verdict,
          q.sourceCode,
          q.language,
          q.answeredAt // Default value for solvedDate
        )
    );

    return completedQuestions;
  } catch (error) {
    // Handle errors appropriately, e.g., log the error, return an empty array, or throw an error.
    console.error(error);
    throw error;
  }
}

// /**
//  * Add a new question to the user's completed questions.
//  * @param userId - The ID of the user to whom you want to add the question.
//  * @param questionId - The ID of the question you want to add.
//  * @param complexity - The complexity of the question.
//  * @param category - The category of the question.
//  * @returns The added question.
//  */
// export async function addUserQuestion(
//   userId: number,
//   questionId: string,
//   complexity: number,
//   category: string[]
// ): Promise<SolvedQuestion> {
//   try {
//     const response: AxiosResponse = await apiGatewayClient.post(
//       `/api/users/${userId}/addquestions`,
//       {
//         userId,
//         questionId,
//         complexity,
//         category,
//       }
//     );

//     const resData = response.data;
//     const addedQuestion: SolvedQuestion = new SolvedQuestion(
//       resData._id,
//       resData.id,
//       resData.title,
//       resData.description,
//       resData.topics,
//       resData.difficulty,
//       resData.verdict,
//       resData.sourceCode,
//       resData.language,
//       undefined // Default value for solvedDate
//     );

//     return addedQuestion;
//   } catch (error) {
//     // Handle errors appropriately, e.g., log the error or throw it to be handled by the caller.
//     console.error(error);
//     throw error;
//   }
// }


/**
 * Tries to find users with a username that matches `query`
 * @param query 
 * @returns A list of users and their details
 */
export async function findUsers(query : string) {

  const response : AxiosResponse = await apiGatewayClient.post(
    `/api/users/findusers`, {
      query
    }
  )

  const resData = response.data;
  return resData;

}

export async function getUserProfile(id: string) {
  
  const response : AxiosResponse = await apiGatewayClient.get(`/api/users/${id}`);

  return response.data;
}

export function getProfilePicUrl(profilePicFileName : string | null) {
  if (null) {
    return undefined;
  }

  return apiGatewayClient.getUri({url: `/api/users/uploads/${profilePicFileName}`});
}



export async function deleteUser(id: number) {
  const response = await apiGatewayClient.delete(`/api/users/${id}`)

  return response;
}