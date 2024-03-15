const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true, 
  },
  phone: {
    type: Number,
    required: true, 

  },
  password: {
    type: String,
    required: true, 
  },
  created:{
    type:Date,
    require:true,
    default:Date.now,
}
})

// Hash the password before saving to the database
userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});



module.exports=mongoose.model('User',userSchema)