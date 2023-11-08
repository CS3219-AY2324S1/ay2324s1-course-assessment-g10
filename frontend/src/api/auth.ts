import { userServiceClient } from "./server"

/**
 * Makes a login request and sets the access_token if successful
 * 
 * @param username 
 * @param password 
 */
export async function login(username: String, password: String) {
    const response = await userServiceClient.post('/login', {
        username: username,
        password: password
    })

    return response;
}


/**
 * Registers the user and sets the access_token if successful
 * 
 * @param username 
 * @param password 
 */
export async function register(username: String, password: String) {
    const response = await userServiceClient.post('/register', {
        username: username,
        password: password
    })

    return response;
}

/**
 * Gets the current session user using the httpOnly cookie
 * 
 * @returns the user if succesfully authenticated, else the error response
 * @side_effects A failure to authenticate the JWT token will cause the server side 
 * to set the AUTH_SESSION cookie on the frontend to null
 */
export async function getSessionUser() {
    const response = await userServiceClient.get('/getSessionUser');
    
    try {
        return response.data.user;
    } catch (error) {
        return response
    }
}

/**
 * Logs the user out and server sets the token to expire
 */
export async function logOut() {
    const response = await userServiceClient.get('/logout');
    return response;
}


/**
 * Changes the user's password
 */

export async function changePassword(newPassword: string, currPassword: string) {
    const response = await userServiceClient.post('/changepassword', {
        newPassword: newPassword, 
        currPassword: currPassword
    })

    return response;
}

/**
 * Updates the user's profile
 */
export async function updateUserProfile(username : string, bio: string | null) {

    const response = await userServiceClient.post('/updateProfile', {
        username: username,
        bio: bio,
    })

    return response;
}