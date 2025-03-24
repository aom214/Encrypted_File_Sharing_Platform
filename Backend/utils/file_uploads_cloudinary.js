import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path"; 

const file_uploads_cloudinary = async (file_url) => {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    if (!file_url) throw new Error("File path is required");

    const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];
    const fileExtension = path.extname(file_url).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(
        `Unsupported file type: ${fileExtension}. Only ${allowedExtensions.join(", ")} are allowed.`
      );
    }

    const publicId = `uploads/${Date.now()}${fileExtension}`;

    // Ensure file exists before uploading
    try {
      await fs.access(file_url);
    } catch (err) {
      throw new Error(`File does not exist: ${file_url}`);
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file_url, {
      resource_type: "raw",
      public_id: publicId,
      type: "upload",
      overwrite: true,
    });

    console.log("Uploaded file URL:", uploadResult.secure_url);

    // Construct the raw file URL for access
    const rawUrl = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/raw/upload/${publicId}`;
    console.log("Raw File URL:", rawUrl);

    return { ...uploadResult, raw_url: rawUrl };

  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message || error);
    return null;
  }
};

export default file_uploads_cloudinary;
