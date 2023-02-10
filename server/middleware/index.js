import jwt from "jsonwebtoken"
import user from "../api/models/userSchema.js";
import config from "../config/index.js";

const authenticate=async(req,res,next)=>{
    try {
        const token=req.cookies.AmazonWeb;
        const tokenVerification=jwt.verify(token,config.secretKey)      
        // console.log('tokenVerification',tokenVerification); 
  
        const rootUser=await user.findOne({_id:tokenVerification._id,"tokens.token":token})
        // console.log("rootUser",rootUser. _id);

        if(!rootUser){throw new Error("user not found")}

        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser._id;

        next(); 


    } catch (error) {
        console.log("error in authentication",error)
        res.status(401).send("error in authentication",error)
        
    }
}

export default authenticate;