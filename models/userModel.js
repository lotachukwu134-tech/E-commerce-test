import mongoose, { Mongoose } from "mongoose";

const userModel = new mongoose.Schema({

name:{
    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true
},
password:{
    type:String,
    required:true,
    minlength:8
},
role:{
    type:String,
    enum:['customer', 'admin'],
    default:'customer'
},
address:{
    street:String,
    city:String,
    state:String,
    country:String
},
createdAt:{
    type:Date,
    default: Date.now
}
});

export const User = mongoose.model('user', userModel)