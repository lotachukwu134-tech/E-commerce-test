import { User } from '../models/userModel.js';
import bcryptjs from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

//REGISTER USER
 export const register = async(req, res)=>{
const {name, email, password, address}=req.body;
console.log(req.body);

const userExists = await User.findOne({email})

if(userExists){
    res.status(400).json({
        success:false,
        message:`user with this email ${email}already exists `
    })
}

try{

    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    const newUser = new User({
        name,
        email,
        password:hashedPassword,
        address

    })
    await newUser.save()

    const payload ={id:newUser._id, email:newUser.email};
    const token = await generateToken(payload,'1d')

    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:{
            id:newUser._id,
            name: newUser.name,
            email: newUser.email,
            address: newUser.address
        },
        token
    })

}catch(error){
    res.status(500).json({
        success:false,
        message:"error occured while registering user"
    })

}
}


//LOGIN USER
 export const login = async(req, res)=>{
    const { email, password}=req.body
    console.log(req.body)

    const existingUser = await User.findOne({email})
    console.log(existingUser)
    if(!existingUser){
        return res.status(404).json({
            success:false,
            message:"Invalid email or password"
        })
    }

    try{

        const samePassword = await bcryptjs.compare(password, existingUser.password);
        if(!samePassword){return res.status(401).json({
            success:false,
            message:"Invalid email or password"
        })
        }
        const payload = {id:existingUser._id, role:existingUser.role};
        const token = await generateToken(payload, '1d')

        res.status(200).json({
            success:true,
            message:"Login successful",
            token
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:"error occured during login"
        })

    }
}