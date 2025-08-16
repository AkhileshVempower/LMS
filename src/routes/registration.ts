import express from "express"
import { registerEmployee } from "../controllers/registration"


const router=express.Router()


router.post('/register/:course_id',registerEmployee)

export default router