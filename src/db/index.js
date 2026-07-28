import mongoose from "mongoose";
import { DB_NAME } from "../Constants.js"; 
let Constdb = async () => {
    try {
        let connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`);
        console.log(`database is connected successfully ${connectionInstance.connection.host}`);
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
        throw err;
    }
}

export default Constdb;