import express from "express"
import { view_friends } from "../Controller/friend.controller.js"
import getUser from "../Middleware/getUser.js"
const router=express.Router({ mergeParams: true })

router.get("/",getUser,view_friends)

export default router