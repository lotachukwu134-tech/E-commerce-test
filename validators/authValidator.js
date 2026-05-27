import Joi from "joi";
import { Schema } from "mongoose";

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(8).required(),
    address:Joi.string().allow('', null)
})

export const loginSchema = Joi.object({
email:Joi.string().email().required(),
password:Joi.string().min(8).required()
})

export const editUserSchema =Joi.object({
    name:Joi.string().min(2).required(),
    address:Joi.object().allow(' ', null).optional()
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