import express from "express";
import { allotCourseController } from "../controllers/allotment";

const router = express.Router();

router.post("/:course_id", allotCourseController);

export default router;
