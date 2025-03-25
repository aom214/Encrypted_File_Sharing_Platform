import {User} from "../Models/User.models.js"
import {Notification} from "../Models/Notification.models.js"
import upload_on_cloudinary from "../utils/cloudinary.js"
import encryptFile from "../utils/fileencryption.js"
import decryptFile from "../utils/filedecryption.js"
import fs from "fs"
import { Friend } from "../Models/Friend.models.js"


const generate_jwt_token = async(id)=>{
    try {
        const req_user= await User.findById(id);
        if (!req_user){
            throw new Error("user is not defined")
        }
        const refresh_token = await req_user.GenerateRefreshToken();
        const access_token = await req_user.GenerateAccessToken();
        if (!refresh_token || !access_token){
            throw new Error("erro in generating tokens")
        }
        return {access_token,refresh_token}

    } catch (error) {
        console.log("error in generating token:- ",error)
        throw error
    }
}
const Register=async(req,res,next)=>{

    const {firstName,lastName,email,password,username}=req.body
    if(!firstName || !lastName || !email || !password || !username){
        return res.status(400).json({"error":"all fields are mandatory except photo"})
    }
    if(firstName.length<2 || firstName.length>20){
        return res.status(400).json({"error":"length of firstName must be between 2 and 20"})
    }
    if(lastName.length<2 || lastName.length>20){
        return res.status(400).json({"error":"length of lastName must be between 2 and 20"})
    }
    if(username.length<4 || username.length>15){
        return res.status(400).json({"error":"length of username must be between 4 and 15"})
    }
    if(password.length<8){
        return res.status(400).json({"error":"length of password must be min 8 characters"})
    }
    if(await User.findOne({
        $or: [{ username: username }, { email: email }],
      })){
        return res.status(400).json({"error":"username or email already exist"})
    }
    console.log(req.file)
    let file_cloud_url=""
    if(!req.file){
        const file_url=""
    }
    else{
        const file_url=req.file["path"]
        if (file_url){
            const file_cloud_upload= await upload_on_cloudinary(file_url)
            file_cloud_url=file_cloud_upload?.url
            if (!file_cloud_url){
                return res.status(400).json({"error":"error in upload your profile image"})
            }
            console.log("image uploaded successfully on cloudinary:- "+file_cloud_url)
        }
    }
    const new_user=new User({
        firstName,
        lastName,
        email,
        password,
        username,
        profilePhoto:file_cloud_url
    })
    await new_user.save()
    const new_user_data=await User.findOne({
        _id:new_user._id
    }).select("-password -username -__v")
    return res.status(200).json({"user":new_user_data})
}


const get_user_jwt=async(req,res)=>{
    const user=req.user;
    if(!user){
        return res.status(400).json({"error":"user not found"})
    }
    return res.status(200).json({"user":user})
}
const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username or password cannot be null" });
        }

        const get_user = await User.findOne({ username });
        if (!get_user) {
            return res.status(400).json({ error: "There is no user with this username" });
        }

        const is_match = await get_user.is_password_correct(password);
        if (!is_match) {
            return res.status(400).json({ error: "Password is incorrect" });
        }

        const { access_token, refresh_token } = await generate_jwt_token(get_user._id);

        if (!access_token || !refresh_token) {
            return res.status(400).json({ error: "Error in generating tokens" });
        }

        get_user.accessToken = access_token;
        get_user.refreshToken = refresh_token;
        get_user.validateBeforeSave = false;
        await get_user.save();

        const main_user = await User.findById(get_user._id).select("-password -refreshToken -__v");
        if (!main_user) {
            return res.status(400).json({ error: "Cannot get user after saving tokens" });
        }

        // ✅ Set CORS Headers (Important)
        res.setHeader("Access-Control-Allow-Origin", "https://cybersecurityfrontend.onrender.com");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // ✅ Set Secure Cookies
        res.cookie("accessToken", access_token, {
            httpOnly: true,
            secure: true, // Ensure HTTPS
            sameSite: "None", // Allow cross-site requests
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie("refreshToken", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({ user: main_user });
    } catch (error) {
        console.error("🔥 Login Error:", error);
        return res.status(500).json({ error: "Login failed" });
    }
};



const Logout = async (req, res) => {
    console.log("Logging out...");
    console.log("Cookies:", req.cookies);

    if (!req.user) {
        return res.status(400).json({ "error": "Login first to log out" });
    }

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        path: "/",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        path: "/",
    });

    console.log("Logout successful");
    return res.status(200).json({ message: "Logged out successfully" });
};


const test = async (req,res)=>{
    const file_path=req.file["path"];
    console.log(file_path)
    let z=""
    let i=file_path.length - 1
    for (i; i >= 0; i--){
        if (file_path[i]=="."){
            z += file_path.slice(0, i);  
            z+="output"
            break
        }
    }
    console.log(i)
    if(z==""){
        await fs.promises.unlink(file_path);
        return res.status(400).json({"error":"no file extension"});
    }
    await encryptFile(file_path,z+file_path.slice(i));
    setTimeout(() => {
        decryptFile(z+file_path.slice(i),z+"newfile"+file_path.slice(i));
        console.log("filepath:-",z+"newfile"+file_path.slice(i))
      }, 4000);
    
    return res.status(200)
}

const get_all_users_not_frineds = async (req, res) => {
    try {
        const curr_user = req.user;
        if (!curr_user) {
            return res.status(400).json({ "error": "You need to login first to access this" });
        }

        // ✅ Step 1: Find all friends of the current user
        const curr_user_friends = await Friend.find({
            $or: [
                { userId1: curr_user._id },
                { userId2: curr_user._id }
            ]
        }).lean();

        // ✅ Step 2: Extract friend IDs (excluding curr_user)
        const friendIds = curr_user_friends.map(friend =>
            friend.userId1.toString() === curr_user._id.toString() ? friend.userId2 : friend.userId1
        );

        // ✅ Step 3: Find all pending friend requests sent by curr_user
        const pendingRequests = await Notification.find({
            sender: curr_user._id,
            file: false
        }).lean();

        // ✅ Step 4: Extract receiver IDs from pending requests
        const requestedUserIds = pendingRequests.map(req => req.receivers.toString());

        // ✅ Step 5: Find all users who are NOT friends and have NOT received a request
        const nonFriends = await User.find({
            _id: { $nin: [...friendIds, ...requestedUserIds, curr_user._id] } // Exclude friends, requested users, and self
        }).lean();

        return res.status(200).json({ "non-friends": nonFriends });

    } catch (error) {
        console.error("Error fetching non-friends:", error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
};


const request_friend = async (req, res) => {
    try {
        const curr_user = req.user;
        const { user_id } = req.params;

        // Check if requested user exists
        const requested_user = await User.findById(user_id);
        if (!requested_user) {
            return res.status(400).json({ "error": "Requested user not found" });
        }

        // Check if the friend request has already been sent
        const is_requested_before = await Notification.findOne({
            sender: curr_user._id,
            receivers: requested_user._id,  
            file: false
        });

        if (is_requested_before) {
            return res.status(400).json({ "error": "You have already requested this user" });
        }

        // Create new friend request
        const new_request = new Notification({
            sender: curr_user._id,
            receivers: requested_user._id,
            file: false
        });

        await new_request.save();

        return res.status(200).json({ "request": new_request });
    } catch (error) {
        console.error("Error in request_friend:", error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
}

const get_all_requests_received = async(req,res)=>{
    const curr_user= req.user;
    if(!curr_user){
        return res.status(400).json({"error":"you need to login first"})
    }
    const all_requests = await Notification.find({$and:[{receivers:curr_user},{file:false}]}).populate("receivers").populate("sender").sort({ createdAt: -1 });
    return res.status(200).json({"all_requests":all_requests})
}
const request_accepts = async (req, res) => {
    try {
        const curr_user = req.user;
        const { request_id } = req.params;

        if (!curr_user) {
            return res.status(400).json({ "error": "You need to log in first to access this." });
        }

        console.log("Request ID:", request_id);

        // ✅ Use `findOne()` instead of `find()`
        const is_true_request = await Notification.findOne({ _id: request_id, file: false });

        if (!is_true_request) {
            return res.status(400).json({ "error": "Either no request exists or the request is of file type." });
        }

        console.log("Valid request found:", is_true_request);

        // ✅ Ensure IDs are properly compared as strings
        const is_friend = await Friend.findOne({
            $or: [
                { $and: [{ userId1: curr_user._id.toString() }, { userId2: is_true_request.sender.toString() }] },
                { $and: [{ userId1: is_true_request.sender.toString() }, { userId2: curr_user._id.toString() }] }
            ]
        });

        if (is_friend) {
            return res.status(400).json({ "error": "You both are already friends." });
        }

        // ✅ Delete the notification
        const deletedNotification = await Notification.findOneAndDelete({ _id: request_id, file: false });

        if (!deletedNotification) {
            return res.status(400).json({ "error": "Request cannot be found." });
        }

        // ✅ Add new friend record
        const new_friend = new Friend({
            userId1: is_true_request.sender,
            userId2: curr_user._id
        });

        await new_friend.save();

        // ✅ Return a success response
        return res.status(200).json({ "message": "Friend request accepted!" });

    } catch (error) {
        console.error("Error accepting request:", error);
        return res.status(500).json({ "error": "Internal server error." });
    }
};
const profile=async(req,res)=>{
    const req_user= req.user;
    if (!req_user){
        return res.status(400).json({"error":"you need to login first"})
    }
    return res.status(200).json({"user":req_user})
}

const request_declines = async (req, res) => {
    try {
        const curr_user = req.user;
        const { request_id } = req.params;

        if (!curr_user) {
            return res.status(400).json({ "error": "You need to log in first to access this." });
        }

        console.log("Request ID:", request_id);

        // ✅ Use `findOne()` instead of `find()`
        const is_true_request = await Notification.findOne({ _id: request_id, file: false });

        if (!is_true_request) {
            return res.status(400).json({ "error": "Either no request exists or the request is of file type." });
        }

        console.log("Valid request found:", is_true_request);

        // ✅ Ensure IDs are properly compared as strings
        const is_friend = await Friend.findOne({
            $or: [
                { $and: [{ userId1: curr_user._id.toString() }, { userId2: is_true_request.sender.toString() }] },
                { $and: [{ userId1: is_true_request.sender.toString() }, { userId2: curr_user._id.toString() }] }
            ]
        });

        if (is_friend) {
            return res.status(400).json({ "error": "You both are already friends." });
        }

        // ✅ Delete the notification
        const deletedNotification = await Notification.findOneAndDelete({ _id: request_id, file: false });

        
        // ✅ Return a success response
        return res.status(200).json({ "message": "Friend request declined!" });

    } catch (error) {
        console.error("Error accepting request:", error);
        return res.status(500).json({ "error": "Internal server error." });
    }
};

export {Register,Login,get_user_jwt,Logout,generate_jwt_token,get_all_users_not_frineds,request_friend,get_all_requests_received,request_accepts,profile,request_declines,test}
