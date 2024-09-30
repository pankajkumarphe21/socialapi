import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social')

const postSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    image:{
        type:Buffer,
        required:true
    },
    desc:{
        type:String,
        required:true
    }
})

const model=mongoose.model('post',postSchema);

export default model