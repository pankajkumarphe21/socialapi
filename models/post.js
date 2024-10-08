import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social')

const postSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    image:{
        type:Buffer,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    date:{
        type:Date,
        default:Date.now(),
        required:true
    }
})

const model=mongoose.model('post',postSchema);

export default model