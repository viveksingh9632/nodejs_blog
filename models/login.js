const mongoose =require('mongoose')
const loginSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        require:true,
        default:Date.now,
    }
})


module.exports=mongoose.model('Login',loginSchema)