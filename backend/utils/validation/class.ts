import { object, string } from "yup";

export const createClassValidationSchema = object({
  name: string().required("Class name is required"),
  description: string().nullable(),
});

export const updateClassValidationSchema = object({
  name: string().nullable(),
  description: string().nullable(),
});
