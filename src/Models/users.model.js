
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
export const User = mongoose.model("User", UserSchema)
