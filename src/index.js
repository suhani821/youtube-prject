
import dotenv from "dotenv";
import Constdb from "./db/index.js";
import app from "./app.js";
dotenv.config({
    path: "./.env"
});
Constdb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server is running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
});

// ( async ()=>{
//     try{
//     await mongoose.connect(`${process.env.DB-URI}/${DB_NAME}`)
//     }
//     catch(err){
//         console.log(err);
//     }

// })()