import { AxiosResponse } from "axios";
import { userServiceClient } from "./gateway";

/**
 * Tries to find users with a username that matches `query`
 * @param query 
 * @returns A list of users and their details
 */
export async function findUsers(query : string) {

  const response: AxiosResponse = await userServiceClient.post(
    `/api/users/findusers`, {
      query
    }
  )

  const resData = response.data;
  return resData;

}

export async function getUserProfile(id: string) {
  
  const response: AxiosResponse = await userServiceClient.get(`/api/users/${id}`);

  return response.data;
}

export function getProfilePicUrl(profilePicFileName : string | null) {
  if (null) {
    return undefined;
  }

  return userServiceClient.getUri({ url: `/api/users/uploads/${profilePicFileName}` });
}



export async function deleteUser(id: number) {
  const response = await userServiceClient.delete(`/api/users/${id}`)

  return response;
}