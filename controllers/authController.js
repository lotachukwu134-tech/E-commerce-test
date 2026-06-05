import { User } from '../models/userModel.js';
import bcryptjs from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

//REGISTER USER
 export const register = async(req, res)=>{
const {name, email, password, address}=req.body;
//console.log(req.body);

const userExists = await User.findOne({email})

if(userExists){
   return res.status(400).json({
        success:false,
        message:`user with this email ${email} already exists ` 
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
    //console.log(newUser)

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
    //console.log(req.body)

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

//GET CURRENT LOGGED IN USER
export const getUser = async (req, res) => {
  try {
    // req.user is already attached by authMiddleware — no :id param needed
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching user',
    });
  }
};

//UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { name, address } = req.body;

    // req.user._id comes from the JWT — users can only update themselves
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (address) user.address = address;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating user',
    });
  }
};

//CHANGE PASSWORD
export const changePassword = async(req,res)=>{
    try{
        const {id}=req.user
        const {password, newPassword}=req.body

        const user = await User.findOne({_id:id})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User does not exist"
            })
        }
         const samePassword = await bcryptjs.compare(password, user.password);
        if(!samePassword){return res.status(401).json({
            success:false,
            message:"Invalid id or password"
        })
        }
        const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(newPassword, saltRounds);
    user.password = hashedPassword
    await user.save();

    return res.status(200).json({
        success:true,
        message:"Password reset successful"
    })
    }catch(error){
return res.status(500).json({
    success:false,
    message:"error occured"
})
    }
}