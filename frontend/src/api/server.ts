import axios from 'axios'

export const apiGatewayClient = axios.create({
    baseURL:'http://localhost:8000',
    withCredentials: true
})
