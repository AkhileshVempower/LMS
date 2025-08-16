export interface AllotmentResult {
  registration_id: string;
  employee_name: string;
  email: string;
  course_id: string;
  course_name: string;
  instructor_name: string;
  start_date: string;
  status: "ACCEPTED" | "COURSE_CANCELED";
}
