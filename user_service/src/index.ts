import express from 'express';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import cookieParser from 'cookie-parser'

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cookieParser());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/', authRouter);


app.listen(PORT, () => {
    console.log(`User service is running on http://localhost:${PORT}`);
});