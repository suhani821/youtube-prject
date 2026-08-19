import mongoose ,{Schema, schema} from "mongoose"
const subscriptionSchema = new schema({
    subscriber:{
        type: Schema.Types.ObjectId,//one who is subscribing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Supscriptionbscription= mongoose.model("Supscription", subscriptionSchema)