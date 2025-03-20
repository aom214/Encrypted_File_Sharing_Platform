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

const Login=async(req,res)=>{
    const {username,password}=req.body 
    if (!username || !password){
        return res.status(400).json({"error":"username or password cannot be null"})
    }
    const get_user = await User.findOne({username:username})
    if(!get_user){
        return res.status(400).json({"error":"there is no user with this username"})
    }
    const is_match=await get_user.is_password_correct(password)
    console.log(password)
    console.log(is_match)
    if(!is_match){
        return res.status(400).json({"error":"password is incorrect"})
    }
    const {access_token,refresh_token}= await generate_jwt_token(get_user._id);

    console.log(access_token)

    if(!access_token || !refresh_token){
        return res.status(400).json({"error":"error in generating tokes"})
    }

    console.log("hello dncdnc")
    get_user.accessToken=access_token;
    get_user.refreshToken=refresh_token;
    get_user.validateBeforeSave = false;
    await get_user.save();
    console.log("hello im here ")
    const main_user=await User.findById(get_user._id).select("-password -refreshToken -__v")


    if(!main_user){
        return res.status(400).json({"error":"cannot get user after saving tokens"})
    }
    res.cookie("accessToken", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, 
    });
    res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    return res.status(200).json({"user":main_user,"accessToken":access_token,"refreshToken":refresh_token})
}


const Logout = async(req,res)=>{
    const req_user= req.user;
    console.log("nothing")
    console.log(req_user)
    if(!req_user){
        return res.status(400).json({"error":"login first for logout"})
    }
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.status(200).json({ "message": "Logged out successfully" });
}

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


const get_all_users_not_frineds=async(req,res)=>{
    const curr_user = req.user;

    if (!curr_user) {
        return res.status(400).json({ "error": "You need to login first to access this" });
    }

    // Find all friends of the current user
    const curr_user_friends = await Friend.find({
        $or: [
            { userId1: curr_user._id },
            { userId2: curr_user._id }
        ]
    })
    .populate("userId1 userId2") // Get full user details
    .lean();

    // Extract friend IDs (exclude curr_user)
    const friendIds = curr_user_friends.map(friend =>
        friend.userId1._id.toString() === curr_user._id.toString() ? friend.userId2._id : friend.userId1._id
    );

    // Find all users who are NOT friends with curr_user
    const nonFriends = await User.find({
        _id: { $nin: [...friendIds, curr_user._id] } // Exclude friends & curr_user
    }).lean();

    console.log(nonFriends); 

    return res.status(200).json({ "non-friends": nonFriends });

}

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
    const all_requests = await Notification.find({$and:[{receivers:curr_user},{file:false}]})
    return res.status(200).json({"all_requests":all_requests})
}

const request_accepts = async (req,res) =>{
    const curr_user =req.user
    const {request_id} = req.params 
    if(!curr_user){
        return res.status(400).json({"error":"you need to loigin first to acces this"})
    }
    const is_true_request = await Notification.find({$and:[{_id:request_id},{file:false}]})
    if(is_true_request.length!=0){
        return res.status(400).json({"error":"either there is no request or the request is of file type"})
    }
    const is_friend = await Friend.findOne({$or:[{$and:[{userId1:curr_user},{userId2:is_true_request.sender}]},{$and:[{$and:[{userId1:curr_user},{userId2:is_true_request.sender}]}]}]})

    if(is_friend){
        return res.status(400).json({"error":"you both are already friends of each others"})
    }
    const deletedNotification = await Notification.findOneAndDelete({$and:[{_id:request_id},{file:false}]});
    if(!deletedNotification){
        return res.status(400).json({"error":"request cannot be found"})
    }
    const new_friend= new Friend({
        userId1:is_true_request.sender,
        userId2:curr_user
    })

    await new_friend.save()
}

export {Register,Login,Logout,generate_jwt_token,get_all_users_not_frineds,request_friend,get_all_requests_received,request_accepts,test}