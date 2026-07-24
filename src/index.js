import dotenv from "dotenv";
import Constdb from "./db/index.js";
dotenv.config({
    path: "./.env"
});
Constdb();
//ifissin this we directly callback function or we can use tradition method
// ( async ()=>{
//     try{
//     await mongoose.connect(`${process.env.DB-URI}/${DB_NAME}`)
//     }
//     catch(err){
//         console.log(err);
//     }

// })()