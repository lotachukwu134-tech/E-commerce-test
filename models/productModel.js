import mongoose from "mongoose";

const productModel = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        required:true,
        enum:["shoes","bags","clothes"]
    },
    sizes:{
        type:[String],
        enum:["S","M","L","XL","XXl"]
    },
    colour:{
        type:[String],
        enum:["Black","White","Red","Blue","Green"]
    },
    stock:{
        type:Number, 
        required:true,
        default:0
    },
    images:[{type:String}], //an array of image URLs
    ratings:{average:{type:Number, default:0},
    count:{ type:Number, default:0}
    },
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
},{timestamps:true
})

export const Product = mongoose.model('products', productModel) 