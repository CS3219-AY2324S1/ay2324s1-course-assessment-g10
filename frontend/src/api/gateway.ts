import axios from 'axios'

export const apiGatewayClient = axios.create({
    baseURL: process.env.NODE_ENV === 'production'? 'http://peerprep-g10.com:8000' : 'http://localhost:8000' ,
    withCredentials: true
})


export const wsMatchMakeURL = process.env.NODE_ENV === 'production'? 'http://peerprep-g10.com:7999' : 'http://localhost:7999'
export const wsCollabUrl = process.env.NODE_ENV === 'production'? 'ws://peerprep-g10.com:8083' :'ws://localhost:7998'
