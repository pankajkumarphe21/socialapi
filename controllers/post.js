import postModel from '../models/post.js'
import userModel from '../models/user.js'

export const createPost=async(req,res)=>{
    const user=await userModel.findOne({_id:req.user.userId});
    if(!user){
        return res.status(404).json('user not found');
    }
    const post=await postModel.create({userId:user._id,desc:req.body.desc,image:req.file.buffer});
    return res.status(200).json(post);
}

export const getPosts=async(req,res)=>{
    const user=await userModel.findOne({_id:req.user.userId});
    if(!user){
        return res.status(404).json('user not found');
    }
    const posts=await postModel.find();
    let final=[];
    posts.forEach((post)=>{
        const base64Image = Buffer.from(post.image).toString('base64');
        const {image,...others}=posts;
        const ans={...others,base64Image};
        final.push(ans);
    });
    return res.status(200).json(final);
}