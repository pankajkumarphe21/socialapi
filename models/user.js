import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social').then(()=>{
    console.log('connected')
})

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
    post:{
        type:[mongoose.Schema.ObjectId],
        default:[]
    },
    followers:{
        type:[mongoose.Schema.ObjectId],
        default:[]
    },
    following:{
        type:[mongoose.Schema.ObjectId],
        default:[]
    }
})

const model=mongoose.model('user',userSchema);

export default model