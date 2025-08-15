import { Request, Response } from "express";
import { addCourseOffering } from "../services/course";

export const createCourseOffering = async (req: Request, res: Response) => {
  try {
    const { course_name, instructor_name, start_date, min_employees, max_employees } = req.body;

    if (!course_name || !instructor_name || !start_date || !min_employees || !max_employees) {
      return res.status(400).json({
        status: 400,
        message: "INPUT_DATA_ERROR",
        data: { failure: "Missing required fields" },
      });
    }

    const course_id = await addCourseOffering({
      course_name,
      instructor_name,
      start_date,
      min_employees,
      max_employees,
    });

    res.status(200).json({
      status: 200,
      message: "course added successfully",
      data: { success: { course_id } },
    });
  } catch (error: any) {
    if (error.code === "ConditionalCheckFailedException") {
      return res.status(400).json({
        status: 400,
        message: "COURSE_ALREADY_EXISTS",
      });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
