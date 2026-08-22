import {Router} from "express";
import {upload} from "../middleware/multer.middleware.js"
import {registerUser ,loginUser ,logOutUser,refreshAccessToken ,updateCoverImage,getUserProfile,getWatchHistory,updateUserAvatar, createNewPassword,getCurrentUser,updateUserDetails} from "../controllers/user.controller.js"
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
router.route("/refresh_token").post(refreshAccessToken)
router.route("/change_userPassword").post(verifyjwt,createNewPassword)
router.route("/current_user").post(verifyjwt,getCurrentUser)
router.route("/update_accountDetails").patch(verifyjwt,updateUserDetails)
router.route("/update_avatar").patch(verifyjwt,upload.single("avatar"),updateUserAvatar)
router.route("/update_coverImage").patch(verifyjwt,upload.single("coverImage"),updateCoverImage)
router.route("/channel/:username").get(verifyjwt,getUserProfile)
router.route("/watchhistory").get(verifyjwt,getWatchHistory)//as user is not sending anything so using get


export default router ;
