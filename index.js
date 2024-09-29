import express from "express";
import authRoutes from './routes/auth.js'
import cors from 'cors'
import cookieParser from "cookie-parser";

const app=express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next();
});
app.use(express.json());
app.use(cors({
    origin:process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials:true
}));
app.use(cookieParser());

app.use('/auth',authRoutes);

app.listen(8800,()=>{
    console.log('Api working')
})