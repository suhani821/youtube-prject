import express from 'express';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';

//use : for configuring the app or for middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json({
    limit: "130kb"
}));
app.use(express.urlencoded({

    extended: true,
    limit: "130kb"
}));
app.use(cookieParser());
app.use(express.static("public"));

//routes import
import userRouter from "./routes/user.routes.js";
//we can give name according to us (userRouter) only when export is default
//route declaration

app.use("/api/v2/user",userRouter)

export default app;



