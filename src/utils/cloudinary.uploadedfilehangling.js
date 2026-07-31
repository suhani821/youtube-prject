import { v2 as fileupload } from "cloudinary";//renaming v2 as fileupload
import fs from "fs"//manages file and file systems 
import { syncBuiltinESMExports } from "module";
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const cloudanaryFileUpoad = async (localpathurl) => {

    try {
        if (!localpathurl) return null;
        const response = await cloudinary.uploader.upload(localpathurl, {//response will be in url form 
            resource_type: "auto"
        })
        //file uploaded successfully
        console.log("successfull upload", response.url)
        return response;
    } catch (error) {
        
        fs.unlinkSync(localpathurl)//removing file from server as uploading on cloudnary fails ., sync means do this unlinking first then move to next line
    return null;
    }

}
export {cloudanaryFileUpoad}