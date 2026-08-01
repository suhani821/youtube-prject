//to store file uploaded by user in local disk server;

import multer from "multer";
const storage = multer.diskStorage({
    destination: function(req, file ,cb){
        cb(null, "./public/temp")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
export const upload =multer({storage,})