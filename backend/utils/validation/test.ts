import { number, object, string } from "yup";

export const createTestValidationSchema = object({
  subjectId: string().required("Subject ID is required"),
  classId: number().required("Class ID is required"),
});

export const updateTestValidationSchema = object({
  subjectId: string().nullable(),
  classId: string().nullable(),
});
