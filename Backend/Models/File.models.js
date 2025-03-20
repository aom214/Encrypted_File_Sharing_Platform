import mongoose from "mongoose"
const FileSchema = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    fileUrl:{
        type:String,
        required:true 
    },
    fileKey:{
        type:String,
        required:true 
    },
    open:{
        type:Boolean,
        default:false,
        required:true
    },
    file_type:{
        type:String,
        required:true,
    }
},{"timestamps":true})
export const FileModel=mongoose.model("File",FileSchema)


