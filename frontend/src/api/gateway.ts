import axios from 'axios'

const backendHost = process.env.REACT_APP_BACKEND_HOST;

export const apiGatewayClient = axios.create({
    baseURL: process.env.NODE_ENV === 'production'? `http://${backendHost}:8000` : 'http://localhost:8000' ,
    withCredentials: true
})


export const wsMatchMakeURL = process.env.NODE_ENV === 'production'? `http://${backendHost}:7999` : 'http://localhost:7999'
export const wsCollabUrl = process.env.NODE_ENV === 'production'? `ws://${backendHost}:8083` :'ws://localhost:8083'
