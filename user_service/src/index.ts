import express, { Request, Response } from 'express';
import userRouter from './routes/userRoutes';
import { connectDB } from './config/db';

const app = express();
const PORT = process.env.PORT || 8081;

connectDB()

app.use('/api/users', userRouter)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});