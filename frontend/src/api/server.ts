import axios from 'axios'

export const userServiceClient = axios.create({
    baseURL:'http://localhost:8081'
})

export const questionServiceClient = axios.create({
    baseURL:'http://localhost:8080'
})

