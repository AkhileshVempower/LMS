import { Request, Response } from "express";
import { allotCourse } from "../services/allotment";


export const allotCourseController=async(req:Request,res:Response)=>{
    try{
        const {course_id}=req.params
        const results=await allotCourse(course_id)

        res.status(200).json({
            status:200,
            message:"successfully alloted course to registered employee",
            data:{success:results}
        })

    }
    catch(error:any){
   if (error.message === "COURSE_NOT_FOUND") {
      return res.status(404).json({ status: 404, message: "Course not found" });
    }
    if (error.message === "ALLOTMENT_CLOSED") {
      return res.status(400).json({ status: 400, message: "ALLOTMENT_CLOSED" });
    }
    if (error.message === "NO_REGISTRATIONS") {
      return res.status(400).json({ status: 400, message: "No registrations found" });
    }
    res.status(500).json({ status: 500, message: "Server Error", error: error.message });
  }
    
}