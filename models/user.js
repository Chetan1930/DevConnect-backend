const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true,
        unique:true,
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
    followers:{
        type:String,
        type: mongoose.Schema.Types.ObjectId,
              ref: 'Blog',
              required: true,
    },

    password:{
        type:String,
        trim:true,
        required:true,
    },
},{timestamps:true});


const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;