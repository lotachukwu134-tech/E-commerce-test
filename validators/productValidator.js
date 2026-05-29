import Joi from "joi";
import { Schema } from "mongoose";

export const validCreateProduct =  Joi.object({
name: Joi.string().min(2).max(30).required(),
description: Joi.string().min(10).required(),
price:Joi.number().min(0).required(),
category: Joi.string().valid("shoes","bags","clothes").required(),
sizes: Joi.string().valid("S","M","L","XL","XXL"),
colour:Joi.string().valid("Black","White","Red","Blue","Green"),
stock:Joi.number().min(0).required(),
images:Joi.array().items(Joi.string().uri())
})

const validate =(Schema)=>(req,res,next)=>{
const {error} = Schema.validate(req.body,{abortEarly:false})
if(error)
     return res.status(400).json({
    success:false,
    errors:error.details.map(d=>d.message)

})
next();
}

export default validate