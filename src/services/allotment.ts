import { GetCommand, UpdateCommand,ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamoDB } from "../config/dynamoClient"
import { TABLE_NAMES } from "../sharedConstants/tables"
import { AllotmentResult } from "../types/allotment"
import { todaysDate } from "../utils/Date"
import { Registration } from "../types/registration"





export const allotCourse=async (course_id:string):Promise<AllotmentResult[]>=>{

//fetch course
//check exist
const courseData=await dynamoDB.send(new GetCommand({
    TableName:TABLE_NAMES.COURSE_OFFERINGS,
    Key:{course_id}
}))

if(!courseData.Item){
    throw new Error("COURSE_NOT_FOUND")
}

const course=courseData.Item

//check date
const today=parseInt(todaysDate())
const startDate=parseInt(course.start_date)
if(today>startDate){
    throw new Error("ALLOTMENT_CLOSED")
}

//check all registration

const registrations=await dynamoDB.send(new ScanCommand({
    TableName:TABLE_NAMES.REGISTRATION,
    FilterExpression:"course_id= :c",
    ExpressionAttributeValues:{":c":course_id},
}))

  if (!registrations.Items || registrations.Items.length === 0) {
    throw new Error("NO_REGISTRATIONS");
  }

let finalStatus: "ACCEPTED" | "COURSE_CANCELED" =
  course.registered_count < course.min_employees ? "COURSE_CANCELED" : "ACCEPTED";


  // registration with final status
  const results: AllotmentResult[] = [];

//update registration
const regItems = registrations.Items as unknown as Registration[]; 
for (const reg of regItems ) {
  await dynamoDB.send(new UpdateCommand({
    TableName: TABLE_NAMES.REGISTRATION,
    Key: { registration_id: reg.registration_id },
    UpdateExpression: "SET #s = :s",
    ExpressionAttributeNames: { "#s": "status" },
    ExpressionAttributeValues: { ":s": finalStatus },
  }));

  results.push({
    registration_id: reg.registration_id,
    employee_name: reg.employee_name,
    email: reg.email,
    course_id: reg.course_id,
    course_name: course.course_name,
    instructor_name: course.instructor_name,
    start_date: course.start_date,
    status: finalStatus,
  });
}

//sort registration

results.sort((a, b) => a.registration_id.localeCompare(b.registration_id));
return results;
























}