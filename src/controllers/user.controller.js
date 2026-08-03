import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../Models/users.model.js"
import { cloudanaryFileUpload } from "../utils/cloudinary.uploadedfilehandling.js"
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import { useSyncExternalStore } from "react";
const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({ message:"ok"

    //  });
    //TO REGISTER USER


    //user details
    //check if user send correct and are not null
    //check if user already exist :username, email
    //check for images :avatar
    //upload them to cloudnary
    //if uploaded correctly
    //create user entry in database
    //remove password and   refresh tokens from response
    //check for user creation
    //return response


    //data coming from form or json ( comes inside req.body)


    const {fullname, username, email, password } = req.body;
    console.log(username, "/n", email)
    //validate data send by user
    //  if (fullname===""||name===""||password===""|| email===""){
    //     throw new ApiError("all  fields are mendatiary" ,400)

    //  } 

    if ([ fullname , email, password, username].some((field) => 
        field?.trim() === ""
    )) {
        throw new ApiError("all fields are required", 400)
    }

    //to check if user is already registered(registed in database)
    const existed_user = await User.findOne({//findone sabse phela username ya email nikal ker dedega
        $or: [{username}, {email}]
    })
    if (existed_user) {
        throw new ApiError("user already existed , kindly login", 408)
    }

    //to upload files in server
    const avatar_localpath = req.files?.avatar[0]?.path
    const coverimage_localpath = req.files?.coverimage[0]?.path
    if (!avatar_localpath || !coverimage_localpath) {
        throw new ApiError('reupload your avatar and cover image', 407)
    }

    //upload on cloudinary
    const avatar = await cloudanaryFileUpload(avatar_localpath)
    const coverimage = await cloudanaryFileUpload(coverimage_localpath)
    if (!avatar) {
        throw new ApiError("upload avatar again", 403)
    }
    if (!coverimage) {
        throw new ApiError("upload coverimage again", 403)
    }

    //to create db entry
    const user = await User.create({
        fullname,
        avatar: avatar.url,//as getting all response fields from cloudinary
        coverimage: coverimage.url, //if it was not compulsory coverimage?.url || ""
        email,
        password,
        username: username.toLowerCase(),//database m username in lowercase
    })

    // to check if database me user ke entry hue ya nhi

    const Usercreated = await User.findById(user._id).select("-password  -refreshTokens ") /* - :removing these fields  */
    if (!Usercreated) {
        throw new ApiError("user not stored in database", 500)

    }

    //return api response
    return res.status(200).json(
        new ApiResponse (200 ,Usercreated,"user registered successfully")
    )
})


export { registerUser };