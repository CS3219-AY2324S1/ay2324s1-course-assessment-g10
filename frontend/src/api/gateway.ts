import axios from 'axios'

export const qnServiceClient = axios.create({ baseURL: 'http://localhost:8080', withCredentials: true })
