import express, { Request, Response } from 'express';
import userRouter from './routes/userRoutes';

const app = express();
const PORT = 3000;

app.use('/api/users', userRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('User Service Backend with TypeScript & Express!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});