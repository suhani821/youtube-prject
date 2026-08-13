import { jwt } from "jsonwebtoken"
import ApiError from "../utils/apierror.js"
import asyncHandler from "../utils/asynchandler.js"
import { User } from "../Models/users.model.js"

//to varify if user is there or not
export const verifyjwt=asyncHandler ( async(req,res,next)=>{
try {
    const token = req.cookies?.accessToken|| req.header()
    ("Authorization")?.replace("Bearer", "")
    if(!token){
        throw  new ApiError("token not found",402)
    }
     const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      const user=await User.findById(decodedtoken?._id).select("-password -refreshTokens")
    if(!user){
        throw new ApiError("user not found", 405)
    }
    req.user= user;
    next()
} catch (error) {
    throw new ApiError(error?.message || "invalid access token", 401)
}
})