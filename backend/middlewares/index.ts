import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { AnyObject, ObjectSchema } from "yup";
import { Role } from "../constants";

type TValidateSchema<T extends AnyObject> = ObjectSchema<T, AnyObject, T, "">;

export function validateBody(schema: TValidateSchema<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);
    } catch (e) {
      console.log({ e });
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ReasonPhrases.BAD_REQUEST });
      return;
    }
    next();
  };
}
export function validateQuery(schema: TValidateSchema<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.query);
    } catch (e) {
      console.log({ e });
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ReasonPhrases.BAD_REQUEST });
      return;
    }
    next();
  };
}
