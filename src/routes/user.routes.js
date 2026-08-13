import {Router} from "express";
import {upload} from "../middleware/multer.middleware.js"
import {registerUser ,loginUser ,logOutUser} from "../controllers/user.controller.js"
import {verifyjwt } from "../middleware/auth.middleware.js"
const router = Router();
router.route("/register").post(  
    //middleware inject just before the method used ,,, (jo kerna h kero bas usse phele mujse milke jaoo: middleware work)
    upload.fields([{
        name: "avatar",//same as fronted , communication is important
        maxCount: 1
    },{
        name: "coverimage",
        maxCount: 1,
    }])
    ,registerUser);
router.route("/login").post(loginUser)
router.route("/logout").post(verifyjwt,logOutUser)

export default router ;