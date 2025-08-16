import { Request, Response } from "express";
import { cancelRegistration, registerForCourse } from "../services/registration";

//registering employee
export const registerEmployee=async (req:Request,res:Response)=>{
try{const {employee_name,email}=req.body
const {course_id}=req.params
//input field check
if(!employee_name||!email||!course_id){
    return res.status(400).json({
        status: 400,
        message:"INPUT_DATA_ERROR",
        data:{failure: { Message: "Missing required fields" }}
    })
}

const result=await registerForCourse({employee_name,email,course_id})

if(result.status=="COURSE_FULL_ERROR"){
    return res.status(400).json({
        status:400,
        message:"COURSE_FULL_ERROR",
        data:{failure:{failure: { Message: "Cannot register, course is full" }}}
    })
}
   res.status(200).json({
      status: 200,
      message: `Successfully registered for ${course_id}`,
      data: {
        success: {
          registration_id: result.registration_id,
          status: result.status,
        },
      },
    });

}
catch(error:any){
  if (error.message === "COURSE_NOT_FOUND") {
      return res.status(404).json({ status: 404, message: "Course not found" });
    }
    if (error.message === "ALREADY_REGISTERED") {
      return res.status(400).json({ status: 400, message: "Already registered" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }

}


// cancel registration



export const cancelRegistrationController = async (req: Request, res: Response) => {
  try {
    const { registration_id } = req.params;

    const result = await cancelRegistration(registration_id);

    res.status(200).json({
      status: 200,
      message: "Registration cancelled successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
      error: error.message,
    });
  }
};
