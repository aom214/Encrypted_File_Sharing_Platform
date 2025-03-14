import mongoose from "mongoose"
const db_connect = async()=>{
    try {
        const mongoURL=`mongodb+srv://aomk:${process.env.DB_PASSWORD}@filesharing.lr1ky.mongodb.net/?retryWrites=true&w=majority&appName=FileSharing`
        const connection=await mongoose.connect(mongoURL);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.log("get error:- ", error.message);
        process.exit(1);
    }
}
export default db_connect