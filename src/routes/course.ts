import express from "express"
import { createCourseOffering } from "../controllers/course"

const router=express.Router()


router.post("/add/courseOffering",createCourseOffering)

export default router