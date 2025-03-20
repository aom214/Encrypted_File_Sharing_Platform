import { Friend } from "../Models/Friend.models.js";
import fileencryption from "../utils/fileencryption.js"
import filedecryption from "../utils/filedecryption.js"
import upload_on_cloudinary from "../utils/cloudinary.js";
import { FileModel } from "../Models/File.models.js";
import fs from "fs"

const shareFile=async(req,res)=>{
    const user=req.user;
    if(!user){
        return res.status(400).json({"error":"login first to share this file"})
    }
    const {user2Id}= req.params
    if(!user2Id){
        return res.status(400).json({"error":"user id is required"})}
    console.log(user)
    console.log(`user1:- ${user._id}, user2:-${user2Id}`)
    const is_friends = (await Friend.findOne({userId1:user,userId2:user2Id}) || await Friend.findOne({userId1:user2Id,userId2:user}))
    console.log(is_friends)
    if(!is_friends){
        return res.status(400).json({"error":"you want to be a friend to share file"})
    }
    const file_multer_url= req.file?.["path"]
    console.log("multer path")
    console.log(file_multer_url)
    if(!file_multer_url){
        return res.status(400).json({"error":"file is required"})
    }

    //file output url calculation:-- 

    let z=""
    let i=file_multer_url.length - 1
    for (i; i >= 0; i--){
        if (file_multer_url[i]=="."){
            z += file_multer_url.slice(0, i);  
            z+="output"
            break
        }
    }
    console.log(i)
    if(z==""){
        await fs.promises.unlink(file_multer_url);
        return res.status(400).json({"error":"no file extension"});
    }
    const output_encrypted_url=z+"new_file"

    await fileencryption(file_multer_url,output_encrypted_url)
    // await filedecryption(output_encrypted_url,z+"newfile"+file_multer_url.slice(i))
    //upload on cloudinary:--
    const cloud_url = await upload_on_cloudinary(output_encrypted_url)
    console.log(cloud_url)
    // await filedecryption(cloud_url.url,z+"newfile"+file_multer_url.slice(i))
    console.log(cloud_url.url)
    // await filedecryption(cloud_url.url,z+"new+main_file"+file_multer_url.slice(i))

    console.log("uploaded encrypted file to cloudinary")


    // return res.status(200).json({"file":cloud_url})

    if(!cloud_url){
        return res.status({"error":"error in uploading file to cloudinary"})
    }

    const new_file= new FileModel({
        senderId:user._id,
        receiverId:user2Id,
        fileUrl:cloud_url.url,
        fileKey:"0000",
        file_type:file_multer_url.slice(i)
    })
    await new_file.save();
    return res.status(200).json({"file":new_file})
}

export {shareFile}