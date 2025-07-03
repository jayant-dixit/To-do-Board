import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import connectToDB from './config/dbConnect.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

await connectToDB(); // connect to MongoDB database

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the Express server!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
