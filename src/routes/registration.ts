import express from "express"
import { cancelRegistrationController, registerEmployee } from "../controllers/registration"


const router=express.Router()


router.post('/add/register/:course_id',registerEmployee)
router.delete("/:registration_id", cancelRegistrationController)

export default router