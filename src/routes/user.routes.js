import {Router} from "express";
import {upload} from "../middleware/multer.middleware.js"
import {registerUser} from "../controllers/user.controller.js"
const router = Router();
router.route("/register").post(  
    //middleware inject just before the method used ,,, (jo kerna h kero bas usse phele mujse milke jaoo: middleware work)
    upload.fields({
        name: "avatar",//same as fronted , communication is important
        maxcount: 1
    },{
        name: "coverimage",
        maxcount: 1,
    })
    ,registerUser);


export default router ;