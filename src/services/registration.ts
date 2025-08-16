import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../config/dynamoClient";
import { Registration } from "../types/registration";
import { TABLE_NAMES } from "../sharedConstants/tables";


export const registerForCourse= async ({employee_name,email,course_id}:Omit<Registration,"registration_id"|"status">)=>{
//check course exist
const courseData=await dynamoDB.send(
    new GetCommand({
        TableName:TABLE_NAMES.COURSE_OFFERINGS,
        Key:{course_id}
    })
)
if(!courseData.Item){
    throw new Error ("COURSE_NOT_FOUND")
}

//Check if course is full
const course=courseData.Item

if(course.Registrated_count>=course.max_employees){
    return({
        registration_id:"",
        status:"COURSE_FULL_ERROR"
    })
}

//check already exist

const registration_id=`${employee_name}-${course_id}`

const existing=await dynamoDB.send(
    new GetCommand({
        TableName:TABLE_NAMES.REGISTRATION,
        Key:{registration_id}
    })
)
  if(existing.Item){
       throw new Error("ALREADY_REGISTERED") 
    }
    //Register Employee
    
    const newRegistration:Registration={
        registration_id,
        employee_name,
        email,
        course_id,
        status:"ACCEPTED"
    }


await dynamoDB.send(new PutCommand({
    TableName:TABLE_NAMES.REGISTRATION,
    Item:newRegistration
}))

//Update reg count

dynamoDB.send(new UpdateCommand({
    TableName:TABLE_NAMES.REGISTRATION,
    Key:{course_id},
    UpdateExpression:"SET registered_count=registered_count+:inc",
    ExpressionAttributeValues:{":inc":1}
}))

return{
    registration_id,
    status:"ACCEPTED"
}

}
