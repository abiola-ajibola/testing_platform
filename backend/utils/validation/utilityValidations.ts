import { object, string } from "yup";

export const idParamValidationSchema = object({
  id: string()
    .test("", "Please enter a valid id", (value) => {
      return !!value && !isNaN(+value);
    })
    .required("Please enter a valid id"),
});
