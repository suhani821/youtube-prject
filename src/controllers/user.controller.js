import asyncHandler from "../utils/asynchandler.js";
const registerUser = asyncHandler( async( req, res)=>{
    //TO REGISTER USER


    //user details
    //check if user send correct and are not null
    //check if user already exist :username, email
    //check for images :avatar
    //upload them to cloudnary
    //if uploaded correctly
    //create user entry in database
    //remove password and refresh tokens from response
    //check for user creation
    //return response



    


    //data coming from form or json ( comes inside req.body)
const {username,email, password,fullname            }=req.body

})

export {registerUser};