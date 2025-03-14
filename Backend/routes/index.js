import express from "express"
import testrouter from "./test.js"
const router=express.Router({ mergeParams: true })

router.use("/t1",testrouter)

export default router