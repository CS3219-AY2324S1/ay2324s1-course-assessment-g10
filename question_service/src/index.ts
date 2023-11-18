import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, initCounter } from './config/db';
import { populateData } from './config/populate_qns';
import questionRouter from './routes/questionRouter'


dotenv.config();

connectDB().then((v) => {
    initCounter();
}).then(()=> {
    populateData();
});

const app = express()

//allows JSON data in request body to be parsed
app.use(express.json())
// allow URL-encoded data in request body to be parsed
app.use(express.urlencoded({ extended: false }))

// use the address router to handle requests 
// at http://localhost:8080/api/addresses
app.use('/api/questions', questionRouter)


const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }...`)
})
