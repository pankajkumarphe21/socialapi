import postModel from '../models/post.js'
import userModel from '../models/user.js'
import mongoose from 'mongoose';

export const createPost=async(req,res)=>{
    const user=await userModel.findOne({_id:req.user.userId});
    if(!user){
        return res.status(404).json('something went wrong');
    }
    if(req.file===undefined || req.file.buffer===undefined){
        return res.status(404).json('something went wrong');
    }
    const date=Date.now();
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
    if(req.body.desc===''){
        return res.status(403).json('description is needed')
    }
    const post=await postModel.create({userId:user._id,desc:req.body.desc,image:req.file.buffer,date});
    user.posts.push(post._id);
    await user.save();
    return res.status(200).json(post);
}

export const getPosts=async(req,res)=>{
    const user=await userModel.findOne({_id:req.user.userId});
    if(!user){
        return res.status(404).json('user not found');
    }
    const posts=await postModel.find({ userId: { $ne: user._id } }).sort({ date: -1 });
    let final=[];
    posts.forEach((post)=>{
        const base64Image = Buffer.from(post.image).toString('base64');
        const {image,...others}=post.toObject();
        let ans=others;
        ans.base64Image=base64Image;
        final.push(ans);
    });
    return res.status(200).json(final);
}

export const getUserPosts=async(req,res)=>{
    const user=await userModel.findOne({_id:req.user.userId});
    if(!user){
        return res.status(404).json('user not found');
    }
    const username=req.params.userId;
    const getUser=await userModel.findOne({username:username});
    const posts=await postModel.find({ userId: getUser  }).sort({ date: -1 });;
    let final=[];
    posts.forEach((post)=>{
        const base64Image = Buffer.from(post.image).toString('base64');
        const {image,...others}=post.toObject();
        let ans=others;
        ans.base64Image=base64Image;
        final.push(ans);
    });
    return res.status(200).json(final);
}

export const deletePosts=async(req,res)=>{
    const user=await userModel.findOne({_id:req.user.userId});
    if(!user){
        return res.status(404).json('user not found');
    }
    const postId=req.params.postId;
    const post=await postModel.findOne({ _id: postId  });
    if(post.userId!=req.user.userId){
        return res.status(401).json("can't delete other's post");
    }
    try {
        await postModel.deleteOne({ _id: postId });
        user.posts=user.posts.filter((post)=>{
            return post._id!=postId;
        })
        await user.save();
    } catch (error) {
        console.log(error)
    }
    return res.status(200).json('post deleted');
}

export const editPost=async(req,res)=>{
    const post=await postModel.findOne({_id:req.params.postId});
    if(post.userId!=req.user.userId){
        return res.status(401).json("can't edit other's post")
    }
    try {
        if(req.file===undefined || req.file.buffer===undefined){
            await postModel.findByIdAndUpdate(post._id,{desc:req.body.desc});
            await post.save();
        }
        else{
            await postModel.findByIdAndUpdate(post._id,{desc:req.body.desc,image:req.file.buffer});
            await post.save();
        }
        return res.status(200).json('post updated');
    } catch (error) {
        console.log(error)
    }
}

export const getPost = async (req, res) => {
    const postId = req.params.postId;

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: 'Invalid postId' });
    }

    try {
        const post = await postModel.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
};

export const likePost = async (req, res) => {
    const postId = req.params.postId;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: 'Invalid postId' });
    }
    try {
        const post = await postModel.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const temp=post.likes.filter((val)=>{
            return val==req.user.userId;
        })
        if(temp.length===1){
            post.likes=post.likes.filter((val)=>{
                return val!=req.user.userId;
            })
            await post.save();
            return res.status(200).json(post); 
        }
        post.likes.push(req.user.userId);
        await post.save();
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
};