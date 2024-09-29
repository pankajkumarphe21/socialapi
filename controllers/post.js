import postModel from '../models/post.js'
import userModel from '../models/user.js'

export const createPost=async(req,res)=>{
    const user=await userModel.findOne({_id:req.user.userId});
    if(!user){
        return res.status(404).json('user not found');
    }
    const post=await postModel.create({userId:user._id,desc:req.body.desc,image:req.file.buffer});
    console.log(req.file.buffer);
    return res.status(200).json('post created');
}

export const getPosts=async(req,res)=>{
    const user=await userModel.findOne({_id:req.user.userId});
    if(!user){
        return res.status(404).json('user not found');
    }
    const post=await postModel.find();
    return res.status(200).json(post);
}