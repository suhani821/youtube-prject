import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../Models/users.model.js"
import { cloudanaryFileUpload } from "../utils/cloudinary.uploadedfilehandling.js"
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
const generatngAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        console.log("USER FOUND:", !!user);

        const refreshToken = user.generateRefreshTokens();
        console.log("REFRESH TOKEN GENERATED");

        const accessToken = user.generateAccessTokens();
        console.log("ACCESS TOKEN GENERATED");

        user.refreshTokens = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("========== TOKEN ERROR ==========");
        console.error(error);
        console.error("================================");

        throw new ApiError(
            "Something went wrong in generating refresh or access token", 500

        );
    }
};
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


    const { fullname, username, email, password } = req.body;
    console.log(username, "/n", email)
    //validate data send by user
    //  if (fullname===""||name===""||password===""|| email===""){
    //     throw new ApiError("all  fields are mendatiary" ,400)

    //  } 

    if ([fullname, email, password, username].some((field) =>
        field?.trim() === ""
    )) {
        throw new ApiError("all fields are required", 400)
    }

    //to check if user is already registered(registed in database)
    const existed_user = await User.findOne({//findone sabse phela username ya email nikal ker dedega
        $or: [{ username }, { email }]
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
        new ApiResponse(200, Usercreated, "user registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    //req body-> data
    //if fields are empty return all fields are required
    //if user doesnot exist -  do register
    //if username , email , passsword is correct 
    //sending access and refresh tokens
    //send cookies
    //login successfully




    //data from body
    const { username, email, password } = req.body
    if (!username && !email) {
        throw new ApiError("enter username or email", 406);

    }
    //to find user based on email or username
    const registeredUser = await User.findOne({
        $or: [{ username }, { email }]
    })//either to find using email or using username

    //if user doesnot exists
    if (!registeredUser) {
        throw new ApiError("user is not registered", 423)
    }
    //is password correct
    const isCorrect = await registeredUser.isPasswordCorrect(password)//user is for using function made inside user function inside user.model.js where as User is for accessing function from mongooese liberary
    if (!isCorrect) {
        throw new ApiError("password is not correct ", 411);

    }

    const { accessToken, refreshToken } = await generatngAccessAndRefreshTokens(registeredUser._id)
    const loggedinUser = await User.findById(registeredUser._id).select("-password -refreshTokens ")
    //sending cookies securly
    const option = {
        secure: true,//visible in frontend but can be modified by server only , 
        httpOnly: true
    }
    return res.status(200).cookie("accessToken", accessToken, option)// accessToken value... (ensure security)
        .cookie("refreshToken", refreshToken, option).json(new ApiResponse(200, { user: loggedinUser, accessToken, refreshToken }, "user logged in successfully"))

})
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "current user fetch successfully"))
})

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id), {
        $set: {
            refreshTokens: undefined
        }
    }, {
        new: true
    }
    const option = {
        secure: true,//visible in frontend but can be modified by server only , 
        httpOnly: true
    }
    return res.status(200).clearCookie("accessToken", option).clearCookie("refreshToken", option).json(new ApiResponse(200, {}, "successfully logout "))
}
)

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError("unable to access refresh tokens", 406)
    }
    try {
        const decodedToken = jwt.verify(refreshAccessToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError("user not found", 406)

        }
        if (incomingRefreshToken !== user?.refreshTokens) {
            throw new ApiError("invalid refresh token", 422)
        }
        const options = {//options are used whenever we want to send data  in cookies in users device
            httpOnly: true,
            secure: true
        }
        const { accessToken, newrefreshToken } = await generatngAccessAndRefreshTokens(user._id)
        return res.status(200).cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(ApiResponse(200, { accessToken, refreshToken: newrefreshToken }, "access token refresh successfully"))

    } catch (error) {
        console.error("error in refreshing refresh token", error)
        throw new ApiError(error?.message || "not refreshed ", 405)
    }
}
)
const createNewPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError("password is incorrect , enter correct password ", 233)
    }
    user.password = newPassword;
    await user.password.save({ validateBeforeSave: false })
    return res.status(200).json(new ApiResponse(200, {}, "new password created successfully"))
})


const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body
    if (!email || !fullname) {
        throw new ApiError("enter name or email to change", 400)
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            email,//email = email
            fullname //fullname= fullname
        }
    },
        { new: true })//this helps to return updated information 
        .select("-password")
    return res.status(200).
        json(new ApiResponse(200, updatedUser, "user is updated"))
})


const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatar = req.body
    const avatar_localpath = req.file?.path
    if (!avatar_localpath) {
        throw new apierror("file does not exitst", 402)

    }
    const cloundinaryAvatarPath = await cloudanaryFileUpload(avatar_localpath)
    if (!cloundinaryAvatarPath.url) {
        throw new apierror("file is not uploaded to cloudinary", 400)
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: { avatar: avatar_localpath.url }
    }, { new: true }).select("-password")
    return res.status(200).json(new ApiResponse(200, user, "userAvatar changed successfully"))
})

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverimage = req.body
    const coverimage_url = req.file?.path
    if (!coverimage_url) {
        throw new apierror("coverimage not uploaded", 444)

    }
    const cloudanary_coverimage = await cloudanaryFileUpload(coverimage_url)
    if (!cloudanary_coverimage.url) {
        throw new apierror("coverimage not uploaded on cloudanary", 400)
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            coverimage: cloudanary_coverimage.url
        }
    }, { new: true }).select("-password")
    return res.status(200).json(new ApiResponse(200, user, "coverimage changed successfully"))

})


const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params //taking username from url
    if (!username?.trim()) {
        throw new apierror("username not found", 400)

    }
    const channel = await User.aggregate([{
        $match: {
            username: username?.toLowerCase()
        },
        $lookup: {//searching all field having a same channel and putting in one document
            from: "supscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
        },
        $lookup: {
            from: "supscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo"
        },
        $addFields: {//adding  subscribercount and subscibedtocount fields to main user model 
            subscribersCount: {
                size: "$subscribers"// counting all channel
            },
            subscirbedToCount: {
                size: "$subscribedTo"
            },
            isSubscribed: {
                $cond: {
                    if: { $in: [req, user?._id, "$subscribers.subscriber"] },//[what to find,where to find]
                    then: true,//subscribed
                    else: false// not yet subscribed
                }
            }

        },
        $project: {// projects(returns) only selected field
            fullname: 1,
            username: 1,
            subscirbedToCount: 1,
            subscribersCount: 1,
            email: 1,
            coverimage: 1,
            avatar: 1,
            isSubscribed: 1,
        }

    }])
    if (!channel?.length) {
    throw new apierror("channel does not have any value", 400)

}
return res.status(200).json(new ApiResponse(200,channel[0],"user info fetched successfully"))
})
 const getWatchHistory = asyncHandler(async(req,res)=>{
    
const user = await User.aggregate([
    {
        $match: {
            _id: new mongoose.Types.ObjectId(req.user._id)
        },
        $lookup:{
            from:"videos",
            localField:"watchHistory",
            foreignField:"_id",
            as:"watchhistory",
            pipeline:[
                {
                $lookup:{
                    from:"users",
                    localField:"Owner",
                    foreignField:"_id",
                    as:"Owner",
                    pipeline:[{
                        $project:{// ower field only return username,fullname , avatar
                            username:1,
                            fullname:1,
                            avatar:1
                        }
                    }]
                }
            },{// for frontend easiness


                $addFields:{
                    owner: {
                        $first: "owner"
                    }
                }
            }]
        }
    }

return res.status(200).json(new ApiResponse(200,user[0].watchHistory,"all watched videoes are fetched successfully"))
])

 })



export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    createNewPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    updateCoverImage,
    getUserProfile,
    getWatchHistory
};