import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social')

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    posts:{
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
        ref:'post'
    },
    followers:{
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
        ref:'user'
    },
    profilePic:{
        type:Buffer,
        default: null 
    },
    following:{
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
        ref:'user'
    },
})

const model=mongoose.model('user',userSchema);

export default model