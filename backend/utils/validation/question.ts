import { number, object, string } from "yup";

export const createQuestionValidationSchema = object({
  subjectId: string().required("Subject ID is required"),
  correctOptionId: number().required("Specify correct option ID"),
  explanation: string().nullable(),
  explanationImageUrl: string().nullable(),
});

export const updateQuestionValidationSchema = object({
  subjectId: string().nullable(),
  correctOptionId: string().nullable(),
  explanation: number().nullable(),
  explanationImageUrl: string().nullable(),
});
