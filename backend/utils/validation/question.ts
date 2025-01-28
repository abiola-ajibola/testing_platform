import { array, number, object, string } from "yup";

export const createQuestionValidationSchema = object({
  subjectId: string().required("Subject ID is required"),
  correctOptionId: number().nullable(),
  explanation: string().nullable(),
  explanationImageUrl: string().nullable(),
  options: array(
    object({
      text: string().required("Option text is required"),
      image_url: string().nullable(),
      correct: string().nullable(),
    })
  ).nullable(),
});

export const getAllValidationSchema = object({
  page: number().nullable(),
  perPage: number().nullable(),
  role: string().nullable(),
  text: string().nullable(),
  subjectId: string()
    .test("", "Please enter a valid subjectId", (value) => {
      console.log({ value1: value });
      return !!value && !isNaN(+value);
    })
    .nullable(),
  explanation: string().nullable(),
  explanationImageUrl: string().nullable(),
});

export const updateQuestionValidationSchema = object({
  subjectId: string().nullable(),
  correctOptionId: string().nullable(),
  explanation: number().nullable(),
  explanationImageUrl: string().nullable(),
  options: array(
    object({
      text: string().nullable(),
      image_url: string().nullable(),
      correct: string().nullable(),
    })
  ).nullable(),
});
