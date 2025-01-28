import { number, object, string } from "yup";

export const createQuestionOptionValidationSchema = object({
  text: string().required("Write an actaul option"),
  image_url: string().nullable(),
  questionId: string().required("Question ID is required"),
});

export const updateQuestionOptionValidationSchema = object({
  text: string().nullable(),
  image_url: string().nullable(),
  questionId: number().nullable(),
});
