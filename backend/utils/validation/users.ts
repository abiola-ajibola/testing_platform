import { number, object, string } from "yup";
import { Role } from "../../constants";

export const getUsersValidationSchema = object({
  page: number().nullable(),
  perPage: number().nullable(),
  username: string().nullable(),
  first_name: string().nullable(),
  last_name: string().nullable(),
  middle_name: string().nullable(),
  role: string().oneOf([Role.STUDENT, Role.ADMIN]).nullable(),
  // TODO add a field for classes
});
