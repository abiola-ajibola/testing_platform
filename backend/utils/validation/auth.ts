import { object, ref, string } from "yup";
import { Role } from "../../constants";

export const loginValidationSchema = object({
  username: string().required("username is required"),
  password: string().required("password is required"),
});

export const changePasswordValidationSchema = object({
  username: string().required("username is required"),
  password: string().required("password is required"),
  new_password: string()
    .required("new password is required")
    .notOneOf(
      [ref("password"), null],
      "new password must be different from password"
    ),
});

export const signupValidationSchema = object({
  username: string().required("username is required"),
  password: string().required("password is required"),
  first_name: string().required("first name is required"),
  last_name: string().required("last name is required"),
  middle_name: string().nullable(),
  role: string().oneOf([Role.STUDENT, Role.ADMIN]).nullable(),
});

export const updateUserValidationSchema = object({
  username: string().nullable(),
  password: string().nullable(),
  first_name: string().nullable(),
  last_name: string().nullable(),
  middle_name: string().nullable(),
  role: string().oneOf([Role.STUDENT, Role.ADMIN]).nullable(),
});
