import axios from 'axios'

export const apiGatewayClient = axios.create({
    baseURL:'http://localhost:8000',
    withCredentials: true
})


export const executionServiceClient = axios.create({
    baseURL: "http://localhost:8090",
    withCredentials: true,
  });
  

export const wsMatchMakeURL = 'http://localhost:7999'
export const wsCollabUrl = 'ws://localhost:7998'
