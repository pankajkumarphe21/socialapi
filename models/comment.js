import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social')

const commentSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    content:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now(),
        required:true
    }
})

const model=mongoose.model('comment',commentSchema);

export default model