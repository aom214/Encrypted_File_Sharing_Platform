import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

const upload_on_cloudinary = async (file_url) => {
    try {
        // ✅ Configure Cloudinary (Ensure ENV Variables are Loaded)
        cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.API_KEY, 
            api_secret: process.env.API_SECRET
        });

        console.log("✅ Cloudinary ENV Check:", {
            CLOUD_NAME: process.env.CLOUD_NAME,
            API_KEY: process.env.API_KEY ? "✅ Loaded" : "❌ MISSING",
            API_SECRET: process.env.API_SECRET ? "✅ Loaded" : "❌ MISSING",
        });

        if (!file_url) throw new Error("❌ File path is required");

        // ✅ Read File as Buffer Instead of Path
        const fileBuffer = await fs.readFile(file_url);

        // ✅ Upload to Cloudinary as a Buffer
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    public_id: `uploads/${Date.now()}`,
                    secure: true, // ✅ Ensures HTTPS
                    overwrite: true, // ✅ Ensures updates
                },
                (error, result) => {
                    if (error) {
                        console.error("❌ Cloudinary Upload Failed:", error);
                        reject(error);
                    } else {
                        console.log("✅ Cloudinary Upload Success:", result.secure_url);
                        resolve(result);
                    }
                }
            ).end(fileBuffer);
        });

        // ✅ Delete File Only After Successful Upload
        await fs.unlink(file_url);
        console.log("🗑️ File deleted successfully after upload");

        return uploadResult.secure_url; // ✅ Always return HTTPS URL
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:", error);
        
        // ❌ Don't delete the file if upload fails
        return null;
    }
};

export default upload_on_cloudinary;
