
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose , {Schema} from "mongoose";
const UserSchema= new Schema({

    username:{
        type: String,
        required:true,
        index:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    email:{
type:String,
required:true,
unique:true,
trim: true,
lowercase:true
    },
    fullname:{
type:String,
required:true,
trim:true,

    },
    avatar:{
type:String,// url of cloudanary
required:true,


    },
coverimage:{
    type:String
},
watchHistory:[
    {
        type: Schema.Types.ObjectId,
        ref:"video"
    }
],
password:{
    type:String,
    required:[true, 'password is requied',]
},
refreshTokens:{
    type:String,

}



}
,
{
    timestamps:true
})
//password encryption before saving .
UserSchema.pre( "save",async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password , 8)
    next()// as we are dealing with middleware so using next to move on next middleware
})
//custom method for checking password is correct or not
UserSchema.methods.isPasswordCorrect = async function (passward){
return await    bcrypt.compare(password,this.password)//return value is boolean , compares user string to encrypted string
}
UserSchema.methods.generateAccessTokens=function (){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        fullname:this.fullname,
        email:this.email
    },
process.env.ACCESS_TOKEN_SECRET,
{

    expiresIn:  process.env.ACCESS_TOKEN_EXPIRY
})
}
UserSchema.methods.generateRefreshTokens=function (){return jwt.sign({
        _id:this._id,
    },
process.env.REFRESH_TOKEN_SECRET,
{

    expiresIn:  process.env.REFRESH_TOKEN_EXPIRY
})}

export  const User = mongoose.model("User", UserSchema)
