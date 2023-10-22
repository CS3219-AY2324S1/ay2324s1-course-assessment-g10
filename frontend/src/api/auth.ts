import { userServiceClient } from "./server"

export async function login(username: String, password: String) {
    const response = await userServiceClient.post('/login', {
        username: username,
        password: password
    })

    return response;
}

export async function register(username: String, password: String) {
    const response = await userServiceClient.post('/register', {
        username: username,
        password: password
    })

    return response;
}