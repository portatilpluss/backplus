import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config();


export const verifyToken = async (req, res, next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({error: true, message: "Invalid token!"})
     }

    try {
      const Verify = await jwt.verify(token, process.env.PRIVATE_KEY)
    
      next();
    } catch (error) {
         res.status(403).json({error: true,message: "Token is not valid!"})
    }
}