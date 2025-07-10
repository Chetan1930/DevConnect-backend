const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    },

    password:{
        type:String,
        trim:true,
        required:true,
    },
},{timestamps:true});


module.exports = mongoose.model("User",userSchema);