import { number, object, string } from "yup";

export const createSubjectValidationSchema = object({
  name: string().required("Subject name is required"),
  classId: number().required("Class id is required"),
  description: string().nullable(),
});

export const updateSubjectValidationSchema = object({
  name: string().nullable(),
  description: string().nullable(),
  classId: number().nullable(),
});
