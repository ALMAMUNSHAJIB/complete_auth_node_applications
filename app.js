import express  from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectDb.js';


const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

//database
const DATABASE_URL = process.env.DATABASE_URL;
connectDB(DATABASE_URL);

//import file 
import userRouter from './router/user.js';
app.use('/api/user', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is runing at http://localhost:${port}`);
});