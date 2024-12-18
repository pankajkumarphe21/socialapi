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
        const {password,...others}=user.toObject();
        return res.cookie('token',token,{
            httpOnly:true,
            secure: true, 
            sameSite: 'None',
            maxAge: 3600 * 1000 * 24 * 21 ,
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
        const {password,...others}=user.toObject();
        res.cookie('token',token,{
            httpOnly:true,
            secure: true, 
            sameSite: 'None',
            maxAge: 3600 * 1000 * 24 * 21 ,
        }).status(200).json(others);
    }
}

export const profile=async(req,res)=>{
    const username=req.params.username;
    const user=await userModel.findOne({username});
    if(user){
        const userObject = user.toObject();
    const { password, ...data } = userObject;
    return res.status(200).json(data);
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

export const search=async (req,res)=>{
    const start=req.params.friend;
    const users=await userModel.find({username:{$regex:`^${start}`}})
    const final=[];
    users.map((user)=>{
        const {password,...data}=user.toObject();
        final.push(data);
    })
    return res.status(200).json(final)
}

export const getUser=async (req,res)=>{
    const userId=req.params.userId;
    const user=await userModel.findOne({_id:userId});
    const userObject = user.toObject();
    const { password, ...data } = userObject;
    return res.status(200).json(data);
}

export const setProfilePic=async (req,res)=>{
    const userId=req.params.userId;
    const user=await userModel.findOne({_id:userId});
    if(user._id!=req.user.userId){
        return res.status(401).json("u can't change others pic")
    }
    if(req.file===undefined || req.file.buffer===undefined){
        user.profilePic=null;
        await user.save();
        const {password,...others}=user.toObject();
        return res.status(200).json(others);
    }
    const allowed=['svg','webp','png','jpg','jpeg'];
    let flag=0;
    for(let i=0;i<allowed.length;i++){
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1]==allowed[i]){
            flag=1;
        }
    }
    if(!flag){
        return res.status(403).json('file extension should be svg or webp or png or jpg or jpeg ')
    }
    user.profilePic=req.file.buffer;
    await user.save();
    const {password,...others}=user.toObject();
    return res.status(200).json(others);
}

export const followUser=async(req,res)=>{
    const followerId=req.user.userId;
    const username=req.params.username;
    const user=await userModel.findOne({username});
    const otherUser=await userModel.findOne({_id:followerId});
    const arr=user.followers;
    const newArr=arr.filter((userId)=>{
        return userId==followerId;
    });
    if(newArr.length===1){
        user.followers=user.followers.filter((userId)=>{
            return userId!=followerId;
        });
        otherUser.following=otherUser.following.filter((userId)=>{
            return userId!=user._id.toString();
        });
    }
    else{
        user.followers.push(otherUser._id);
        otherUser.following.push(user._id);
    }
    await user.save();
    await otherUser.save();
    const {password,...others}=otherUser.toObject();
    return res.status(200).json(others);
}