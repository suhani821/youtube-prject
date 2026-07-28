
import mongoose ,{Schema} from "mongoose";
const videoschema= new Schema({
    videoFile:{
type:String,//cloudanary url
required:true,
    },
    Thumbnail:{
type:String,//cloudanary url
required:true,
    },
title:{
    type:String,
    required:true,
    trim:true,

},
description:{
    type: String,
    required:true,
    trim:true,

},
views:{
    type:Number,
 default:0,
    required:true,

}
,
duration:{
type:Number,//cloudanary url
required:true,
},
Ispublished:{
    type:Boolean,
    default:true
},
Owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
},{timestamps :true})
export const video=mongoose.model("video",videoschema);