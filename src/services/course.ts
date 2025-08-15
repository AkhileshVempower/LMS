import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../config/dynamoClient";
import { CourseOffering } from "../types/course";
import { TABLE_NAMES } from "../sharedConstants/tables";


export const addCourseOffering = async (course: Omit<CourseOffering, "course_id"|"registered_count">) => {
  const course_id = `OFFERING-${course.course_name}-${course.instructor_name}`;

  const newCourse: CourseOffering = {
    ...course,
    course_id,
    registered_count: 0,
  };

  await dynamoDB.send(
    new PutCommand({
      TableName: TABLE_NAMES.COURSE_OFFERINGS,
      Item: newCourse,
      ConditionExpression: "attribute_not_exists(course_id)",
    }))
    ;

  return course_id;
};
