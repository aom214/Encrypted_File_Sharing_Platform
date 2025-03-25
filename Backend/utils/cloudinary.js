import { v2 as cloudinary } from 'cloudinary';
import fs from "fs/promises";
import crypto from "crypto";
const upload_on_cloudinary = async (file_url) => {
    try {
        cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.API_KEY, 
            api_secret: process.env.API_SECRET
        });
        console.log("Cloudinary ENV Check:", {
            CLOUD_NAME: process.env.CLOUD_NAME,
            API_KEY: process.env.API_KEY,
            API_SECRET: process.env.API_SECRET,
          });
        if (!file_url) throw new Error("File path is required");

        const uploadResult = await cloudinary.uploader.upload(file_url, {
            resource_type: "raw",
            public_id: `uploads/${Date.now()}`, 
        });
        fs.unlink(file_url, (err) => {
            if (err) {
                console.error("File deletion error:", err);
                throw err
            } else {
                console.log("File deleted successfully");
            }
        });
        return uploadResult;
    } catch (error) {
        if(file_url){
            fs.unlink(file_url, (err) => {
                if (err) {
                    console.error("File deletion error:", err);
                } else {
                    console.log("File deleted successfully");
                }
            });
        }
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

export default upload_on_cloudinary;