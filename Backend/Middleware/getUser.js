import jwt from "jsonwebtoken";
import { generate_jwt_token } from "../Controller/User.controller.js";
import { User } from "../Models/User.models.js";
const getUser= async(req,res,next)=>{
    try {
        console.log("hello")
        const accessToken_new = req.cookies?.accessToken;
        const refreshToken_new = req.cookies?.refreshToken;
        console.log(`accessToken_new:-${accessToken_new} and refreshToken_new:-${refreshToken_new}`)
        if(accessToken_new){
            const decode = jwt.verify(accessToken_new,process.env.ACCESS_TOKEN_SECRET);
            const new_user = await User.findById(decode.id)
            if(!new_user){
                return next()
            }
            req.user=new_user 
            return next()
        }
        if(refreshToken_new){
            const decode = jwt.verify(refreshToken_new,process.env.REFRESH_TOKEN_SECRET);
            if(decode){
                console.log("inside refresh token")
                const {access_token,refresh_token} = await generate_jwt_token(decode.id)
                console.log(access_token,refresh_token)
                if(!access_token || !refresh_token){
                    return next()
                }
                const new_user = await User.findById(decode.id);
                if(!new_user){
                    return next()
                }
                new_user.accessToken=access_token;
                new_user.refreshToken=refresh_token;
                new_user.validateBeforeSave = false;
                await new_user.save()
                const new_req_user= await User.findById(decode.id)
                if(!new_req_user){
                    return next()
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
                req.user=new_req_user
                return next()
            }
        }
        return next()
    } catch (error) {
        console.log("error in get_user_middleware:- ",error)
        return next()
    }
}

export default getUser