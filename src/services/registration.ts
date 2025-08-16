import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../config/dynamoClient";
import { Registration } from "../types/registration";
import { TABLE_NAMES } from "../sharedConstants/tables";
import { todaysDate } from "../utils/Date";


// registration service
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
    TableName:TABLE_NAMES.COURSE_OFFERINGS,
    Key:{course_id},
    UpdateExpression:"SET registered_count=registered_count+:inc",
    ExpressionAttributeValues:{":inc":1}
}))

return{
    registration_id,
    status:"ACCEPTED"
}

}

//Cancel registration service
export const cancelRegistration = async (registration_id: string) => {
  //  Fetch registration
  const regData = await dynamoDB.send(
    new GetCommand({
      TableName: TABLE_NAMES.REGISTRATION,
      Key: { registration_id },
    })
  );

  if (!regData.Item) {
    throw new Error("REGISTRATION_NOT_FOUND");
  }

  const registration = regData.Item;

  //  Fetch course
  const courseData = await dynamoDB.send(
    new GetCommand({
      TableName: TABLE_NAMES.COURSE_OFFERINGS,
      Key: { course_id: registration.course_id },
    })
  );

  if (!courseData.Item) {
    throw new Error("COURSE_NOT_FOUND");
  }

  const course = courseData.Item;

  // 3️⃣ Check if allotment is already closed
  const today = parseInt(todaysDate());
  const startDate = parseInt(course.start_date);

  if (today >= startDate) {
    throw new Error("ALLOTMENT_ALREADY_COMPLETED");
  }

  // 4️⃣ Delete registration
  await dynamoDB.send(
    new DeleteCommand({
      TableName: TABLE_NAMES.REGISTRATION,
      Key: { registration_id },
    })
  );

  // 5️⃣ Decrement registered_count in course
  await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAMES.COURSE_OFFERINGS,
      Key: { course_id: registration.course_id },
      UpdateExpression: "SET registered_count = registered_count - :dec",
      ExpressionAttributeValues: {
        ":dec": 1,
        ":zero": 0,
      },
      ConditionExpression: "registered_count > :zero", 
    })
  );

  return {
    registration_id,
    status: "CANCELLED",
  };
};
