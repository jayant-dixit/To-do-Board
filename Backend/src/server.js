import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import connectToDB from './config/dbConnect.js';
import authRouter from './routes/auth.routes.js';
import boardRouter from './routes/board.routes.js';
import isAuthenticated from './utils/isAuthenticated.js';
import taskRouter from './routes/task.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT || 3000;

await connectToDB(); // connect to MongoDB database

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    return res.send('Welcome to the Express server!');
});

app.use('/api/auth', authRouter);
app.use('/api/board', boardRouter);
app.use('/api/task', isAuthenticated, taskRouter);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
