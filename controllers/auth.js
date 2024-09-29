import userModel from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const login = async(req, res) => {
    let {username,password}=req.body;
    const user=await userModel.findOne({username});
    if(!user){
        return res.status(404).json('Something went wrong!');
    }
    const isCorrect=bcrypt.compareSync(password,user.password);
    if(isCorrect){
        let token=jwt.sign({username,userId:user._id},process.env.SECRET || "shhhhhh");
        const {password,...others}=user;
        return res.cookie('token',token,{
            httpOnly:true,
        }).status(200).json(others);
    }
    return res.status(404).json('Something went wrong!')
}
export const register = async (req, res) => {
    let { username, fullname, password } = req.body;
    const users = await userModel.find({ username });
    if (users.length > 0) return res.status(409).json("Username already exists");
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = await userModel.create({
        username, fullname, password: hash
    })
    let token = jwt.sign({ username, userId: user._id },process.env.SECRET || 'shhhhhh');
    if(user){
        const {password,...others}=user;
        res.cookie('token',token,{
            httpOnly:true,
        }).status(200).json(others);
    }
}

export const profile=async(req,res)=>{
    const username=req.params.username;
    const user=await userModel.findOne({username});
    if(user){
        const {password,...others}=user;
        return res.status(200).json(others)
    }
    const data=null;
    return res.status(200).json(data);
}

export const logout=(req,res)=>{
    res.clearCookie('token',{
        secure:true,
        sameSite:"none"
    }).status(200).json('user logged out')
}