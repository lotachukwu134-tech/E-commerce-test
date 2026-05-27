import jwt from 'jsonwebtoken';

//Return a promise so callers can "await" token
const generateToken = (payload, expiresIn='1d')=>{
    const secret = process.env.JWT_SECRET
    return new Promise((resolve, reject)=>{
        jwt.sign(payload, secret, {expiresIn}, (err, token)=>{
            if(err) return reject(err)
                resolve(token)
        })
    })
}
export default generateToken 