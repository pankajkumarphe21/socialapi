import express from "express";
import authRoutes from './routes/auth.js'
import postRoutes from './routes/post.js'
import cors from 'cors'
import cookieParser from "cookie-parser";

const app=express();

app.use(express.json());
app.use(cors({
    origin:process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials:true
}));
app.use(cookieParser());

app.use('/auth',authRoutes);
app.use('/post',postRoutes);

app.listen(process.env.PORT || 8800)