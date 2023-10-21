import express from 'express';
import userRouter from './routes/userRoutes';
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes'
import { Request } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8081;
const corsOptions ={
    origin:'http://localhost:3000', //TODO: need to add our production url here once we host it. Currently assuming all requests will be made from this url
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}


app.use(cookieParser());
app.use(cors<Request>(corsOptions));
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/', authRouter);


app.listen(PORT, () => {
    console.log(`User service is running on http://localhost:${PORT}`);
});