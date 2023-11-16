import axios from 'axios'

export const qnServiceClient = axios.create({ baseURL: 'http://localhost:8080', withCredentials: true })
export const userServiceClient = axios.create({ baseURL: 'http://localhost:8081', withCredentials: true })

export const wsMatchMakeURL = 'http://localhost:8082'