export interface Registration{
    registration_id:string,
    employee_name:string,
    email:string,
    course_id:string
    status:"ACCEPTED"|"COURSE_FULL_ERROR"
}