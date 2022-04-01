import mongoose from "mongoose";
const {Schema, model} = mongoose;

const userSchema = Schema({    
   name:{
       type: String, 
       required: true, 
       trim: true
    },
   email:{
       type: String, 
       required: true, 
       trim: true
    },
   password:{
       type: String, 
       required: true, 
       trim: true
    },
   tc:{
       type: Boolean, 
       required: true,
    },
}, {
    timestemps: true
});


const User = model('User', userSchema);

export default User;