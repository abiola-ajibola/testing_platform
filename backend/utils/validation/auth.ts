import { NextFunction, Request, Response } from "express";
import { object, ref, string } from "yup";

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
});
