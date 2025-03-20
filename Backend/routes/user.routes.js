import express from "express"
import { get_all_users_not_frineds, Login, Logout, Register, request_friend, test } from "../Controller/User.controller.js"
import upload from "../Middleware/multer.js"
import getUser from "../Middleware/getUser.js"
import friend_router from "./friends.routes.js"
const router = express.Router()
router.post("/Register",upload.single("profile_photo"),Register)
router.get("/Login",Login)
router.get("/Logout",getUser,Logout)
router.get("/get_all_non_friends",getUser,get_all_users_not_frineds)
router.get("/request/:user_id",getUser,request_friend)
router.use("/friends",friend_router)
// router.get("/friends/:user2Id/files/share",upload.single("shared_file"),getUser,shareFile)
export default router