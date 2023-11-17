import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import { connectDB, initCounter } from './config/db';
import { populateData } from './config/populate_qns';
import questionRouter from './routes/questionRouter'
import { handleAuthFailure, jwtCheckRequireCredentials } from './middleware/jwtCheck';


connectDB().then((v) => {
    initCounter();
}).then(()=> {
    populateData();
});

const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,            //access-control-allow-credentials:true
}))

app.use(cookieParser());
//allows JSON data in request body to be parsed
app.use(express.json())
// allow URL-encoded data in request body to be parsed
app.use(express.urlencoded({ extended: false }))

// use the address router to handle requests 
// at http://localhost:8080/api/addresses
app.use('/api/questions', jwtCheckRequireCredentials ,questionRouter)
app.use(handleAuthFailure);

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }...`)
})
